// apps/web/lib/youtube.ts
// Wrapper around YouTube Data API v3
// Quota cost reference: https://developers.google.com/youtube/v3/determine_quota_cost
//   search.list  = 100 units
//   videos.list  =   1 unit
//   Free daily quota: 10,000 units → ~100 searches/day

import { Platform, DifficultyLevel } from "@weknoq/db";

const BASE = "https://www.googleapis.com/youtube/v3";
const API_KEY = process.env.YOUTUBE_API_KEY!;

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface YouTubeSearchResult {
  platformId: string;
  platform: Platform;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelName: string;
  channelId: string;
  publishedAt: string;
  sourceUrl: string;
  embedUrl: string;
}

export interface YouTubeVideoDetail extends YouTubeSearchResult {
  durationSeconds: number;
  viewCount: number;
  likeCount: number;
  tags: string[];
}

// ─────────────────────────────────────────────
// Search
// ─────────────────────────────────────────────

export async function searchYouTube(
  query: string,
  maxResults = 20
): Promise<YouTubeSearchResult[]> {
  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    videoEmbeddable: "true",
    videoCategoryId: "27", // Education category
    maxResults: String(maxResults),
    key: API_KEY,
  });

  const res = await fetch(`${BASE}/search?${params}`, {
    next: { revalidate: 3600 }, // cache for 1 hour
  });

  if (!res.ok) throw new Error(`YouTube search failed: ${res.statusText}`);

  const data = await res.json();

  return (data.items ?? []).map((item: any) => ({
    platformId: item.id.videoId,
    platform: "YOUTUBE" as Platform,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl:
      item.snippet.thumbnails?.high?.url ??
      item.snippet.thumbnails?.default?.url,
    channelName: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    publishedAt: item.snippet.publishedAt,
    sourceUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
  }));
}

// ─────────────────────────────────────────────
// Get detailed stats for specific video IDs
// ─────────────────────────────────────────────

export async function getVideoDetails(
  videoIds: string[]
): Promise<YouTubeVideoDetail[]> {
  if (videoIds.length === 0) return [];

  const params = new URLSearchParams({
    part: "snippet,contentDetails,statistics",
    id: videoIds.join(","),
    key: API_KEY,
  });

  const res = await fetch(`${BASE}/videos?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`YouTube video details failed: ${res.statusText}`);

  const data = await res.json();

  return (data.items ?? []).map((item: any) => ({
    platformId: item.id,
    platform: "YOUTUBE" as Platform,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl:
      item.snippet.thumbnails?.high?.url ??
      item.snippet.thumbnails?.default?.url,
    channelName: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    publishedAt: item.snippet.publishedAt,
    sourceUrl: `https://www.youtube.com/watch?v=${item.id}`,
    embedUrl: `https://www.youtube.com/embed/${item.id}`,
    durationSeconds: parseISO8601Duration(item.contentDetails.duration),
    viewCount: parseInt(item.statistics?.viewCount ?? "0"),
    likeCount: parseInt(item.statistics?.likeCount ?? "0"),
    tags: item.snippet.tags ?? [],
  }));
}

// ─────────────────────────────────────────────
// Channel data (for creator profiles)
// channels.list = 1 unit per call
// ─────────────────────────────────────────────

export interface YouTubeChannelData {
  channelId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  country: string | null;
  subscriberCount: number | null;
  totalViewCount: bigint | null;
}

export async function fetchChannelData(
  channelIds: string[]
): Promise<Map<string, YouTubeChannelData>> {
  const result = new Map<string, YouTubeChannelData>();
  if (channelIds.length === 0) return result;

  // YouTube allows up to 50 IDs per request
  const batches: string[][] = [];
  for (let i = 0; i < channelIds.length; i += 50) {
    batches.push(channelIds.slice(i, i + 50));
  }

  for (const batch of batches) {
    const params = new URLSearchParams({
      part: "snippet,statistics",
      id: batch.join(","),
      key: API_KEY,
    });

    const res = await fetch(`${BASE}/channels?${params}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) continue; // skip failed batches, don't abort ingest

    const data = await res.json();
    for (const item of data.items ?? []) {
      result.set(item.id, {
        channelId: item.id,
        title: item.snippet.title,
        description: item.snippet.description ?? null,
        thumbnailUrl:
          item.snippet.thumbnails?.high?.url ??
          item.snippet.thumbnails?.default?.url ??
          null,
        country: item.snippet.country ?? null,
        subscriberCount: item.statistics?.subscriberCount
          ? parseInt(item.statistics.subscriberCount)
          : null,
        totalViewCount: item.statistics?.viewCount
          ? BigInt(item.statistics.viewCount)
          : null,
      });
    }
  }

  return result;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

// Converts "PT1H22M14S" → seconds
export function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = parseInt(match[1] ?? "0");
  const m = parseInt(match[2] ?? "0");
  const s = parseInt(match[3] ?? "0");
  return h * 3600 + m * 60 + s;
}

export function formatDuration(seconds: number): string {
  if (!seconds) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}:${String(s).padStart(2, "0")}`;
  return `0:${String(s).padStart(2, "0")}`;
}
