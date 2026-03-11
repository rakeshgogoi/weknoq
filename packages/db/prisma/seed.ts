import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TOPICS = [
  { name: "Programming",   slug: "programming",   emoji: "💻", color: "#2a4a7f",
    subtopics: ["Python", "JavaScript", "Data Structures", "Web Development", "Machine Learning"] },
  { name: "Science",       slug: "science",       emoji: "🔬", color: "#1a5c35",
    subtopics: ["Physics", "Biology", "Chemistry", "Neuroscience", "Astronomy"] },
  { name: "Philosophy",    slug: "philosophy",    emoji: "🦉", color: "#7a4010",
    subtopics: ["Ethics", "Epistemology", "Stoicism", "Eastern Philosophy", "Logic"] },
  { name: "Finance",       slug: "finance",       emoji: "📈", color: "#3a2a6a",
    subtopics: ["Investing", "Personal Finance", "Economics", "Crypto", "Accounting"] },
  { name: "Music & Arts",  slug: "music-arts",    emoji: "🎵", color: "#7a1040",
    subtopics: ["Music Theory", "Indian Classical", "Guitar", "Piano", "Composition"] },
  { name: "Languages",     slug: "languages",     emoji: "🗣️", color: "#10407a",
    subtopics: ["Japanese", "Spanish", "Assamese", "Hindi", "French"] },
  { name: "Mathematics",   slug: "mathematics",   emoji: "∑",  color: "#1a4a3a",
    subtopics: ["Calculus", "Linear Algebra", "Statistics", "Number Theory", "Discrete Math"] },
  { name: "History",       slug: "history",       emoji: "📜", color: "#8a5a00",
    subtopics: ["World History", "Indian History", "Ancient Civilizations", "Modern History"] },
  { name: "Design",        slug: "design",        emoji: "🎨", color: "#407a10",
    subtopics: ["UI/UX", "Graphic Design", "Typography", "Product Design"] },
  { name: "Psychology",    slug: "psychology",    emoji: "🧠", color: "#6a1a6a",
    subtopics: ["Cognitive Science", "Behavioral Psychology", "Mindfulness", "Social Psychology"] },
];

async function main() {
  console.log("🌱 Seeding topics...");

  for (const topic of TOPICS) {
    const { subtopics, ...topicData } = topic;

    const created = await prisma.topic.upsert({
      where: { slug: topicData.slug },
      update: {},
      create: topicData,
    });

    for (const sub of subtopics) {
      const subSlug = sub.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await prisma.subtopic.upsert({
        where: { slug_topicId: { slug: subSlug, topicId: created.id } },
        update: {},
        create: { name: sub, slug: subSlug, topicId: created.id },
      });
    }

    console.log(`  ✅ ${topic.emoji} ${topic.name} (${subtopics.length} subtopics)`);
  }

  console.log("\n✨ Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
