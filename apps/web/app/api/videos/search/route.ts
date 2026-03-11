// GET /api/videos/search?q=python&topic=programming&difficulty=BEGINNER&page=1
// Searches our DB (not YouTube API directly) — fast, cached, no quota burn.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@weknoq/db";
import { cacheGet, cacheSet } from "@/lib/cache";
import { DifficultyLevel } from "@weknoq/db";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const q          = searchParams.get("q")?.trim() ?? "";
  const topicSlug  = searchParams.get("topic") ?? "";
  const difficulty = searchParams.get("difficulty") as DifficultyLevel | null;
  const platform   = searchParams.get("platform") ?? "";
  const page       = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const skip       = (page - 1) * PAGE_SIZE;

  const cacheKey = `videos:search:${q}:${topicSlug}:${difficulty}:${platform}:${page}`;
  const cached = await cacheGet<object>(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    // Build Prisma where clause dynamically
    const where: any = { isActive: true };

    if (q) {
      where.OR = [
        { title:       { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { channelName: { contains: q, mode: "insensitive" } },
      ];
    }

    if (difficulty) where.difficulty = difficulty;
    if (platform) where.platform = platform.toUpperCase();

    if (topicSlug) {
      where.topics = {
        some: { topic: { slug: topicSlug } },
      };
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        orderBy: [{ isFeatured: "desc" }, { viewCount: "desc" }],
        select: {
          id: true,
          platformId: true,
          platform: true,
          title: true,
          thumbnailUrl: true,
          channelName: true,
          durationSeconds: true,
          viewCount: true,
          difficulty: true,
          aiSummary: true,
          embedUrl: true,
          sourceUrl: true,
          isFeatured: true,
          topics: { select: { topic: { select: { name: true, slug: true, emoji: true } } } },
        },
      }),
      prisma.video.count({ where }),
    ]);

    const result = {
      videos: videos.map((v) => ({
        ...v,
        viewCount: v.viewCount !== null ? Number(v.viewCount) : null,
      })),
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    };

    await cacheSet(cacheKey, result, 600); // cache 10 min
    return NextResponse.json(result);
  } catch (err) {
    console.error("[videos/search] error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
