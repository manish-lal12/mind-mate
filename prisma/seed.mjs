import { PrismaClient } from "../src/lib/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with test experts...");

  // Create problem categories
  const categories = await Promise.all([
    prisma.problemCategory.upsert({
      where: { name: "Anxiety" },
      update: {},
      create: {
        name: "Anxiety",
        description: "Generalized anxiety, panic attacks, and worry disorders",
        icon: "😰",
      },
    }),
    prisma.problemCategory.upsert({
      where: { name: "Depression" },
      update: {},
      create: {
        name: "Depression",
        description:
          "Clinical depression, mood disorders, and emotional challenges",
        icon: "😔",
      },
    }),
    prisma.problemCategory.upsert({
      where: { name: "Stress Management" },
      update: {},
      create: {
        name: "Stress Management",
        description:
          "Workplace stress, life transitions, and coping strategies",
        icon: "😟",
      },
    }),
    prisma.problemCategory.upsert({
      where: { name: "Relationship Issues" },
      update: {},
      create: {
        name: "Relationship Issues",
        description: "Couples therapy, family dynamics, and communication",
        icon: "💑",
      },
    }),
    prisma.problemCategory.upsert({
      where: { name: "Sleep Disorders" },
      update: {},
      create: {
        name: "Sleep Disorders",
        description: "Insomnia, sleep quality, and rest management",
        icon: "😴",
      },
    }),
    prisma.problemCategory.upsert({
      where: { name: "Addiction" },
      update: {},
      create: {
        name: "Addiction",
        description: "Substance abuse, behavioral addictions, and recovery",
        icon: "🚫",
      },
    }),
  ]);

  console.log("✅ Created problem categories");

  // Create test experts
  const experts = await Promise.all([
    prisma.expert.upsert({
      where: { email: "dr.sarah@expert.com" },
      update: {},
      create: {
        name: "Dr. Sarah Johnson",
        email: "dr.sarah@expert.com",
        profession: "therapist",
        bio: "Licensed Clinical Therapist with 10+ years of experience in cognitive behavioral therapy and anxiety disorders.",
        specialties: ["Anxiety", "Stress Management", "Depression"],
        profileImage:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        yearsExperience: 12,
        hourlyRate: 12000,
        education: "Ph.D. in Clinical Psychology, University of California",
        licenseNumber: "CA-PSY-001234",
        availability: JSON.stringify({
          monday: ["09:00-17:00"],
          tuesday: ["09:00-17:00"],
          wednesday: ["09:00-17:00"],
          thursday: ["09:00-17:00"],
          friday: ["09:00-17:00"],
        }),
        isVerified: true,
        rating: 4.8,
        totalReviews: 45,
      },
    }),
    prisma.expert.upsert({
      where: { email: "dr.james@expert.com" },
      update: {},
      create: {
        name: "Dr. James Mitchell",
        email: "dr.james@expert.com",
        profession: "doctor",
        bio: "Board-certified psychiatrist specializing in mood disorders and medication management.",
        specialties: ["Depression", "Sleep Disorders", "Stress Management"],
        profileImage:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        yearsExperience: 15,
        hourlyRate: 15000,
        education: "M.D. in Psychiatry, Harvard Medical School",
        licenseNumber: "NY-MD-005678",
        availability: JSON.stringify({
          monday: ["10:00-18:00"],
          tuesday: ["10:00-18:00"],
          wednesday: ["10:00-18:00"],
          thursday: ["10:00-18:00"],
          friday: ["10:00-16:00"],
        }),
        isVerified: true,
        rating: 4.9,
        totalReviews: 78,
      },
    }),
    prisma.expert.upsert({
      where: { email: "emily.counselor@expert.com" },
      update: {},
      create: {
        name: "Emily Rodriguez",
        email: "emily.counselor@expert.com",
        profession: "consultant",
        bio: "Certified relationship counselor and coach. Specializes in couples therapy and communication strategies.",
        specialties: ["Relationship Issues", "Stress Management", "Anxiety"],
        profileImage:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        yearsExperience: 8,
        hourlyRate: 10000,
        education: "M.A. in Counseling Psychology, NYU",
        licenseNumber: "NJ-LPC-009012",
        availability: JSON.stringify({
          monday: ["14:00-20:00"],
          tuesday: ["14:00-20:00"],
          wednesday: ["14:00-20:00"],
          thursday: ["14:00-20:00"],
          friday: ["14:00-19:00"],
          saturday: ["10:00-14:00"],
        }),
        isVerified: true,
        rating: 4.7,
        totalReviews: 52,
      },
    }),
    prisma.expert.upsert({
      where: { email: "dr.michael@expert.com" },
      update: {},
      create: {
        name: "Dr. Michael Chen",
        email: "dr.michael@expert.com",
        profession: "doctor",
        bio: "Addiction specialist and recovery counselor with expertise in substance abuse treatment programs.",
        specialties: ["Addiction", "Depression", "Stress Management"],
        profileImage:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        yearsExperience: 18,
        hourlyRate: 14000,
        education: "M.D. in Psychiatry, Stanford Medical School",
        licenseNumber: "CA-MD-003456",
        availability: JSON.stringify({
          monday: ["08:00-16:00"],
          tuesday: ["08:00-16:00"],
          wednesday: ["08:00-16:00"],
          thursday: ["08:00-16:00"],
          friday: ["08:00-12:00"],
        }),
        isVerified: true,
        rating: 4.6,
        totalReviews: 63,
      },
    }),
    prisma.expert.upsert({
      where: { email: "dr.lisa@expert.com" },
      update: {},
      create: {
        name: "Dr. Lisa Anderson",
        email: "dr.lisa@expert.com",
        profession: "therapist",
        bio: "Sleep medicine specialist and behavioral sleep therapist. Expert in CBT for insomnia.",
        specialties: ["Sleep Disorders", "Anxiety", "Stress Management"],
        profileImage:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        yearsExperience: 11,
        hourlyRate: 11500,
        education: "Ph.D. in Sleep Medicine, University of Pennsylvania",
        licenseNumber: "PA-PSY-007890",
        availability: JSON.stringify({
          monday: ["09:00-17:00"],
          tuesday: ["09:00-17:00"],
          wednesday: ["09:00-17:00"],
          thursday: ["09:00-17:00"],
          friday: ["09:00-15:00"],
          saturday: ["10:00-13:00"],
        }),
        isVerified: true,
        rating: 4.9,
        totalReviews: 71,
      },
    }),
  ]);

  console.log("✅ Created 5 test experts");

  console.log("🎉 Seeding completed successfully!");
  console.log("\nTest experts created:");
  experts.forEach((expert) => {
    console.log(`  • ${expert.name} (${expert.profession})`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
