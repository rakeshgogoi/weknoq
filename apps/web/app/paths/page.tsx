import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 3600;

const DIFFICULTY_STYLES = {
  BEGINNER:     { text: "text-sage",  bg: "bg-sage/10",  border: "border-sage/20"  },
  INTERMEDIATE: { text: "text-amber", bg: "bg-amber/10", border: "border-amber/20" },
  ADVANCED:     { text: "text-rust",  bg: "bg-rust/10",  border: "border-rust/20"  },
};

function formatHours(seconds: number): string {
  const h = Math.round(seconds / 3600);
  return h > 0 ? `~${h}h` : "<1h";
}

const FALLBACK_PATHS = [
  {
    id: "1", slug: "python-beginners", emoji: "🐍", title: "Python for Beginners",
    description: "From zero to writing real programs. Covers syntax, data structures, functions, and a final project.",
    totalVideos: 24, totalSeconds: 64800, difficulty: "BEGINNER",
    topic: { name: "Programming", emoji: "💻" },
  },
  {
    id: "2", slug: "personal-finance", emoji: "💸", title: "Personal Finance Foundations",
    description: "Budgeting, investing basics, compound interest, and building your first portfolio.",
    totalVideos: 16, totalSeconds: 32400, difficulty: "BEGINNER",
    topic: { name: "Finance", emoji: "📈" },
  },
  {
    id: "3", slug: "astrophysics-101", emoji: "🌌", title: "Astrophysics 101",
    description: "The Big Bang, black holes, dark matter, and the fate of the universe — accessible for everyone.",
    totalVideos: 20, totalSeconds: 50400, difficulty: "INTERMEDIATE",
    topic: { name: "Science", emoji: "🔬" },
  },
  {
    id: "4", slug: "western-philosophy", emoji: "🎭", title: "Western Philosophy",
    description: "Socrates to Nietzsche — explore the big ideas that shaped how humans think about existence.",
    totalVideos: 28, totalSeconds: 79200, difficulty: "BEGINNER",
    topic: { name: "Philosophy", emoji: "🦉" },
  },
  {
    id: "5", slug: "japanese-beginners", emoji: "🇯🇵", title: "Japanese for Beginners",
    description: "Hiragana, Katakana, basic grammar, and conversational phrases from the world's best free resources.",
    totalVideos: 32, totalSeconds: 93600, difficulty: "BEGINNER",
    topic: { name: "Languages", emoji: "🗣️" },
  },
  {
    id: "6", slug: "music-theory", emoji: "🎸", title: "Music Theory Fundamentals",
    description: "Scales, chords, rhythm, and harmony — everything you need to understand and create music.",
    totalVideos: 18, totalSeconds: 39600, difficulty: "BEGINNER",
    topic: { name: "Music & Arts", emoji: "🎵" },
  },
  {
    id: "7", slug: "essence-of-calculus", emoji: "∫", title: "The Essence of Calculus",
    description: "Visual, intuitive calculus from 3Blue1Brown — derivatives, integrals, and the fundamental theorem.",
    totalVideos: 12, totalSeconds: 28800, difficulty: "INTERMEDIATE",
    topic: { name: "Mathematics", emoji: "∑" },
  },
  {
    id: "8", slug: "machine-learning-intro", emoji: "🤖", title: "Introduction to Machine Learning",
    description: "Neural networks, gradient descent, and the math behind modern AI — built from scratch.",
    totalVideos: 15, totalSeconds: 43200, difficulty: "INTERMEDIATE",
    topic: { name: "Programming", emoji: "💻" },
  },
  {
    id: "9", slug: "world-history", emoji: "🌍", title: "World History: From Humans to Now",
    description: "From the Agricultural Revolution through empires, revolutions, and the modern era.",
    totalVideos: 22, totalSeconds: 57600, difficulty: "BEGINNER",
    topic: { name: "History", emoji: "📜" },
  },
];

async function getPaths() {
  try {
    const { prisma } = await import("@weknoq/db");
    const paths = await prisma.learningPath.findMany({
      orderBy: [{ isFeatured: "desc" }, { totalVideos: "desc" }],
      include: { topic: { select: { name: true, emoji: true } } },
    });
    return paths.length ? paths : FALLBACK_PATHS;
  } catch {
    return FALLBACK_PATHS;
  }
}

export default async function PathsPage() {
  const paths = await getPaths();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24">
        {/* Header */}
        <div className="px-4 sm:px-8 md:px-12 pt-4 mb-10 md:mb-14">
          <p className="label mb-3">Learning Paths</p>
          <div className="flex items-end justify-between">
            <h1
              className="font-display font-bold leading-[1.05]"
              style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
            >
              Structured journeys
              <br />
              <em className="text-amber italic">to mastery.</em>
            </h1>
            <p className="text-[13px] text-paper/35 mb-1">
              {paths.length} curated paths
            </p>
          </div>
          <p className="mt-5 text-[15px] text-paper/45 leading-relaxed max-w-2xl">
            Each path is a hand-curated sequence of the best free videos on the topic.
            No subscriptions, no paywalls — just great learning.
          </p>
        </div>

        {/* Paths grid */}
        <div className="px-4 sm:px-8 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {paths.map((p: any) => {
            const diff = p.difficulty as keyof typeof DIFFICULTY_STYLES | null;
            const style = diff ? DIFFICULTY_STYLES[diff] : null;

            return (
              <Link
                key={p.id}
                href={`/paths/${encodeURIComponent(p.slug)}`}
                className="group relative bg-paper/[0.03] border border-paper/[0.07] p-7 transition-all duration-300 overflow-hidden hover:border-paper/[0.14] hover:bg-paper/[0.05]"
              >
                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                {/* Topic pill */}
                {p.topic && (
                  <div className="inline-flex items-center gap-1 text-[10px] tracking-[1.5px] uppercase text-paper/30 mb-4">
                    <span>{p.topic.emoji}</span>
                    <span>{p.topic.name}</span>
                  </div>
                )}

                <div className="text-[32px] mb-3">{p.emoji ?? "🧭"}</div>

                <h3 className="font-display text-[19px] font-bold mb-2 leading-snug">
                  {p.title}
                </h3>

                {p.description && (
                  <p className="text-[13px] leading-[1.6] text-paper/45 mb-5 line-clamp-2">
                    {p.description}
                  </p>
                )}

                <div className="flex items-center gap-5 mt-auto">
                  <div className="text-[11px] text-paper/35">
                    <strong className="text-amber font-mono text-[16px] block">
                      {p.totalVideos}
                    </strong>
                    Videos
                  </div>
                  {p.totalSeconds > 0 && (
                    <div className="text-[11px] text-paper/35">
                      <strong className="text-amber font-mono text-[16px] block">
                        {formatHours(p.totalSeconds)}
                      </strong>
                      Total
                    </div>
                  )}
                  <div className="text-[11px] text-paper/35">
                    <strong className="text-amber font-mono text-[16px] block">
                      Free
                    </strong>
                    Sources
                  </div>

                  {/* Difficulty badge */}
                  {style && (
                    <span
                      className={`ml-auto text-[10px] tracking-[1px] uppercase px-2.5 py-1 border ${style.text} ${style.bg} ${style.border}`}
                    >
                      {diff!.toLowerCase()}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Suggest a path */}
        <div className="px-4 sm:px-8 md:px-12 mt-12 md:mt-16 pt-10 md:pt-12 border-t border-paper/[0.06]">
          <div className="bg-amber/[0.04] border border-amber/15 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="font-display text-xl font-bold mb-1">
                Want a path on something specific?
              </p>
              <p className="text-[14px] text-paper/40">
                We curate paths based on community requests. Submit a video or suggest a topic.
              </p>
            </div>
            <Link
              href="/submit"
              className="flex-shrink-0 bg-amber text-ink px-7 py-3 text-sm font-medium hover:bg-amber-light transition-colors"
            >
              Suggest a Path
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
