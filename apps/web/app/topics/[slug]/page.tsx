import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@weknoq/db";
import { Navbar } from "@/components/layout/Navbar";
import { VideoCard } from "@/components/video/VideoCard";

export const revalidate = 600;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const PAGE_SIZE = 24;

async function getTopic(slug: string) {
  return prisma.topic.findUnique({ where: { slug } });
}

async function getTopicVideos(topicId: string, page: number) {
  const skip = (page - 1) * PAGE_SIZE;
  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where: { topics: { some: { topicId } }, isActive: true },
      include: {
        topics: { select: { topic: { select: { name: true, slug: true } } } },
      },
      orderBy: { viewCount: "desc" },
      take: PAGE_SIZE,
      skip,
    }),
    prisma.video.count({
      where: { topics: { some: { topicId } }, isActive: true },
    }),
  ]);
  return { videos, total, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopic(slug);
  if (!topic) return {};

  const title = `${topic.emoji ? `${topic.emoji} ` : ""}${topic.name} Videos`;
  const description =
    topic.description ??
    `Watch the best ${topic.name} educational videos — ${topic.videoCount.toLocaleString()} videos curated on Weknoq.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://weknoq.com/topics/${slug}`,
    },
    twitter: { card: "summary", title, description },
  };
}

export default async function TopicPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));

  const topic = await getTopic(slug);
  if (!topic) notFound();

  const { videos, total, totalPages } = await getTopicVideos(topic.id, page);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 px-12 pb-24">
        {/* Header */}
        <div className="mb-14">
          <p className="label mb-3">Topic</p>
          <div className="flex items-end gap-4 mb-4">
            {topic.emoji && (
              <span className="text-5xl leading-none">{topic.emoji}</span>
            )}
            <h1 className="font-display font-bold leading-none" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
              {topic.name}
            </h1>
          </div>
          {topic.description && (
            <p className="text-paper/50 max-w-2xl text-[15px] leading-relaxed mb-4">
              {topic.description}
            </p>
          )}
          <p className="text-[11px] tracking-[1.5px] uppercase text-paper/30">
            {total.toLocaleString()} videos
          </p>
        </div>

        {/* Video grid */}
        {videos.length === 0 ? (
          <div className="text-center py-24 text-paper/30">
            <p className="font-display text-2xl mb-2">No videos yet</p>
            <p className="text-sm">Check back soon — we&apos;re adding more content daily.</p>
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
                    href={`/topics/${slug}?page=${page - 1}`}
                    className="px-4 h-9 flex items-center text-[13px] border border-white/15 text-paper/50 hover:border-amber/40 hover:text-amber transition-colors"
                  >
                    ← Prev
                  </a>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
                  .map((p, i, arr) => (
                    <>
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span key={`gap-${p}`} className="px-2 h-9 flex items-center text-paper/20">…</span>
                      )}
                      <a
                        key={p}
                        href={`/topics/${slug}?page=${p}`}
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
                    href={`/topics/${slug}?page=${page + 1}`}
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
