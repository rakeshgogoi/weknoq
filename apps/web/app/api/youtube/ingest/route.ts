// POST /api/youtube/ingest
// Body: { query: string, topicSlug: string, maxResults?: number }
// Fetches from YouTube API, runs tagger, upserts into DB.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@weknoq/db";
import { searchYouTube, getVideoDetails } from "@/lib/youtube";
import { tagVideo, generateSummary } from "@/lib/tagger";
import { cacheGet, cacheSet } from "@/lib/cache";
import { z } from "zod";

const IngestSchema = z.object({
  query: z.string().min(1).max(200),
  topicSlug: z.string().optional(),
  maxResults: z.number().min(1).max(50).default(20),
});

export async function POST(req: NextRequest) {
  // Simple API key guard for the ingest endpoint
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.INGEST_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = IngestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { query, topicSlug, maxResults } = parsed.data;

  // Check Redis cache first (avoid burning YouTube quota)
  const cacheKey = `yt:ingest:${query}:${maxResults}`;
  const cached = await cacheGet<{ count: number }>(cacheKey);
  if (cached) {
    return NextResponse.json({ message: "Cached", ...cached });
  }

  try {
    // 1. Search YouTube
    const searchResults = await searchYouTube(query, maxResults);
    const videoIds = searchResults.map((v) => v.platformId);

    // 2. Get detailed stats (duration, views, likes)
    const details = await getVideoDetails(videoIds);
    const detailMap = new Map(details.map((d) => [d.platformId, d]));

    // 3. Get topic from DB if provided
    const topic = topicSlug
      ? await prisma.topic.findUnique({ where: { slug: topicSlug } })
      : null;

    let ingestedCount = 0;

    for (const video of searchResults) {
      const detail = detailMap.get(video.platformId);
      const { topicSlugs, difficulty, extractedTags } = tagVideo(
        video.title,
        video.description
      );
      const summary = generateSummary(video.title, video.description);

      // 4. Upsert video
      const upserted = await prisma.video.upsert({
        where: {
          platformId_platform: {
            platformId: video.platformId,
            platform: "YOUTUBE",
          },
        },
        update: {
          viewCount: detail?.viewCount ?? undefined,
          likeCount: detail?.likeCount ?? undefined,
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
          sourceUrl: video.sourceUrl,
          embedUrl: video.embedUrl,
          publishedAt: new Date(video.publishedAt),
          durationSeconds: detail?.durationSeconds ?? null,
          viewCount: detail?.viewCount ?? null,
          likeCount: detail?.likeCount ?? null,
          aiSummary: summary,
          difficulty,
          language: "en",
        },
      });

      // 5. Link to topics (from tagger + explicitly provided)
      const slugsToLink = Array.from(
        new Set([...topicSlugs, ...(topicSlug ? [topicSlug] : [])])
      );

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

      // 6. Upsert tags
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

      ingestedCount++;
    }

    // Update topic video count
    if (topic) {
      const count = await prisma.videoTopic.count({
        where: { topicId: topic.id },
      });
      await prisma.topic.update({
        where: { id: topic.id },
        data: { videoCount: count },
      });
    }

    const result = { count: ingestedCount, query };
    await cacheSet(cacheKey, result, 3600);

    return NextResponse.json({ message: "Ingested", ...result });
  } catch (err) {
    console.error("[ingest] error:", err);
    return NextResponse.json({ error: "Ingest failed" }, { status: 500 });
  }
}
