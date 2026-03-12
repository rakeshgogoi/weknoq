import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@weknoq/db";
import { Navbar } from "@/components/layout/Navbar";
import { VideoCard } from "@/components/video/VideoCard";

export const revalidate = 600;

interface Props {
  params: Promise<{ channelId: string }>;
  searchParams: Promise<{ page?: string }>;
}

const PAGE_SIZE = 24;

async function getCreator(channelId: string) {
  return prisma.creator.findUnique({ where: { channelId } });
}

async function getCreatorVideos(creatorId: string, page: number) {
  const skip = (page - 1) * PAGE_SIZE;
  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where: { creatorId, isActive: true },
      include: {
        topics: { select: { topic: { select: { name: true, slug: true } } } },
      },
      orderBy: { viewCount: "desc" },
      take: PAGE_SIZE,
      skip,
    }),
    prisma.video.count({ where: { creatorId, isActive: true } }),
  ]);
  return { videos, total, totalPages: Math.ceil(total / PAGE_SIZE) };
}

function formatCount(n: number | bigint | null): string {
  if (n === null || n === undefined) return "—";
  const num = typeof n === "bigint" ? Number(n) : n;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return String(num);
}

function countryFlag(code: string): string {
  const codePoints = [...code.toUpperCase()].map(
    (c) => 127397 + c.charCodeAt(0)
  );
  return String.fromCodePoint(...codePoints);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { channelId } = await params;
  const creator = await getCreator(channelId);
  if (!creator) return {};

  const title = `${creator.channelName} — Educational Videos | Weknoq`;
  const description =
    creator.description?.slice(0, 160) ??
    `Watch educational videos from ${creator.channelName} on Weknoq.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://weknoq.com/creators/${channelId}`,
      images: creator.thumbnailUrl ? [creator.thumbnailUrl] : [],
    },
    twitter: { card: "summary", title, description },
  };
}

export default async function CreatorPage({ params, searchParams }: Props) {
  const { channelId } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));

  const creator = await getCreator(channelId);
  if (!creator) notFound();

  const { videos, total, totalPages } = await getCreatorVideos(
    creator.id,
    page
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 px-12 pb-24">
        {/* Creator header */}
        <div className="flex items-start gap-8 mb-14">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-white/10 flex-shrink-0 ring-2 ring-amber/30">
            {creator.thumbnailUrl ? (
              <Image
                src={creator.thumbnailUrl}
                alt={creator.channelName}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-paper/30">
                {creator.channelName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="label mb-2">Creator</p>
            <h1
              className="font-display font-bold leading-tight mb-2"
              style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
            >
              {creator.channelName}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              {creator.country && (
                <span className="text-[13px] text-paper/50">
                  {countryFlag(creator.country)} {creator.country}
                </span>
              )}
              {creator.subscriberCount !== null && (
                <span className="text-[11px] tracking-[1.5px] uppercase text-paper/30">
                  {formatCount(creator.subscriberCount)} subscribers
                </span>
              )}
              <span className="text-[11px] tracking-[1.5px] uppercase text-paper/30">
                {total.toLocaleString()} videos
              </span>
            </div>

            {creator.description && (
              <p className="text-paper/50 text-[14px] leading-relaxed max-w-2xl line-clamp-3">
                {creator.description}
              </p>
            )}
          </div>

          {/* YouTube link */}
          <a
            href={`https://www.youtube.com/channel/${creator.channelId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-5 py-2.5 border border-white/15 text-[13px] text-paper/50 hover:border-amber/40 hover:text-amber transition-colors"
          >
            View on YouTube ↗
          </a>
        </div>

        {/* Video grid */}
        {videos.length === 0 ? (
          <div className="text-center py-24 text-paper/30">
            <p className="font-display text-2xl mb-2">No videos yet</p>
            <p className="text-sm">
              Videos will appear here after the next ingest.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-14">
                {page > 1 && (
                  <a
                    href={`/creators/${channelId}?page=${page - 1}`}
                    className="px-4 h-9 flex items-center text-[13px] border border-white/15 text-paper/50 hover:border-amber/40 hover:text-amber transition-colors"
                  >
                    ← Prev
                  </a>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      Math.abs(p - page) <= 2 || p === 1 || p === totalPages
                  )
                  .map((p, i, arr) => (
                    <>
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span
                          key={`gap-${p}`}
                          className="px-2 h-9 flex items-center text-paper/20"
                        >
                          …
                        </span>
                      )}
                      <a
                        key={p}
                        href={`/creators/${channelId}?page=${p}`}
                        className={`w-9 h-9 flex items-center justify-center text-[13px] transition-colors ${
                          p === page
                            ? "bg-amber text-ink"
                            : "border border-white/15 text-paper/50 hover:border-amber/40 hover:text-amber"
                        }`}
                      >
                        {p}
                      </a>
                    </>
                  ))}
                {page < totalPages && (
                  <a
                    href={`/creators/${channelId}?page=${page + 1}`}
                    className="px-4 h-9 flex items-center text-[13px] border border-white/15 text-paper/50 hover:border-amber/40 hover:text-amber transition-colors"
                  >
                    Next →
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
