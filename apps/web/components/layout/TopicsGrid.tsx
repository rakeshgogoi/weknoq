import Link from "next/link";
import type { Topic } from "@weknoq/db";

// Gradient backgrounds keyed by common topic slugs
const TOPIC_GRADIENTS: Record<string, string> = {
  programming:   "linear-gradient(135deg, #1a2744, #2a4a7f)",
  science:       "linear-gradient(135deg, #0d2b1a, #1a5c35)",
  philosophy:    "linear-gradient(135deg, #2b1a0d, #7a4010)",
  finance:       "linear-gradient(135deg, #1a1a2b, #3a2a6a)",
  music:         "linear-gradient(135deg, #2b0d1a, #7a1040)",
  "music-arts":  "linear-gradient(135deg, #2b0d1a, #7a1040)",
  languages:     "linear-gradient(135deg, #0d1a2b, #10407a)",
  language:      "linear-gradient(135deg, #0d1a2b, #10407a)",
  "design-art":  "linear-gradient(135deg, #1a2b0d, #407a10)",
  design:        "linear-gradient(135deg, #1a2b0d, #407a10)",
  art:           "linear-gradient(135deg, #1a2b0d, #407a10)",
  history:       "linear-gradient(135deg, #2b1a00, #8a5a00)",
  mathematics:   "linear-gradient(135deg, #1a2744, #2a5a8f)",
  math:          "linear-gradient(135deg, #1a2744, #2a5a8f)",
  psychology:    "linear-gradient(135deg, #2b0d2b, #7a1070)",
  engineering:   "linear-gradient(135deg, #0d2b2b, #107a7a)",
  medicine:      "linear-gradient(135deg, #2b0d0d, #8a1a1a)",
  astronomy:     "linear-gradient(135deg, #0d0d2b, #1a1a7a)",
};

function getGradient(slug: string): string {
  return (
    TOPIC_GRADIENTS[slug] ||
    TOPIC_GRADIENTS[slug.replace(/-/g, "")] ||
    "linear-gradient(135deg, #1a1a1a, #2a2a2a)"
  );
}

export function TopicsGrid({
  topics,
}: {
  topics: Pick<Topic, "name" | "slug" | "emoji" | "videoCount">[];
}) {
  const displayTopics = topics?.length
    ? topics
    : FALLBACK_TOPICS;

  return (
    <section className="px-12 py-24 bg-paper/[0.015]">
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="label mb-3">Browse by Topic</p>
          <h2
            className="font-display font-bold leading-[1.1]"
            style={{ fontSize: "clamp(30px, 3.5vw, 44px)" }}
          >
            Every field of
            <br />
            <em className="italic text-amber">human knowledge.</em>
          </h2>
        </div>
        <Link
          href="/topics"
          className="text-[13px] tracking-[1px] uppercase text-paper/40 border-b border-paper/15 pb-0.5 hover:text-amber hover:border-amber transition-all duration-200 whitespace-nowrap"
        >
          View all 48 topics →
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {displayTopics.map((t) => (
          <Link
            key={t.slug}
            href={`/search?topic=${encodeURIComponent(t.slug)}`}
            className="group relative overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1.5"
            style={{ aspectRatio: "1 / 1.1" }}
          >
            {/* Gradient background */}
            <div
              className="absolute inset-0 flex items-center justify-center text-[64px] transition-transform duration-300 group-hover:scale-[1.08]"
              style={{ background: getGradient(t.slug) }}
            >
              {t.emoji ?? "📚"}
            </div>

            {/* Overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(13,12,10,0.92) 0%, rgba(13,12,10,0.2) 70%, transparent 100%)",
              }}
            />

            {/* Arrow (shows on hover) */}
            <div className="absolute top-5 right-5 w-8 h-8 border border-paper/20 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 group-hover:bg-amber group-hover:border-amber group-hover:text-ink transition-all duration-300">
              ↗
            </div>

            {/* Text content */}
            <div className="absolute bottom-5 left-5 right-5">
              <p className="font-display text-xl font-bold mb-1.5">{t.name}</p>
              <p className="text-[11px] tracking-[1.5px] uppercase text-paper/50">
                {t.videoCount ? `${t.videoCount.toLocaleString()} videos` : "Coming soon"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Fallback data when DB is empty
const FALLBACK_TOPICS = [
  { name: "Programming",   slug: "programming",  emoji: "💻", videoCount: 18400 },
  { name: "Science",       slug: "science",       emoji: "🔬", videoCount: 24100 },
  { name: "Philosophy",    slug: "philosophy",    emoji: "🦉", videoCount: 7200  },
  { name: "Finance",       slug: "finance",       emoji: "📈", videoCount: 11800 },
  { name: "Music & Arts",  slug: "music-arts",    emoji: "🎵", videoCount: 9400  },
  { name: "Languages",     slug: "languages",     emoji: "🗣️", videoCount: 13900 },
  { name: "Design & Art",  slug: "design-art",    emoji: "🎨", videoCount: 6600  },
  { name: "History",       slug: "history",       emoji: "📜", videoCount: 8750  },
];
