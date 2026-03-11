import Link from "next/link";
import type { LearningPath, Topic } from "@weknoq/db";

type PathWithTopic = Pick<
  LearningPath,
  "id" | "title" | "slug" | "emoji" | "totalVideos" | "totalSeconds" | "difficulty"
> & { topic?: Pick<Topic, "name" | "emoji"> | null };

export function LearningPaths({ paths }: { paths: PathWithTopic[] }) {
  if (!paths?.length) return null;

  return (
    <section className="px-12 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="label">Learning paths</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Follow a guided route
            </h2>
          </div>
          <Link
            href="/paths"
            className="text-sm text-paper/50 hover:text-amber transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paths.map((p) => (
            <Link
              key={p.id}
              href={`/paths/${encodeURIComponent(p.slug)}`}
              className="group border border-white/10 bg-white/[0.02] p-6 hover:border-amber/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[2px] uppercase text-paper/40">
                    {(p.topic?.emoji ?? "🧭") + " " + (p.topic?.name ?? "Path")}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold group-hover:text-amber transition-colors">
                    {p.emoji ? `${p.emoji} ` : ""}
                    {p.title}
                  </h3>
                </div>
                {p.difficulty ? (
                  <span className="text-[10px] tracking-[1px] uppercase text-paper/50 border border-white/10 px-2 py-1">
                    {p.difficulty.toLowerCase()}
                  </span>
                ) : null}
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm text-paper/45">
                <span>{p.totalVideos} videos</span>
                <span className="text-paper/20">•</span>
                <span>Curated steps</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

