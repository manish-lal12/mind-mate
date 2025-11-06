import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getLLMResponse } from "~/server/llm/client";
import type { Message } from "~/server/llm/client";

export const chatRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ message: z.string().min(1), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.db.chat.create({
        data: {
          userId: input.userId,
          title: input.message.substring(0, 50),
          messages: {
            create: {
              content: input.message,
              role: "user",
            },
          },
        },
        include: {
          messages: true,
        },
      });
      return chat;
    }),

  getAll: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const chats = await ctx.db.chat.findMany({
        where: {
          userId: input.userId,
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          _count: {
            select: {
              messages: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 50,
      });
      return chats;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const chat = await ctx.db.chat.findFirst({
        where: {
          id: input.id,
          userId: input.userId,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
      return chat;
    }),

  addMessage: publicProcedure
    .input(
      z.object({
        chatId: z.string(),
        userId: z.string(),
        content: z.string().min(1),
        role: z.enum(["user", "assistant"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user owns this chat
      const chat = await ctx.db.chat.findFirst({
        where: {
          id: input.chatId,
          userId: input.userId,
        },
      });

      if (!chat) {
        throw new Error("Chat not found or unauthorized");
      }

      const message = await ctx.db.message.create({
        data: {
          chatId: input.chatId,
          content: input.content,
          role: input.role,
        },
      });

      // Update chat's updatedAt timestamp
      await ctx.db.chat.update({
        where: { id: input.chatId },
        data: { updatedAt: new Date() },
      });

      return message;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.db.chat.findFirst({
        where: {
          id: input.id,
          userId: input.userId,
        },
      });

      if (!chat) {
        throw new Error("Chat not found or unauthorized");
      }

      await ctx.db.chat.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  updateTitle: publicProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        title: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const chat = await ctx.db.chat.findFirst({
        where: {
          id: input.id,
          userId: input.userId,
        },
      });

      if (!chat) {
        throw new Error("Chat not found or unauthorized");
      }

      const updated = await ctx.db.chat.update({
        where: { id: input.id },
        data: { title: input.title },
      });

      return updated;
    }),

  // New procedure: Generate LLM response and stream it
  generateResponse: publicProcedure
    .input(
      z.object({
        chatId: z.string(),
        userId: z.string(),
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          }),
        ),
        model: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user owns this chat
      const chat = await ctx.db.chat.findFirst({
        where: {
          id: input.chatId,
          userId: input.userId,
        },
      });

      if (!chat) {
        throw new Error("Chat not found or unauthorized");
      }

      // Convert to Message format for LLM
      const llmMessages: Message[] = input.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Get LLM response
      const response = await getLLMResponse(llmMessages, input.model);

      // Save assistant message to database
      const assistantMessage = await ctx.db.message.create({
        data: {
          chatId: input.chatId,
          content: response,
          role: "assistant",
        },
      });

      // Update chat's updatedAt timestamp
      await ctx.db.chat.update({
        where: { id: input.chatId },
        data: { updatedAt: new Date() },
      });

      return assistantMessage;
    }),
});
