"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { VideoCard } from "@/components/video/VideoCard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const TOPICS = [
  { slug: "programming",  label: "Programming",  emoji: "💻" },
  { slug: "mathematics",  label: "Mathematics",  emoji: "∑"  },
  { slug: "science",      label: "Science",      emoji: "🔬" },
  { slug: "philosophy",   label: "Philosophy",   emoji: "🦉" },
  { slug: "finance",      label: "Finance",      emoji: "📈" },
  { slug: "history",      label: "History",      emoji: "📜" },
  { slug: "music-arts",   label: "Music & Arts", emoji: "🎵" },
  { slug: "languages",    label: "Languages",    emoji: "🗣️" },
  { slug: "design-art",   label: "Design & Art", emoji: "🎨" },
  { slug: "psychology",   label: "Psychology",   emoji: "🧠" },
  { slug: "astronomy",    label: "Astronomy",    emoji: "🌌" },
  { slug: "engineering",  label: "Engineering",  emoji: "⚙️" },
];

const DIFFICULTIES = [
  { value: "BEGINNER",     label: "Beginner"     },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED",     label: "Advanced"     },
];

const PLATFORMS = [
  { value: "YOUTUBE",      label: "YouTube"           },
  { value: "TED",          label: "TED"               },
  { value: "MIT_OCW",      label: "MIT OpenCourseWare"},
  { value: "KHAN_ACADEMY", label: "Khan Academy"      },
  { value: "VIMEO",        label: "Vimeo"             },
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [topic,      setTopic]  = useState(searchParams.get("topic") ?? "");
  const [difficulty, setDiff]   = useState(searchParams.get("difficulty") ?? "");
  const [platform,   setPlatform] = useState(searchParams.get("platform") ?? "");
  const [videos,     setVideos] = useState<any[]>([]);
  const [loading,    setLoading] = useState(true);
  const [page,       setPage]   = useState(1);
  const [totalPages, setTotal]  = useState(0);
  const [total,      setTotalCount] = useState(0);

  const load = useCallback(
    async (t: string, d: string, pl: string, p: number) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (t)  params.set("topic",      t);
        if (d)  params.set("difficulty", d);
        if (pl) params.set("platform",   pl);
        params.set("page", String(p));

        const res  = await fetch(`/api/videos/search?${params}`);
        const data = await res.json();
        setVideos(data.videos ?? []);
        setTotal(data.pagination?.totalPages ?? 0);
        setTotalCount(data.pagination?.total ?? 0);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load(topic, difficulty, platform, page);
    const params = new URLSearchParams();
    if (topic)      params.set("topic",      topic);
    if (difficulty) params.set("difficulty", difficulty);
    if (platform)   params.set("platform",   platform);
    router.replace(`/explore?${params}`, { scroll: false });
  }, [topic, difficulty, platform, page]);

  const resetFilters = () => {
    setTopic("");
    setDiff("");
    setPlatform("");
    setPage(1);
  };

  const activeFilters = [topic, difficulty, platform].filter(Boolean).length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24">
        {/* Header */}
        <div className="px-12 mb-12 pt-4">
          <p className="label mb-3">Video Library</p>
          <div className="flex items-end justify-between">
            <h1
              className="font-display font-bold leading-[1.05]"
              style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
            >
              Explore
              <br />
              <em className="text-amber italic">all knowledge.</em>
            </h1>
            {!loading && (
              <p className="text-[13px] text-paper/35 mb-1">
                {total.toLocaleString()} videos
              </p>
            )}
          </div>
        </div>

        {/* Topic strip */}
        <div className="px-12 mb-10 flex gap-2 flex-wrap">
          <button
            onClick={() => { setTopic(""); setPage(1); }}
            className={`text-[11px] tracking-[1px] uppercase px-4 py-2 border transition-all duration-200 ${
              !topic
                ? "bg-amber text-ink border-amber"
                : "border-paper/15 text-paper/50 hover:border-amber/40 hover:text-amber"
            }`}
          >
            All
          </button>
          {TOPICS.map((t) => (
            <button
              key={t.slug}
              onClick={() => { setTopic(t.slug); setPage(1); }}
              className={`text-[11px] tracking-[1px] uppercase px-4 py-2 border transition-all duration-200 ${
                topic === t.slug
                  ? "bg-amber text-ink border-amber"
                  : "border-paper/15 text-paper/50 hover:border-amber/40 hover:text-amber"
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        <div className="px-12 flex gap-10">
          {/* Sidebar filters */}
          <aside className="w-48 flex-shrink-0">
            <div className="flex items-center justify-between mb-5">
              <p className="label text-[11px]">Filters</p>
              {activeFilters > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-paper/30 hover:text-amber transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Difficulty */}
            <div className="mb-7">
              <p className="text-[11px] tracking-[1.5px] uppercase text-paper/30 mb-3">
                Difficulty
              </p>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => { setDiff(""); setPage(1); }}
                  className={`text-left text-[13px] py-2 px-3 transition-colors ${
                    !difficulty ? "bg-amber/10 text-amber" : "text-paper/50 hover:text-paper/80"
                  }`}
                >
                  Any level
                </button>
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => { setDiff(d.value); setPage(1); }}
                    className={`text-left text-[13px] py-2 px-3 transition-colors ${
                      difficulty === d.value
                        ? "bg-amber/10 text-amber"
                        : "text-paper/50 hover:text-paper/80"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <p className="text-[11px] tracking-[1.5px] uppercase text-paper/30 mb-3">
                Platform
              </p>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => { setPlatform(""); setPage(1); }}
                  className={`text-left text-[13px] py-2 px-3 transition-colors ${
                    !platform ? "bg-amber/10 text-amber" : "text-paper/50 hover:text-paper/80"
                  }`}
                >
                  Any platform
                </button>
                {PLATFORMS.map((pl) => (
                  <button
                    key={pl.value}
                    onClick={() => { setPlatform(pl.value); setPage(1); }}
                    className={`text-left text-[13px] py-2 px-3 transition-colors ${
                      platform === pl.value
                        ? "bg-amber/10 text-amber"
                        : "text-paper/50 hover:text-paper/80"
                    }`}
                  >
                    {pl.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Video grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="aspect-video bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-32 text-paper/30">
                <div className="text-5xl mb-6">📭</div>
                <p className="font-display text-2xl mb-3">No videos yet</p>
                <p className="text-sm max-w-xs mx-auto leading-relaxed">
                  This library is just getting started. Check back soon or{" "}
                  <a href="/submit" className="text-amber hover:underline">
                    submit a video
                  </a>
                  .
                </p>
                {activeFilters > 0 && (
                  <button
                    onClick={resetFilters}
                    className="mt-6 text-[12px] text-amber border border-amber/30 px-6 py-2 hover:bg-amber/10 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 h-9 text-[12px] border border-white/15 text-paper/50 hover:border-amber/40 hover:text-amber disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      ←
                    </button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      const p =
                        totalPages <= 7
                          ? i + 1
                          : page <= 4
                          ? i + 1
                          : page >= totalPages - 3
                          ? totalPages - 6 + i
                          : page - 3 + i;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 text-[13px] transition-colors ${
                            p === page
                              ? "bg-amber text-ink"
                              : "border border-white/15 text-paper/50 hover:border-amber/40 hover:text-amber"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 h-9 text-[12px] border border-white/15 text-paper/50 hover:border-amber/40 hover:text-amber disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 px-12">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 w-48 mb-4" />
            <div className="h-14 bg-white/10 w-96 mb-12" />
            <div className="grid grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-video bg-white/5" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
