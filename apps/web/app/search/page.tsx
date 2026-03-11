"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { VideoCard } from "@/components/video/VideoCard";
import { Navbar } from "@/components/layout/Navbar";

const TOPICS = [
  { slug: "programming",  label: "Programming", emoji: "💻" },
  { slug: "science",      label: "Science",     emoji: "🔬" },
  { slug: "philosophy",   label: "Philosophy",  emoji: "🦉" },
  { slug: "finance",      label: "Finance",     emoji: "📈" },
  { slug: "music-arts",   label: "Music & Arts",emoji: "🎵" },
  { slug: "languages",    label: "Languages",   emoji: "🗣️" },
  { slug: "mathematics",  label: "Mathematics", emoji: "∑"  },
  { slug: "history",      label: "History",     emoji: "📜" },
];

const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery]         = useState(searchParams.get("q") ?? "");
  const [topic, setTopic]         = useState(searchParams.get("topic") ?? "");
  const [difficulty, setDiff]     = useState(searchParams.get("difficulty") ?? "");
  const [videos, setVideos]       = useState<any[]>([]);
  const [loading, setLoading]     = useState(false);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotal]    = useState(0);

  const search = useCallback(async (q: string, t: string, d: string, p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (t) params.set("topic", t);
      if (d) params.set("difficulty", d);
      params.set("page", String(p));

      const res = await fetch(`/api/videos/search?${params}`);
      const data = await res.json();
      setVideos(data.videos ?? []);
      setTotal(data.pagination?.totalPages ?? 0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run search when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query, topic, difficulty, page);
      // Update URL
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (topic) params.set("topic", topic);
      if (difficulty) params.set("difficulty", difficulty);
      router.replace(`/search?${params}`, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, topic, difficulty, page]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-12 pb-24">
        {/* Search bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="font-display text-4xl font-bold mb-8 text-center">
            Search <span className="italic text-amber">Knowledge</span>
          </h1>
          <div className="flex border border-white/15 focus-within:border-amber/60 transition-colors">
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search any topic, channel, or keyword…"
              className="flex-1 bg-transparent px-6 py-4 text-paper placeholder-paper/30 focus:outline-none text-[15px]"
            />
            <button className="bg-amber text-ink px-8 font-medium hover:bg-amber-light transition-colors">
              Search
            </button>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Filters sidebar */}
          <aside className="w-52 flex-shrink-0">
            {/* Topic filter */}
            <div className="mb-8">
              <p className="label mb-4">Topic</p>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => { setTopic(""); setPage(1); }}
                  className={`text-left text-[13px] py-2 px-3 transition-colors ${
                    !topic ? "bg-amber/10 text-amber" : "text-paper/50 hover:text-paper/80"
                  }`}
                >
                  All Topics
                </button>
                {TOPICS.map((t) => (
                  <button
                    key={t.slug}
                    onClick={() => { setTopic(t.slug); setPage(1); }}
                    className={`text-left text-[13px] py-2 px-3 transition-colors ${
                      topic === t.slug
                        ? "bg-amber/10 text-amber"
                        : "text-paper/50 hover:text-paper/80"
                    }`}
                  >
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty filter */}
            <div>
              <p className="label mb-4">Difficulty</p>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => { setDiff(""); setPage(1); }}
                  className={`text-left text-[13px] py-2 px-3 transition-colors ${
                    !difficulty ? "bg-amber/10 text-amber" : "text-paper/50 hover:text-paper/80"
                  }`}
                >
                  All Levels
                </button>
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => { setDiff(d); setPage(1); }}
                    className={`text-left text-[13px] py-2 px-3 capitalize transition-colors ${
                      difficulty === d
                        ? "bg-amber/10 text-amber"
                        : "text-paper/50 hover:text-paper/80"
                    }`}
                  >
                    {d.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-video bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-24 text-paper/30">
                <p className="font-display text-2xl mb-3">No videos found</p>
                <p className="text-sm">Try a different search term or remove filters</p>
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
