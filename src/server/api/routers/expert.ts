import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const expertRouter = createTRPCRouter({
  // Get all experts with optional filters
  getAll: publicProcedure
    .input(
      z.object({
        profession: z.enum(["therapist", "doctor", "consultant"]).optional(),
        specialties: z.array(z.string()).optional(),
        minRating: z.number().min(0).max(5).optional(),
        sortBy: z.enum(["rating", "experience", "price"]).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = { isVerified: true };

      if (input.profession) {
        where.profession = input.profession;
      }

      if (input.specialties && input.specialties.length > 0) {
        where.specialties = {
          hasSome: input.specialties,
        };
      }

      if (input.minRating) {
        where.rating = {
          gte: input.minRating,
        };
      }

      type OrderBy = Record<string, "asc" | "desc">;
      let orderBy: OrderBy = { rating: "desc" };
      if (input.sortBy === "experience") {
        orderBy = { yearsExperience: "desc" };
      } else if (input.sortBy === "price") {
        orderBy = { hourlyRate: "asc" };
      }

      const experts = await ctx.db.expert.findMany({
        where,
        orderBy,
        take: input.limit,
        skip: input.offset,
        select: {
          id: true,
          name: true,
          profession: true,
          specialties: true,
          bio: true,
          profileImage: true,
          hourlyRate: true,
          yearsExperience: true,
          rating: true,
          totalReviews: true,
        },
      });

      const total = await ctx.db.expert.count({ where });

      return {
        experts,
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  // Get expert by ID with full details
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const expert = await ctx.db.expert.findUnique({
        where: { id: input.id },
        include: {
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
              createdAt: true,
            },
          },
        },
      });

      if (!expert) {
        throw new Error("Expert not found");
      }

      return expert;
    }),

  // Search experts by problem area
  searchByProblem: publicProcedure
    .input(
      z.object({
        problem: z.string(),
        limit: z.number().min(1).max(50).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const experts = await ctx.db.expert.findMany({
        where: {
          AND: [
            { isVerified: true },
            {
              OR: [
                { specialties: { hasSome: [input.problem] } },
                { bio: { contains: input.problem, mode: "insensitive" } },
              ],
            },
          ],
        },
        take: input.limit,
        select: {
          id: true,
          name: true,
          profession: true,
          specialties: true,
          bio: true,
          profileImage: true,
          hourlyRate: true,
          rating: true,
        },
      });

      return experts;
    }),

  // Get specialties with problem categories
  getSpecialties: publicProcedure.query(async ({ ctx }) => {
    const specialties = await ctx.db.problemCategory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
      },
    });

    return specialties;
  }),

  // Book a consultation (protected)
  bookConsultation: protectedProcedure
    .input(
      z.object({
        expertId: z.string(),
        title: z.string(),
        description: z.string().optional(),
        problem: z.string(),
        scheduledDate: z.date(),
        duration: z.number().min(15).max(180).default(60),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const expert = await ctx.db.expert.findUnique({
        where: { id: input.expertId },
      });

      if (!expert) {
        throw new Error("Expert not found");
      }

      const totalCost = (expert.hourlyRate * input.duration) / 60;

      const consultation = await ctx.db.consultation.create({
        data: {
          userId: ctx.session.user.id,
          expertId: input.expertId,
          title: input.title,
          description: input.description,
          problem: input.problem,
          scheduledDate: input.scheduledDate,
          duration: input.duration,
          totalCost: Math.round(totalCost),
          status: "pending",
          paymentStatus: "pending",
        },
      });

      return consultation;
    }),

  // Get user's consultations (protected)
  getUserConsultations: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(["pending", "confirmed", "completed", "cancelled"])
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const consultations = await ctx.db.consultation.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input.status && { status: input.status }),
        },
        include: {
          expert: {
            select: {
              id: true,
              name: true,
              profession: true,
              profileImage: true,
            },
          },
        },
        orderBy: { scheduledDate: "desc" },
      });

      return consultations;
    }),

  // Leave a review (protected)
  leaveReview: protectedProcedure
    .input(
      z.object({
        expertId: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.expertReview.upsert({
        where: {
          expertId_userId: {
            expertId: input.expertId,
            userId: ctx.session.user.id,
          },
        },
        update: {
          rating: input.rating,
          comment: input.comment,
        },
        create: {
          expertId: input.expertId,
          userId: ctx.session.user.id,
          rating: input.rating,
          comment: input.comment,
        },
      });

      const reviews = await ctx.db.expertReview.findMany({
        where: { expertId: input.expertId },
      });

      const avgRating =
        reviews.reduce(
          (sum: number, r: (typeof reviews)[0]) => sum + r.rating,
          0,
        ) / reviews.length;

      await ctx.db.expert.update({
        where: { id: input.expertId },
        data: {
          rating: avgRating,
          totalReviews: reviews.length,
        },
      });

      return review;
    }),
});
