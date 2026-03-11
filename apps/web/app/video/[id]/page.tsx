import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VideoCard } from "@/components/video/VideoCard";
import { formatDuration } from "@/lib/youtube";

export const revalidate = 3600;

const PLATFORM_LABELS: Record<string, string> = {
  YOUTUBE: "YouTube",
  VIMEO: "Vimeo",
  TED: "TED",
  MIT_OCW: "MIT OpenCourseWare",
  KHAN_ACADEMY: "Khan Academy",
  COURSERA: "Coursera",
  EDX: "edX",
  OTHER: "Video",
};

const DIFFICULTY_STYLES = {
  BEGINNER: "text-sage bg-sage/10 border border-sage/20",
  INTERMEDIATE: "text-amber bg-amber/10 border border-amber/20",
  ADVANCED: "text-rust bg-rust/10 border border-rust/20",
};

async function getVideo(id: string) {
  try {
    const { prisma } = await import("@weknoq/db");
    return await prisma.video.findUnique({
      where: { id },
      include: {
        topics: {
          select: { topic: { select: { name: true, slug: true, emoji: true } } },
        },
      },
    });
  } catch {
    return null;
  }
}

async function getRelatedVideos(topicSlug: string, excludeId: string) {
  try {
    const { prisma } = await import("@weknoq/db");
    return await prisma.video.findMany({
      where: {
        isActive: true,
        id: { not: excludeId },
        topics: { some: { topic: { slug: topicSlug } } },
      },
      take: 4,
      orderBy: { viewCount: "desc" },
      include: {
        topics: { select: { topic: { select: { name: true, slug: true } } } },
      },
    });
  } catch {
    return [];
  }
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await getVideo(id);
  if (!video) notFound();

  const firstTopicSlug = video.topics[0]?.topic.slug;
  const relatedVideos = firstTopicSlug
    ? await getRelatedVideos(firstTopicSlug, video.id)
    : [];

  const embedUrl =
    video.embedUrl ??
    (video.platform === "YOUTUBE"
      ? `https://www.youtube.com/embed/${video.platformId}?rel=0&modestbranding=1`
      : null);

  const sourceUrl =
    video.sourceUrl ??
    (video.platform === "YOUTUBE"
      ? `https://www.youtube.com/watch?v=${video.platformId}`
      : null);

  const duration = video.durationSeconds
    ? formatDuration(video.durationSeconds)
    : null;

  const platform = PLATFORM_LABELS[video.platform] ?? video.platform;

  const formattedViews = video.viewCount
    ? Number(video.viewCount) >= 1_000_000
      ? `${(Number(video.viewCount) / 1_000_000).toFixed(1)}M`
      : Number(video.viewCount) >= 1_000
      ? `${(Number(video.viewCount) / 1_000).toFixed(0)}K`
      : String(video.viewCount)
    : null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24">
        {/* Breadcrumb */}
        <div className="px-12 mb-6">
          <div className="flex items-center gap-2 text-[12px] text-paper/30 tracking-wide">
            <Link href="/" className="hover:text-amber transition-colors">
              Home
            </Link>
            <span>/</span>
            {firstTopicSlug ? (
              <>
                <Link
                  href={`/search?topic=${firstTopicSlug}`}
                  className="hover:text-amber transition-colors capitalize"
                >
                  {video.topics[0]?.topic.name}
                </Link>
                <span>/</span>
              </>
            ) : null}
            <span className="text-paper/50 truncate max-w-[300px]">
              {video.title}
            </span>
          </div>
        </div>

        <div className="px-12 grid grid-cols-[1fr_340px] gap-10">
          {/* Left: Player + Info */}
          <div>
            {/* Video Player */}
            <div className="relative w-full bg-black mb-6">
              {embedUrl ? (
                <div className="relative" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title={video.title}
                  />
                </div>
              ) : video.thumbnailUrl ? (
                <div className="relative aspect-video">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/60">
                    <a
                      href={sourceUrl ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber text-ink px-8 py-3 font-medium hover:bg-amber-light transition-colors"
                    >
                      Watch on {platform} →
                    </a>
                  </div>
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-slate/50 text-paper/30">
                  <p className="text-sm">Video not embeddable</p>
                </div>
              )}
            </div>

            {/* Title & Meta */}
            <h1 className="font-display text-2xl font-bold leading-snug mb-3">
              {video.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Platform */}
              <span className="text-[10px] tracking-[1.5px] uppercase text-amber bg-amber/10 border border-amber/20 px-2.5 py-1">
                {platform}
              </span>

              {/* Difficulty */}
              {video.difficulty && (
                <span
                  className={`text-[10px] tracking-[1px] uppercase px-2.5 py-1 ${
                    DIFFICULTY_STYLES[video.difficulty]
                  }`}
                >
                  {video.difficulty.toLowerCase()}
                </span>
              )}

              {/* Duration */}
              {duration && (
                <span className="text-[12px] font-mono text-paper/40">
                  ⏱ {duration}
                </span>
              )}

              {/* Views */}
              {formattedViews && (
                <span className="text-[12px] text-paper/30">
                  {formattedViews} views
                </span>
              )}
            </div>

            {/* Channel + Topics row */}
            <div className="flex items-center justify-between py-4 border-y border-paper/[0.07] mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber/10 border border-amber/20 rounded-full flex items-center justify-center text-amber text-sm font-bold">
                  {video.channelName?.[0] ?? "?"}
                </div>
                <div>
                  <p className="text-[13px] font-medium">{video.channelName}</p>
                  <p className="text-[11px] text-paper/35 tracking-wide uppercase">
                    Channel
                  </p>
                </div>
              </div>

              {/* Topics chips */}
              <div className="flex gap-2">
                {video.topics.slice(0, 3).map(({ topic }) => (
                  <Link
                    key={topic.slug}
                    href={`/search?topic=${topic.slug}`}
                    className="text-[11px] bg-white/5 border border-white/10 px-3 py-1.5 text-paper/50 hover:text-amber hover:border-amber/30 transition-colors"
                  >
                    {topic.emoji ?? ""} {topic.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* AI Summary or Description */}
            {(video.aiSummary || video.description) && (
              <div className="mb-6">
                {video.aiSummary && (
                  <div className="bg-amber/[0.06] border border-amber/20 p-5 mb-4">
                    <p className="text-[11px] tracking-[2px] uppercase text-amber mb-2">
                      What you'll learn
                    </p>
                    <p className="text-[14px] leading-[1.7] text-paper/70">
                      {video.aiSummary}
                    </p>
                  </div>
                )}
                {video.description && (
                  <p className="text-[14px] leading-[1.8] text-paper/45 line-clamp-5">
                    {video.description}
                  </p>
                )}
              </div>
            )}

            {/* Open Original */}
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-paper/15 text-paper/50 hover:border-amber hover:text-amber text-[13px] px-6 py-3 transition-all duration-200"
              >
                Open on {platform}
                <span className="text-[10px]">↗</span>
              </a>
            )}
          </div>

          {/* Right: Related Videos */}
          {relatedVideos.length > 0 && (
            <aside>
              <p className="label mb-5">Related Videos</p>
              <div className="flex flex-col gap-4">
                {relatedVideos.map((v) => (
                  <VideoCard key={v.id} video={v} size="sm" />
                ))}
              </div>
              {firstTopicSlug && (
                <Link
                  href={`/search?topic=${firstTopicSlug}`}
                  className="mt-6 block text-center text-[12px] tracking-[1px] uppercase text-paper/30 border border-paper/[0.08] py-3 hover:text-amber hover:border-amber/30 transition-all"
                >
                  More {video.topics[0]?.topic.name} videos →
                </Link>
              )}
            </aside>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
