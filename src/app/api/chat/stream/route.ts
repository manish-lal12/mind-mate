import { auth } from "~/lib/auth";
import { prisma as db } from "~/lib/db";
import { getLLMResponse } from "~/server/llm/client";

export async function POST(req: Request) {
  try {
    // Get authenticated session
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { chatId, message } = await req.json();

    if (!chatId || !message) {
      return new Response("Missing chatId or message", { status: 400 });
    }

    // Verify user owns this chat
    const chat = await db.chat.findUnique({
      where: { id: chatId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }

    if (chat.userId !== session.user.id) {
      return new Response("Forbidden", { status: 403 });
    }

    // Save user message to database
    await db.message.create({
      data: {
        chatId,
        content: message,
        role: "user",
      },
    });

    // Prepare messages for LLM (conversation history)
    const messages = (chat.messages ?? []).map(
      (msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }),
    );

    // Add current user message
    messages.push({
      role: "user",
      content: message,
    });

    // Get LLM model from env
    const model = process.env.LLM_MODEL ?? "gpt-4-turbo";

    // Get LLM response
    const llmResponse = await getLLMResponse(messages, model);

    // Save assistant message to database
    await db.message.create({
      data: {
        chatId,
        content: llmResponse,
        role: "assistant",
      },
    });

    return new Response(JSON.stringify({ response: llmResponse }), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Stream error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
