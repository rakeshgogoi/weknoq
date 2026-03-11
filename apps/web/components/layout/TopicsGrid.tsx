import Link from "next/link";
import type { Topic } from "@weknoq/db";

export function TopicsGrid({
  topics,
}: {
  topics: Pick<Topic, "name" | "slug" | "emoji" | "videoCount">[];
}) {
  if (!topics?.length) return null;

  return (
    <section className="px-12 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="label">Topics</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              Browse by category
            </h2>
          </div>
          <Link
            href="/search"
            className="text-sm text-paper/50 hover:text-amber transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topics.map((t) => (
            <Link
              key={t.slug}
              href={`/search?topic=${encodeURIComponent(t.slug)}`}
              className="group border border-white/10 bg-white/[0.02] p-5 hover:border-amber/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{t.emoji ?? "📚"}</span>
                <span className="text-xs text-paper/40">
                  {t.videoCount ?? 0} videos
                </span>
              </div>
              <p className="mt-4 font-display text-lg font-semibold group-hover:text-amber transition-colors">
                {t.name}
              </p>
              <p className="mt-1 text-sm text-paper/45">Explore curated picks</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

