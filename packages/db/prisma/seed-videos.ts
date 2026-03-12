/**
 * Standalone video seed — no HTTP server required.
 * Calls YouTube Data API directly, tags videos, writes to DB via Prisma.
 *
 * Usage:
 *   DATABASE_URL=... YOUTUBE_API_KEY=... tsx prisma/seed-videos.ts
 *
 * Or (from monorepo root, with .env already set):
 *   npm --workspace packages/db run db:seed-videos
 */

import { PrismaClient, DifficultyLevel } from "@prisma/client";

const prisma = new PrismaClient();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE = "https://www.googleapis.com/youtube/v3";

if (!YOUTUBE_API_KEY) {
  console.error("❌  YOUTUBE_API_KEY env var is required.");
  process.exit(1);
}

// ─── Queries: 22 × 5 = ~110 videos ──────────────────────────────────────────

const QUERIES: { query: string; topicSlug?: string; maxResults: number }[] = [
  // Programming (3)
  { query: "python programming full course beginners", topicSlug: "programming", maxResults: 5 },
  { query: "javascript react web development tutorial complete", topicSlug: "programming", maxResults: 5 },
  { query: "machine learning deep learning AI neural network tutorial", topicSlug: "programming", maxResults: 5 },
  // Mathematics (2)
  { query: "calculus linear algebra mathematics visual explained", topicSlug: "mathematics", maxResults: 5 },
  { query: "statistics probability data science mathematics", topicSlug: "mathematics", maxResults: 5 },
  // Science (2)
  { query: "quantum physics relativity explained visual", topicSlug: "science", maxResults: 5 },
  { query: "biology evolution DNA genetics neuroscience astronomy", topicSlug: "science", maxResults: 5 },
  // Philosophy (2)
  { query: "stoicism philosophy ethics meaning life explained", topicSlug: "philosophy", maxResults: 5 },
  { query: "existentialism consciousness free will morality philosophy", topicSlug: "philosophy", maxResults: 5 },
  // Finance (2)
  { query: "investing personal finance stock market beginners wealth", topicSlug: "finance", maxResults: 5 },
  { query: "economics inflation cryptocurrency bitcoin financial literacy", topicSlug: "finance", maxResults: 5 },
  // History (2)
  { query: "ancient civilizations world history empires rome greece", topicSlug: "history", maxResults: 5 },
  { query: "world war modern history documentary explained", topicSlug: "history", maxResults: 5 },
  // Psychology (2)
  { query: "psychology cognitive behavior science social human mind", topicSlug: "psychology", maxResults: 5 },
  { query: "mindfulness meditation habits neuroscience mental health", topicSlug: "psychology", maxResults: 5 },
  // Music & Arts (2)
  { query: "music theory harmony composition fundamentals", topicSlug: "music-arts", maxResults: 5 },
  { query: "piano guitar violin classical music tutorial beginner", topicSlug: "music-arts", maxResults: 5 },
  // Languages (2)
  { query: "learn japanese beginner complete course", topicSlug: "languages", maxResults: 5 },
  { query: "learn spanish french language pronunciation grammar", topicSlug: "languages", maxResults: 5 },
  // Design (2)
  { query: "UI UX design principles product design tutorial", topicSlug: "design", maxResults: 5 },
  { query: "graphic design typography visual design fundamentals", topicSlug: "design", maxResults: 5 },
  // Cross-topic TED / popular edu
  { query: "TED talk education motivation learning science", maxResults: 5 },
];

// ─── Tagger (mirrors apps/web/lib/tagger.ts) ─────────────────────────────────

const TOPIC_KEYWORDS: Record<string, string[]> = {
  programming: [
    "python", "javascript", "typescript", "react", "node", "css", "html",
    "programming", "coding", "software", "algorithm", "data structure",
    "web development", "backend", "frontend", "api", "database", "sql",
    "machine learning", "deep learning", "ai", "tensorflow", "pytorch",
    "git", "docker", "kubernetes", "linux", "bash", "shell",
  ],
  science: [
    "physics", "chemistry", "biology", "quantum", "relativity", "evolution",
    "genetics", "dna", "neuroscience", "brain", "atom", "molecule",
    "astronomy", "space", "cosmos", "black hole", "nasa", "crispr",
    "climate", "ecology", "scientific", "laboratory", "experiment",
  ],
  philosophy: [
    "philosophy", "stoicism", "ethics", "epistemology", "ontology",
    "socrates", "plato", "aristotle", "nietzsche", "kant", "descartes",
    "existentialism", "logic", "consciousness", "metaphysics", "morality",
    "free will", "meaning of life",
  ],
  finance: [
    "finance", "investing", "stock market", "stocks", "bonds", "etf",
    "compound interest", "personal finance", "budget", "money", "wealth",
    "economics", "inflation", "cryptocurrency", "bitcoin", "portfolio",
    "retirement", "index fund", "warren buffett",
  ],
  "music-arts": [
    "music theory", "piano", "guitar", "violin", "composition", "harmony",
    "rhythm", "chord", "scale", "melody", "music", "instrument",
    "carnatic", "hindustani", "classical music", "jazz", "blues",
    "painting", "drawing", "illustration", "art history",
  ],
  languages: [
    "language learning", "japanese", "spanish", "french", "mandarin",
    "hindi", "assamese", "korean", "german", "arabic", "portuguese",
    "grammar", "vocabulary", "pronunciation", "fluency",
  ],
  mathematics: [
    "mathematics", "calculus", "algebra", "geometry", "statistics",
    "probability", "linear algebra", "number theory", "proof",
    "differential equations", "fourier", "topology", "discrete math",
  ],
  history: [
    "history", "ancient", "civilization", "world war", "roman empire",
    "medieval", "renaissance", "industrial revolution", "independence",
    "historical", "archival", "empire", "dynasty",
  ],
  design: [
    "design", "ui", "ux", "user interface", "user experience", "figma",
    "typography", "graphic design", "product design", "branding", "color theory",
    "wireframe", "prototype", "visual design",
  ],
  psychology: [
    "psychology", "cognitive", "behavior", "mental health", "therapy",
    "mindfulness", "meditation", "stoicism", "emotional intelligence",
    "memory", "learning science", "motivation", "habits",
  ],
};

const DIFFICULTY_KEYWORDS: Record<string, string[]> = {
  BEGINNER: ["beginner", "introduction", "intro", "getting started", "basics", "fundamentals", "101", "for beginners", "start", "first", "easy", "simple", "overview", "what is", "explained"],
  INTERMEDIATE: ["intermediate", "deep dive", "in depth", "advanced concepts", "how to build", "build a", "project", "tutorial", "hands on", "practical", "real world"],
  ADVANCED: ["advanced", "expert", "mastery", "internals", "under the hood", "architecture", "optimization", "performance", "research", "paper", "theory", "proof", "graduate"],
};

function tagVideo(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();
  const topicSlugs: string[] = [];
  for (const [slug, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) topicSlugs.push(slug);
  }
  let difficulty: DifficultyLevel = "BEGINNER";
  for (const [level, keywords] of Object.entries(DIFFICULTY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      difficulty = level as DifficultyLevel;
      break;
    }
  }
  const extractedTags = Array.from(
    new Set(Object.values(TOPIC_KEYWORDS).flat().filter((kw) => text.includes(kw) && kw.length > 3).slice(0, 10))
  );
  return { topicSlugs, difficulty, extractedTags };
}

function generateSummary(title: string, description: string): string {
  const cleaned = description
    .split("\n")
    .filter((line) =>
      !line.match(/https?:\/\//) &&
      !line.match(/^\d+:\d+/) &&
      !line.match(/subscribe|patreon|sponsor|affiliate/i) &&
      line.trim().length > 30
    )
    .slice(0, 3)
    .join(" ")
    .trim();
  if (cleaned.length > 80) return cleaned.length > 160 ? cleaned.slice(0, 157) + "…" : cleaned;
  return `A video about ${title.toLowerCase().replace(/[^a-z0-9\s]/g, "")}.`;
}

function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return (parseInt(match[1] ?? "0") * 3600) + (parseInt(match[2] ?? "0") * 60) + parseInt(match[3] ?? "0");
}

// ─── YouTube API helpers ──────────────────────────────────────────────────────

async function searchYouTube(query: string, maxResults: number) {
  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    videoEmbeddable: "true",
    videoCategoryId: "27", // Education
    maxResults: String(maxResults),
    key: YOUTUBE_API_KEY!,
  });
  const res = await fetch(`${BASE}/search?${params}`);
  if (!res.ok) throw new Error(`YouTube search failed [${res.status}]: ${await res.text()}`);
  const data = await res.json() as any;
  return (data.items ?? []).map((item: any) => ({
    platformId: item.id.videoId as string,
    title: item.snippet.title as string,
    description: (item.snippet.description ?? "") as string,
    thumbnailUrl: (item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url ?? "") as string,
    channelName: item.snippet.channelTitle as string,
    channelId: item.snippet.channelId as string,
    publishedAt: item.snippet.publishedAt as string,
  }));
}

async function getVideoDetails(videoIds: string[]) {
  if (videoIds.length === 0) return new Map<string, { durationSeconds: number; viewCount: bigint; likeCount: bigint }>();
  const params = new URLSearchParams({
    part: "contentDetails,statistics",
    id: videoIds.join(","),
    key: YOUTUBE_API_KEY!,
  });
  const res = await fetch(`${BASE}/videos?${params}`);
  if (!res.ok) throw new Error(`YouTube details failed [${res.status}]: ${await res.text()}`);
  const data = await res.json() as any;
  const map = new Map<string, { durationSeconds: number; viewCount: bigint; likeCount: bigint }>();
  for (const item of data.items ?? []) {
    map.set(item.id, {
      durationSeconds: parseISO8601Duration(item.contentDetails?.duration ?? ""),
      viewCount: BigInt(item.statistics?.viewCount ?? 0),
      likeCount: BigInt(item.statistics?.likeCount ?? 0),
    });
  }
  return map;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const total = QUERIES.reduce((s, q) => s + q.maxResults, 0);
  console.log(`🎬  Weknoq video seed (direct YouTube → Prisma)`);
  console.log(`📋  Queries : ${QUERIES.length}  (up to ${total} videos)\n`);

  let totalIngested = 0;
  let errors = 0;

  for (let i = 0; i < QUERIES.length; i++) {
    const { query, topicSlug, maxResults } = QUERIES[i];
    const label = (topicSlug ?? "general").padEnd(12);
    process.stdout.write(`[${String(i + 1).padStart(2)}/${QUERIES.length}] ${label} "${query.slice(0, 48)}${query.length > 48 ? "…" : ""}" … `);

    try {
      // 1. Search
      const results = await searchYouTube(query, maxResults);
      if (results.length === 0) { console.log("⚠️  0 results"); continue; }

      // 2. Get stats
      const detailMap = await getVideoDetails(results.map((r) => r.platformId));

      let count = 0;

      // 3. Upsert each video
      for (const video of results) {
        const detail = detailMap.get(video.platformId);
        const { topicSlugs, difficulty, extractedTags } = tagVideo(video.title, video.description);
        const summary = generateSummary(video.title, video.description);

        const upserted = await prisma.video.upsert({
          where: { platformId_platform: { platformId: video.platformId, platform: "YOUTUBE" } },
          update: {
            viewCount: detail?.viewCount,
            likeCount: detail?.likeCount,
            updatedAt: new Date(),
          },
          create: {
            platformId: video.platformId,
            platform: "YOUTUBE",
            title: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            channelName: video.channelName,
            channelId: video.channelId,
            sourceUrl: `https://www.youtube.com/watch?v=${video.platformId}`,
            embedUrl: `https://www.youtube.com/embed/${video.platformId}`,
            publishedAt: new Date(video.publishedAt),
            durationSeconds: detail?.durationSeconds ?? null,
            viewCount: detail?.viewCount ?? null,
            likeCount: detail?.likeCount ?? null,
            aiSummary: summary,
            difficulty,
            language: "en",
          },
        });

        // 4. Link topics
        const slugsToLink = Array.from(new Set([...topicSlugs, ...(topicSlug ? [topicSlug] : [])]));
        for (const slug of slugsToLink) {
          const t = await prisma.topic.findUnique({ where: { slug } });
          if (t) {
            await prisma.videoTopic.upsert({
              where: { videoId_topicId: { videoId: upserted.id, topicId: t.id } },
              update: {},
              create: { videoId: upserted.id, topicId: t.id },
            });
          }
        }

        // 5. Upsert tags
        for (const tagName of extractedTags) {
          const tag = await prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });
          await prisma.videoTag.upsert({
            where: { videoId_tagId: { videoId: upserted.id, tagId: tag.id } },
            update: {},
            create: { videoId: upserted.id, tagId: tag.id },
          });
        }

        count++;
      }

      // 6. Update topic video counts
      if (topicSlug) {
        const t = await prisma.topic.findUnique({ where: { slug: topicSlug } });
        if (t) {
          const cnt = await prisma.videoTopic.count({ where: { topicId: t.id } });
          await prisma.topic.update({ where: { id: t.id }, data: { videoCount: cnt } });
        }
      }

      totalIngested += count;
      console.log(`✅  ${count} videos`);
    } catch (err) {
      errors++;
      console.log(`❌  ${err instanceof Error ? err.message : String(err)}`);
    }

    // Respect YouTube API: 1.5s between searches (quota = 100 units/search)
    if (i < QUERIES.length - 1) await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`✨  Done!  ${totalIngested} videos added/updated  |  ${errors} error(s)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
