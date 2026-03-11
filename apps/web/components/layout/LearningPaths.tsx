import Link from "next/link";
import type { LearningPath, Topic } from "@weknoq/db";

type PathWithTopic = Pick<
  LearningPath,
  "id" | "title" | "slug" | "emoji" | "description" | "totalVideos" | "totalSeconds" | "difficulty"
> & { topic?: Pick<Topic, "name" | "emoji"> | null };

function formatHours(seconds: number): string {
  const h = Math.round(seconds / 3600);
  return h > 0 ? `~${h}h` : "<1h";
}

export function LearningPaths({ paths }: { paths: PathWithTopic[] }) {
  const displayPaths = paths?.length ? paths : FALLBACK_PATHS;

  return (
    <section className="px-4 sm:px-8 md:px-12 py-16 md:py-24">
      <div className="flex items-end justify-between mb-10 md:mb-14">
        <div>
          <p className="label mb-3">Learning Paths</p>
          <h2
            className="font-display font-bold leading-[1.1]"
            style={{ fontSize: "clamp(30px, 3.5vw, 44px)" }}
          >
            Structured journeys
            <br />
            <em className="italic text-amber">to mastery.</em>
          </h2>
        </div>
        <Link
          href="/paths"
          className="text-[13px] tracking-[1px] uppercase text-paper/40 border-b border-paper/15 pb-0.5 hover:text-amber hover:border-amber transition-all duration-200 whitespace-nowrap"
        >
          All paths →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {displayPaths.map((p) => (
          <Link
            key={p.id}
            href={`/paths/${encodeURIComponent(p.slug)}`}
            className="group relative bg-paper/[0.03] border border-paper/[0.07] p-7 cursor-pointer transition-all duration-300 overflow-hidden hover:border-paper/[0.14] hover:bg-paper/[0.05]"
          >
            {/* Bottom accent bar on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            <div className="text-[32px] mb-4">{p.emoji ?? "🧭"}</div>

            <h3 className="font-display text-[18px] font-bold mb-2">
              {p.title}
            </h3>

            {p.description && (
              <p className="text-[13px] leading-[1.6] text-paper/45 mb-5 line-clamp-2">
                {p.description}
              </p>
            )}

            <div className="flex gap-4 mt-auto">
              <div className="text-[11px] text-paper/35 tracking-[0.5px]">
                <strong className="text-amber font-medium block text-[15px] font-mono">
                  {p.totalVideos}
                </strong>
                Videos
              </div>
              {p.totalSeconds > 0 && (
                <div className="text-[11px] text-paper/35 tracking-[0.5px]">
                  <strong className="text-amber font-medium block text-[15px] font-mono">
                    {formatHours(p.totalSeconds)}
                  </strong>
                  Total
                </div>
              )}
              <div className="text-[11px] text-paper/35 tracking-[0.5px]">
                <strong className="text-amber font-medium block text-[15px] font-mono">
                  Free
                </strong>
                Sources
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Fallback when DB is empty
const FALLBACK_PATHS = [
  {
    id: "1", title: "Python for Beginners", slug: "python-beginners", emoji: "🐍",
    description: "From zero to writing real programs. Covers syntax, data structures, functions, and a final project.",
    totalVideos: 24, totalSeconds: 64800, difficulty: "BEGINNER" as const,
  },
  {
    id: "2", title: "Personal Finance Foundations", slug: "personal-finance", emoji: "💸",
    description: "Budgeting, investing basics, compound interest, and building your first portfolio.",
    totalVideos: 16, totalSeconds: 32400, difficulty: "BEGINNER" as const,
  },
  {
    id: "3", title: "Astrophysics 101", slug: "astrophysics-101", emoji: "🌌",
    description: "The Big Bang, black holes, dark matter, and the fate of the universe — accessible for everyone.",
    totalVideos: 20, totalSeconds: 50400, difficulty: "INTERMEDIATE" as const,
  },
  {
    id: "4", title: "Western Philosophy", slug: "western-philosophy", emoji: "🎭",
    description: "Socrates to Nietzsche — explore the big ideas that shaped how humans think about existence.",
    totalVideos: 28, totalSeconds: 79200, difficulty: "BEGINNER" as const,
  },
  {
    id: "5", title: "Japanese for Beginners", slug: "japanese-beginners", emoji: "🇯🇵",
    description: "Hiragana, Katakana, basic grammar, and conversational phrases from the world's best free resources.",
    totalVideos: 32, totalSeconds: 93600, difficulty: "BEGINNER" as const,
  },
  {
    id: "6", title: "Music Theory Fundamentals", slug: "music-theory", emoji: "🎸",
    description: "Scales, chords, rhythm, and harmony — everything you need to understand and create music.",
    totalVideos: 18, totalSeconds: 39600, difficulty: "BEGINNER" as const,
  },
];
