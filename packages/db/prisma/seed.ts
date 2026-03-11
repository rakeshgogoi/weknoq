/**
 * Seed: topics, subtopics, and real curated educational YouTube videos.
 * Run:  cd packages/db && npm run db:seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Topics ──────────────────────────────────────────────────────────────────

const TOPICS = [
  { name: "Programming",  slug: "programming",  emoji: "💻", color: "#2a4a7f", videoCount: 18400,
    subtopics: ["Python", "JavaScript", "Data Structures", "Web Development", "Machine Learning"] },
  { name: "Mathematics",  slug: "mathematics",  emoji: "∑",  color: "#1a4a3a", videoCount: 12300,
    subtopics: ["Calculus", "Linear Algebra", "Statistics", "Number Theory", "Discrete Math"] },
  { name: "Science",      slug: "science",      emoji: "🔬", color: "#1a5c35", videoCount: 24100,
    subtopics: ["Physics", "Biology", "Chemistry", "Neuroscience", "Astronomy"] },
  { name: "Philosophy",   slug: "philosophy",   emoji: "🦉", color: "#7a4010", videoCount: 7200,
    subtopics: ["Ethics", "Epistemology", "Stoicism", "Eastern Philosophy", "Logic"] },
  { name: "Finance",      slug: "finance",      emoji: "📈", color: "#3a2a6a", videoCount: 11800,
    subtopics: ["Investing", "Personal Finance", "Economics", "Crypto", "Accounting"] },
  { name: "History",      slug: "history",      emoji: "📜", color: "#8a5a00", videoCount: 8750,
    subtopics: ["World History", "Ancient Civilizations", "Modern History", "Wars & Empires"] },
  { name: "Music & Arts", slug: "music-arts",   emoji: "🎵", color: "#7a1040", videoCount: 9400,
    subtopics: ["Music Theory", "Guitar", "Piano", "Composition", "Art History"] },
  { name: "Languages",    slug: "languages",    emoji: "🗣️", color: "#10407a", videoCount: 13900,
    subtopics: ["Japanese", "Spanish", "French", "Mandarin", "Hindi"] },
  { name: "Design",       slug: "design-art",   emoji: "🎨", color: "#407a10", videoCount: 6600,
    subtopics: ["UI/UX", "Graphic Design", "Typography", "Product Design"] },
  { name: "Psychology",   slug: "psychology",   emoji: "🧠", color: "#6a1a6a", videoCount: 8100,
    subtopics: ["Cognitive Science", "Behavioral Psychology", "Mindfulness", "Social Psychology"] },
  { name: "Astronomy",    slug: "astronomy",    emoji: "🌌", color: "#0d0d4a", videoCount: 5400,
    subtopics: ["Cosmology", "Black Holes", "Planets", "Dark Matter", "Space Exploration"] },
  { name: "Engineering",  slug: "engineering",  emoji: "⚙️", color: "#107a7a", videoCount: 9200,
    subtopics: ["Civil Engineering", "Electrical Engineering", "Mechanical Engineering", "Computer Architecture"] },
];

// ─── Real educational YouTube videos ─────────────────────────────────────────

const VIDEOS = [
  // ── Programming ────────────────────────────────────────────────────────────
  {
    platformId: "rfscVS0vtbw",
    platform: "YOUTUBE" as const,
    title: "Learn Python - Full Course for Beginners [Tutorial]",
    description: "A full introduction into all of the core concepts in Python. Follow along and you'll be a Python programmer in no time.",
    channelName: "freeCodeCamp.org",
    thumbnailUrl: "https://i.ytimg.com/vi/rfscVS0vtbw/hqdefault.jpg",
    sourceUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    embedUrl: "https://www.youtube.com/embed/rfscVS0vtbw",
    durationSeconds: 15720,
    viewCount: BigInt(32_000_000),
    difficulty: "BEGINNER" as const,
    isFeatured: true,
    aiSummary: "Complete Python from scratch — variables, data types, lists, functions, OOP, and file I/O.",
    topicSlugs: ["programming"],
  },
  {
    platformId: "_uQrJ0TkZlc",
    platform: "YOUTUBE" as const,
    title: "Python Tutorial - Python Full Course for Beginners",
    description: "Go from Zero to Hero with Python — includes machine learning & web development projects.",
    channelName: "Programming with Mosh",
    thumbnailUrl: "https://i.ytimg.com/vi/_uQrJ0TkZlc/hqdefault.jpg",
    sourceUrl: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
    embedUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc",
    durationSeconds: 21600,
    viewCount: BigInt(35_000_000),
    difficulty: "BEGINNER" as const,
    isFeatured: false,
    aiSummary: "Comprehensive 6-hour Python course with hands-on projects taught by Mosh Hamedani.",
    topicSlugs: ["programming"],
  },
  {
    platformId: "W6NZfCO5SIk",
    platform: "YOUTUBE" as const,
    title: "JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour",
    description: "Learn JavaScript from scratch in just 1 hour — the fastest JavaScript crash course.",
    channelName: "Programming with Mosh",
    thumbnailUrl: "https://i.ytimg.com/vi/W6NZfCO5SIk/hqdefault.jpg",
    sourceUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
    embedUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
    durationSeconds: 4800,
    viewCount: BigInt(14_000_000),
    difficulty: "BEGINNER" as const,
    isFeatured: false,
    aiSummary: "Variables, conditionals, loops, functions, and objects — all the JavaScript fundamentals in one hour.",
    topicSlugs: ["programming"],
  },

  // ── Mathematics / ML ───────────────────────────────────────────────────────
  {
    platformId: "fNk_zzaMoSs",
    platform: "YOUTUBE" as const,
    title: "Vectors, what even are they? | Essence of linear algebra, Chapter 1",
    description: "Visual, intuitive linear algebra — what vectors truly are, how to add them, and how to scale them.",
    channelName: "3Blue1Brown",
    thumbnailUrl: "https://i.ytimg.com/vi/fNk_zzaMoSs/hqdefault.jpg",
    sourceUrl: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
    embedUrl: "https://www.youtube.com/embed/fNk_zzaMoSs",
    durationSeconds: 592,
    viewCount: BigInt(8_400_000),
    difficulty: "BEGINNER" as const,
    isFeatured: true,
    aiSummary: "A geometric, visual introduction to vectors — the foundation of all linear algebra.",
    topicSlugs: ["mathematics"],
  },
  {
    platformId: "WUvTyaaNkzM",
    platform: "YOUTUBE" as const,
    title: "The Essence of Calculus, Chapter 1",
    description: "Visual introduction to the core ideas of calculus — derivatives, integrals, and why they're connected.",
    channelName: "3Blue1Brown",
    thumbnailUrl: "https://i.ytimg.com/vi/WUvTyaaNkzM/hqdefault.jpg",
    sourceUrl: "https://www.youtube.com/watch?v=WUvTyaaNkzM",
    embedUrl: "https://www.youtube.com/embed/WUvTyaaNkzM",
    durationSeconds: 1024,
    viewCount: BigInt(7_200_000),
    difficulty: "INTERMEDIATE" as const,
    isFeatured: true,
    aiSummary: "Derivatives, integrals, and the fundamental theorem of calculus — explained visually from first principles.",
    topicSlugs: ["mathematics"],
  },
  {
    platformId: "aircAruvnKk",
    platform: "YOUTUBE" as const,
    title: "But what is a neural network? | Deep learning, Chapter 1",
    description: "What are the neurons, what are they doing? An intuitive visual intro to neural networks.",
    channelName: "3Blue1Brown",
    thumbnailUrl: "https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg",
    sourceUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
    embedUrl: "https://www.youtube.com/embed/aircAruvnKk",
    durationSeconds: 1153,
    viewCount: BigInt(14_200_000),
    difficulty: "INTERMEDIATE" as const,
    isFeatured: true,
    aiSummary: "A visual, intuitive introduction to neural networks — how neurons, layers, and weights work together to learn.",
    topicSlugs: ["mathematics", "programming"],
  },

  // ── Science / Philosophy ───────────────────────────────────────────────────
  {
    platformId: "h6fcK_fRYaI",
    platform: "YOUTUBE" as const,
    title: "The Egg - A Short Story",
    description: "A beautifully animated philosophical short — about consciousness, existence, and what it means to be human.",
    channelName: "Kurzgesagt – In a Nutshell",
    thumbnailUrl: "https://i.ytimg.com/vi/h6fcK_fRYaI/hqdefault.jpg",
    sourceUrl: "https://www.youtube.com/watch?v=h6fcK_fRYaI",
    embedUrl: "https://www.youtube.com/embed/h6fcK_fRYaI",
    durationSeconds: 490,
    viewCount: BigInt(25_000_000),
    difficulty: "BEGINNER" as const,
    isFeatured: true,
    aiSummary: "A profound animated short about consciousness, reincarnation, and the interconnectedness of all humans.",
    topicSlugs: ["science", "philosophy"],
  },
  {
    platformId: "QsBT5EQt348",
    platform: "YOUTUBE" as const,
    title: "Overpopulation – The Human Explosion Explained",
    description: "In a world of 7 billion people and counting, is overpopulation really the problem we think it is?",
    channelName: "Kurzgesagt – In a Nutshell",
    thumbnailUrl: "https://i.ytimg.com/vi/QsBT5EQt348/hqdefault.jpg",
    sourceUrl: "https://www.youtube.com/watch?v=QsBT5EQt348",
    embedUrl: "https://www.youtube.com/embed/QsBT5EQt348",
    durationSeconds: 360,
    viewCount: BigInt(18_000_000),
    difficulty: "BEGINNER" as const,
    isFeatured: false,
    aiSummary: "Explores the real data behind population growth and what it actually means for humanity's future.",
    topicSlugs: ["science"],
  },

  // ── TED Talks ──────────────────────────────────────────────────────────────
  {
    platformId: "qp0HIF3SfI4",
    platform: "YOUTUBE" as const,
    title: "How great leaders inspire action | Simon Sinek",
    description: "Simon Sinek presents a simple but powerful model for how leaders inspire cooperation, trust, and change. It all starts with Why.",
    channelName: "TED",
    thumbnailUrl: "https://i.ytimg.com/vi/qp0HIF3SfI4/hqdefault.jpg",
    sourceUrl: "https://www.youtube.com/watch?v=qp0HIF3SfI4",
    embedUrl: "https://www.youtube.com/embed/qp0HIF3SfI4",
    durationSeconds: 1081,
    viewCount: BigInt(68_000_000),
    difficulty: "BEGINNER" as const,
    isFeatured: true,
    aiSummary: "Simon Sinek's 'Start With Why' framework — why great leaders and organizations think from the inside out.",
    topicSlugs: ["philosophy", "finance"],
  },
  {
    platformId: "iG9CE55wbtY",
    platform: "YOUTUBE" as const,
    title: "Do schools kill creativity? | Sir Ken Robinson",
    description: "Sir Ken Robinson makes an entertaining and profoundly moving case for creating an education system that nurtures creativity.",
    channelName: "TED",
    thumbnailUrl: "https://i.ytimg.com/vi/iG9CE55wbtY/hqdefault.jpg",
    sourceUrl: "https://www.youtube.com/watch?v=iG9CE55wbtY",
    embedUrl: "https://www.youtube.com/embed/iG9CE55wbtY",
    durationSeconds: 1165,
    viewCount: BigInt(74_000_000),
    difficulty: "BEGINNER" as const,
    isFeatured: true,
    aiSummary: "The most-watched TED talk ever — a compelling argument that schools systematically destroy children's creativity.",
    topicSlugs: ["philosophy"],
  },
  {
    platformId: "iCvmsMzlF7o",
    platform: "YOUTUBE" as const,
    title: "The Power of Vulnerability | Brené Brown",
    description: "Brené Brown studies human connection — our ability to empathize, belong, and love. In a talk that has 63M views.",
    channelName: "TED",
    thumbnailUrl: "https://i.ytimg.com/vi/iCvmsMzlF7o/hqdefault.jpg",
    sourceUrl: "https://www.youtube.com/watch?v=iCvmsMzlF7o",
    embedUrl: "https://www.youtube.com/embed/iCvmsMzlF7o",
    durationSeconds: 1219,
    viewCount: BigInt(63_000_000),
    difficulty: "BEGINNER" as const,
    isFeatured: false,
    aiSummary: "Brené Brown on vulnerability, shame, connection, and why embracing imperfection is the key to belonging.",
    topicSlugs: ["philosophy", "psychology"],
  },
  {
    platformId: "arj7oStGLkU",
    platform: "YOUTUBE" as const,
    title: "Inside the mind of a master procrastinator | Tim Urban",
    description: "Tim Urban knows that procrastination doesn't make sense, but he's still done it his whole life. Here's a hilarious deep-dive.",
    channelName: "TED",
    thumbnailUrl: "https://i.ytimg.com/vi/arj7oStGLkU/hqdefault.jpg",
    sourceUrl: "https://www.youtube.com/watch?v=arj7oStGLkU",
    embedUrl: "https://www.youtube.com/embed/arj7oStGLkU",
    durationSeconds: 844,
    viewCount: BigInt(60_000_000),
    difficulty: "BEGINNER" as const,
    isFeatured: false,
    aiSummary: "Tim Urban's hilarious breakdown of the procrastinator's brain — the Instant Gratification Monkey, the Rational Decision-Maker, and the Panic Monster.",
    topicSlugs: ["philosophy", "psychology"],
  },

  // ── History ────────────────────────────────────────────────────────────────
  {
    platformId: "xuCn8ux2gbs",
    platform: "YOUTUBE" as const,
    title: "history of the entire world, i guess",
    description: "patreon: https://www.patreon.com/billwurtz — all of history from the Big Bang to today.",
    channelName: "bill wurtz",
    thumbnailUrl: "https://i.ytimg.com/vi/xuCn8ux2gbs/hqdefault.jpg",
    sourceUrl: "https://www.youtube.com/watch?v=xuCn8ux2gbs",
    embedUrl: "https://www.youtube.com/embed/xuCn8ux2gbs",
    durationSeconds: 1165,
    viewCount: BigInt(112_000_000),
    difficulty: "BEGINNER" as const,
    isFeatured: true,
    aiSummary: "The entire history of the world from the Big Bang to today — in under 20 minutes, somehow accurate and extremely entertaining.",
    topicSlugs: ["history"],
  },
  {
    platformId: "Yocja_N5s1I",
    platform: "YOUTUBE" as const,
    title: "The Agricultural Revolution: Crash Course World History #1",
    description: "John Green teaches you about the agricultural revolution and the invention of farming.",
    channelName: "CrashCourse",
    thumbnailUrl: "https://i.ytimg.com/vi/Yocja_N5s1I/hqdefault.jpg",
    sourceUrl: "https://www.youtube.com/watch?v=Yocja_N5s1I",
    embedUrl: "https://www.youtube.com/embed/Yocja_N5s1I",
    durationSeconds: 630,
    viewCount: BigInt(11_000_000),
    difficulty: "BEGINNER" as const,
    isFeatured: false,
    aiSummary: "How farming transformed human civilization — and why early farmers may actually have had it worse than hunters.",
    topicSlugs: ["history"],
  },

  // ── Finance ────────────────────────────────────────────────────────────────
  {
    platformId: "p7HKvqRI_Bo",
    platform: "YOUTUBE" as const,
    title: "How does the stock market work? - Oliver Elfenbaum",
    description: "The invention of the stock market is one of the most crucial developments in the history of commerce.",
    channelName: "TED-Ed",
    thumbnailUrl: "https://i.ytimg.com/vi/p7HKvqRI_Bo/hqdefault.jpg",
    sourceUrl: "https://www.youtube.com/watch?v=p7HKvqRI_Bo",
    embedUrl: "https://www.youtube.com/embed/p7HKvqRI_Bo",
    durationSeconds: 240,
    viewCount: BigInt(17_000_000),
    difficulty: "BEGINNER" as const,
    isFeatured: false,
    aiSummary: "A crisp 4-minute explanation of how stock markets work — stocks, IPOs, dividends, and why markets rise and fall.",
    topicSlugs: ["finance"],
  },
];

// ─── Learning Paths ───────────────────────────────────────────────────────────

const PATHS = [
  {
    title: "Python for Beginners",
    slug: "python-beginners",
    emoji: "🐍",
    description: "From zero to writing real programs. Start with freeCodeCamp's full course, then Mosh's project-based approach.",
    totalVideos: 2,
    totalSeconds: 37320,
    difficulty: "BEGINNER" as const,
    isFeatured: true,
    topicSlug: "programming",
    videoIds: ["rfscVS0vtbw", "_uQrJ0TkZlc"],
  },
  {
    title: "The Essence of Mathematics",
    slug: "essence-of-mathematics",
    emoji: "∑",
    description: "Visual, intuitive math from 3Blue1Brown — vectors, calculus, and neural networks from first principles.",
    totalVideos: 3,
    totalSeconds: 2769,
    difficulty: "INTERMEDIATE" as const,
    isFeatured: true,
    topicSlug: "mathematics",
    videoIds: ["fNk_zzaMoSs", "WUvTyaaNkzM", "aircAruvnKk"],
  },
  {
    title: "TED: Ideas Worth Spreading",
    slug: "ted-ideas",
    emoji: "🎙️",
    description: "The most essential TED talks — on creativity, leadership, vulnerability, and the human condition.",
    totalVideos: 4,
    totalSeconds: 4309,
    difficulty: "BEGINNER" as const,
    isFeatured: true,
    topicSlug: "philosophy",
    videoIds: ["qp0HIF3SfI4", "iG9CE55wbtY", "iCvmsMzlF7o", "arj7oStGLkU"],
  },
  {
    title: "World History in a Flash",
    slug: "world-history",
    emoji: "🌍",
    description: "From the Big Bang through the Agricultural Revolution to the modern era — history made entertaining.",
    totalVideos: 2,
    totalSeconds: 1795,
    difficulty: "BEGINNER" as const,
    isFeatured: true,
    topicSlug: "history",
    videoIds: ["xuCn8ux2gbs", "Yocja_N5s1I"],
  },
  {
    title: "Finance 101",
    slug: "finance-101",
    emoji: "💸",
    description: "How the stock market works and the basics of personal finance — from first principles.",
    totalVideos: 2,
    totalSeconds: 1321,
    difficulty: "BEGINNER" as const,
    isFeatured: true,
    topicSlug: "finance",
    videoIds: ["p7HKvqRI_Bo", "qp0HIF3SfI4"],
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database...\n");

  // 1. Upsert topics + subtopics
  const topicMap: Record<string, string> = {}; // slug → DB id

  for (const t of TOPICS) {
    const { subtopics, ...topicData } = t;
    const topic = await prisma.topic.upsert({
      where: { slug: topicData.slug },
      update: { name: topicData.name, emoji: topicData.emoji, color: topicData.color, videoCount: topicData.videoCount },
      create: topicData,
    });
    topicMap[topicData.slug] = topic.id;

    for (const sub of subtopics) {
      const subSlug = sub.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      await prisma.subtopic.upsert({
        where: { slug_topicId: { slug: subSlug, topicId: topic.id } },
        update: {},
        create: { name: sub, slug: subSlug, topicId: topic.id },
      });
    }
    console.log(`  ✓ Topic: ${t.emoji} ${t.name}`);
  }

  // 2. Upsert videos + topic links
  const videoMap: Record<string, string> = {}; // platformId → DB id

  for (const v of VIDEOS) {
    const { topicSlugs, ...videoData } = v;
    const video = await prisma.video.upsert({
      where: { platformId_platform: { platformId: v.platformId, platform: v.platform } },
      update: { ...videoData },
      create: { ...videoData, isActive: true },
    });
    videoMap[v.platformId] = video.id;

    for (const slug of topicSlugs) {
      const topicId = topicMap[slug];
      if (topicId) {
        await prisma.videoTopic.upsert({
          where: { videoId_topicId: { videoId: video.id, topicId } },
          update: {},
          create: { videoId: video.id, topicId },
        });
      }
    }
    console.log(`  ✓ Video: ${v.title.substring(0, 55)}`);
  }

  // 3. Upsert learning paths + path videos
  for (const p of PATHS) {
    const { topicSlug, videoIds, ...pathData } = p;
    const topicId = topicMap[topicSlug] ?? null;

    const path = await prisma.learningPath.upsert({
      where: { slug: p.slug },
      update: { ...pathData, topicId },
      create: { ...pathData, topicId },
    });

    for (let i = 0; i < videoIds.length; i++) {
      const videoDbId = videoMap[videoIds[i]];
      if (!videoDbId) continue;
      await prisma.pathVideo.upsert({
        where: { pathId_videoId: { pathId: path.id, videoId: videoDbId } },
        update: { order: i + 1 },
        create: { pathId: path.id, videoId: videoDbId, order: i + 1 },
      });
    }
    console.log(`  ✓ Path: ${p.emoji} ${p.title}`);
  }

  console.log("\n✅ Seed complete!");
  console.log(`   ${TOPICS.length} topics · ${VIDEOS.length} videos · ${PATHS.length} paths`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
