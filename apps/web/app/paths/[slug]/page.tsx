import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatDuration } from "@/lib/youtube";

export const revalidate = 3600;

const DIFFICULTY_STYLES = {
  BEGINNER:     { text: "text-sage",  bg: "bg-sage/10",  border: "border-sage/20"  },
  INTERMEDIATE: { text: "text-amber", bg: "bg-amber/10", border: "border-amber/20" },
  ADVANCED:     { text: "text-rust",  bg: "bg-rust/10",  border: "border-rust/20"  },
};

const PLATFORM_LABELS: Record<string, string> = {
  YOUTUBE: "YouTube", VIMEO: "Vimeo", TED: "TED",
  MIT_OCW: "MIT OCW", KHAN_ACADEMY: "Khan Academy",
  COURSERA: "Coursera", EDX: "edX", OTHER: "Video",
};

async function getPath(slug: string) {
  try {
    const { prisma } = await import("@weknoq/db");
    return await prisma.learningPath.findUnique({
      where: { slug },
      include: {
        topic: { select: { name: true, emoji: true, slug: true } },
        videos: {
          orderBy: { order: "asc" },
          include: {
            video: {
              include: {
                topics: { select: { topic: { select: { name: true, slug: true } } } },
              },
            },
          },
        },
      },
    });
  } catch {
    return null;
  }
}

function formatHours(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export default async function PathDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const path = await getPath(slug);
  if (!path) notFound();

  const diff = path.difficulty as keyof typeof DIFFICULTY_STYLES | null;
  const style = diff ? DIFFICULTY_STYLES[diff] : null;
  const totalDuration = path.totalSeconds > 0 ? formatHours(path.totalSeconds) : null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24">
        {/* Breadcrumb */}
        <div className="px-12 mb-8">
          <div className="flex items-center gap-2 text-[12px] text-paper/30">
            <Link href="/" className="hover:text-amber transition-colors">Home</Link>
            <span>/</span>
            <Link href="/paths" className="hover:text-amber transition-colors">Paths</Link>
            <span>/</span>
            <span className="text-paper/50">{path.title}</span>
          </div>
        </div>

        <div className="px-12 grid grid-cols-[1fr_300px] gap-12">
          {/* Left: Path info + video list */}
          <div>
            {/* Header */}
            <div className="mb-10">
              {path.topic && (
                <div className="inline-flex items-center gap-1.5 text-[10px] tracking-[2px] uppercase text-amber mb-4">
                  <span>{path.topic.emoji}</span>
                  <Link
                    href={`/search?topic=${path.topic.slug}`}
                    className="hover:underline"
                  >
                    {path.topic.name}
                  </Link>
                </div>
              )}

              <div className="flex items-start gap-5 mb-4">
                <span className="text-5xl flex-shrink-0">{path.emoji ?? "🧭"}</span>
                <div>
                  <h1 className="font-display text-4xl font-bold leading-tight mb-2">
                    {path.title}
                  </h1>
                  {path.description && (
                    <p className="text-[15px] text-paper/55 leading-relaxed max-w-2xl">
                      {path.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Meta chips */}
              <div className="flex items-center gap-3 mt-5 flex-wrap">
                <span className="text-[11px] text-paper/40 bg-white/5 border border-white/10 px-3 py-1.5">
                  📹 {path.totalVideos} videos
                </span>
                {totalDuration && (
                  <span className="text-[11px] text-paper/40 bg-white/5 border border-white/10 px-3 py-1.5">
                    ⏱ {totalDuration} total
                  </span>
                )}
                <span className="text-[11px] text-amber bg-amber/10 border border-amber/20 px-3 py-1.5">
                  Free
                </span>
                {style && (
                  <span className={`text-[11px] px-3 py-1.5 border ${style.text} ${style.bg} ${style.border}`}>
                    {diff!.toLowerCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Video list */}
            {path.videos.length > 0 ? (
              <div className="space-y-3">
                <p className="label mb-4">Path Videos</p>
                {path.videos.map(({ video, order, note }) => {
                  const dur = video.durationSeconds ? formatDuration(video.durationSeconds) : null;
                  const platform = PLATFORM_LABELS[video.platform] ?? video.platform;
                  const sourceUrl = video.sourceUrl ?? (
                    video.platform === "YOUTUBE"
                      ? `https://www.youtube.com/watch?v=${video.platformId}`
                      : "#"
                  );

                  return (
                    <Link
                      key={video.id}
                      href={`/video/${video.id}`}
                      className="group flex gap-4 items-start p-4 border border-paper/[0.07] hover:border-amber/30 hover:bg-paper/[0.03] transition-all duration-200"
                    >
                      {/* Step number */}
                      <div className="flex-shrink-0 w-8 h-8 border border-paper/20 flex items-center justify-center text-[12px] font-mono text-paper/40 group-hover:border-amber/40 group-hover:text-amber transition-colors">
                        {order}
                      </div>

                      {/* Thumbnail */}
                      <div className="relative w-28 flex-shrink-0 overflow-hidden bg-slate aspect-video">
                        {video.thumbnailUrl ? (
                          <Image
                            src={video.thumbnailUrl}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl bg-gradient-to-br from-slate to-ink">
                            📺
                          </div>
                        )}
                        <div className="absolute inset-0 bg-ink/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-7 h-7 bg-amber rounded-full flex items-center justify-center text-ink text-xs">▶</div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] tracking-[1.5px] uppercase text-amber mb-1">
                          {platform}
                        </p>
                        <h3 className="text-[14px] font-medium leading-snug line-clamp-2 mb-1">
                          {video.title}
                        </h3>
                        {note && (
                          <p className="text-[12px] text-paper/40 italic mb-1.5 line-clamp-1">
                            "{note}"
                          </p>
                        )}
                        <div className="flex items-center gap-3">
                          {dur && (
                            <span className="text-[11px] font-mono text-paper/30">{dur}</span>
                          )}
                          {video.difficulty && (
                            <span className={`text-[10px] uppercase tracking-wide ${
                              video.difficulty === "BEGINNER" ? "text-sage" :
                              video.difficulty === "INTERMEDIATE" ? "text-amber" : "text-rust"
                            }`}>
                              {video.difficulty.toLowerCase()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0 text-paper/20 group-hover:text-amber transition-colors text-sm self-center">
                        →
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 text-paper/30 border border-paper/[0.07]">
                <div className="text-4xl mb-4">🎬</div>
                <p className="font-display text-xl mb-2">Videos coming soon</p>
                <p className="text-sm">This path is being curated. Check back shortly.</p>
              </div>
            )}
          </div>

          {/* Right: Sticky sidebar */}
          <aside>
            <div className="sticky top-28 bg-paper/[0.04] border border-paper/[0.08] p-6">
              <div className="text-3xl mb-4">{path.emoji ?? "🧭"}</div>
              <h2 className="font-display text-xl font-bold mb-3">{path.title}</h2>

              <div className="space-y-3 mb-6 text-[13px] text-paper/50">
                <div className="flex justify-between">
                  <span>Videos</span>
                  <span className="text-amber font-mono">{path.totalVideos}</span>
                </div>
                {totalDuration && (
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="text-amber font-mono">{totalDuration}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Level</span>
                  <span className={style?.text ?? "text-paper/50"}>
                    {diff ? diff.charAt(0) + diff.slice(1).toLowerCase() : "All levels"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cost</span>
                  <span className="text-sage">Free</span>
                </div>
              </div>

              <Link
                href={path.videos[0] ? `/video/${path.videos[0].video.id}` : "#"}
                className="block w-full bg-amber text-ink text-center py-3 text-[13px] font-medium hover:bg-amber-light transition-colors mb-3"
              >
                {path.videos.length > 0 ? "Start Learning →" : "Coming Soon"}
              </Link>

              <Link
                href="/paths"
                className="block w-full border border-paper/15 text-paper/50 text-center py-3 text-[13px] hover:border-amber/30 hover:text-amber transition-colors"
              >
                ← All Paths
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
