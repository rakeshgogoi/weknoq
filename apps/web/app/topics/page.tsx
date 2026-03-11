import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 3600;

const TOPIC_GRADIENTS: Record<string, string> = {
  programming:   "linear-gradient(135deg, #1a2744, #2a4a7f)",
  mathematics:   "linear-gradient(135deg, #1a2744, #2a5a8f)",
  science:       "linear-gradient(135deg, #0d2b1a, #1a5c35)",
  philosophy:    "linear-gradient(135deg, #2b1a0d, #7a4010)",
  finance:       "linear-gradient(135deg, #1a1a2b, #3a2a6a)",
  history:       "linear-gradient(135deg, #2b1a00, #8a5a00)",
  "music-arts":  "linear-gradient(135deg, #2b0d1a, #7a1040)",
  languages:     "linear-gradient(135deg, #0d1a2b, #10407a)",
  "design-art":  "linear-gradient(135deg, #1a2b0d, #407a10)",
  psychology:    "linear-gradient(135deg, #2b0d2b, #7a1070)",
  astronomy:     "linear-gradient(135deg, #0d0d2b, #1a1a7a)",
  engineering:   "linear-gradient(135deg, #0d2b2b, #107a7a)",
  medicine:      "linear-gradient(135deg, #2b0d0d, #8a1a1a)",
  economics:     "linear-gradient(135deg, #1a2b1a, #2a6a2a)",
  literature:    "linear-gradient(135deg, #2b2b0d, #6a6a10)",
  geography:     "linear-gradient(135deg, #0d2b2b, #1a7a6a)",
};

const FALLBACK_TOPICS = [
  { name: "Programming",   slug: "programming",  emoji: "💻", videoCount: 18400, description: "Code, algorithms, software engineering, and computer science fundamentals." },
  { name: "Mathematics",   slug: "mathematics",  emoji: "∑",  videoCount: 12300, description: "From arithmetic to abstract algebra, calculus, and beyond." },
  { name: "Science",       slug: "science",      emoji: "🔬", videoCount: 24100, description: "Physics, chemistry, biology, and the scientific method explained." },
  { name: "Philosophy",    slug: "philosophy",   emoji: "🦉", videoCount: 7200,  description: "Ethics, metaphysics, logic, and the history of human thought." },
  { name: "Finance",       slug: "finance",      emoji: "📈", videoCount: 11800, description: "Investing, budgeting, economics, and financial literacy." },
  { name: "History",       slug: "history",      emoji: "📜", videoCount: 8750,  description: "World history, civilizations, wars, and the forces that shaped us." },
  { name: "Music & Arts",  slug: "music-arts",   emoji: "🎵", videoCount: 9400,  description: "Music theory, composition, art history, and creative expression." },
  { name: "Languages",     slug: "languages",    emoji: "🗣️", videoCount: 13900, description: "Learn Japanese, Spanish, French, Mandarin, and dozens more." },
  { name: "Design & Art",  slug: "design-art",   emoji: "🎨", videoCount: 6600,  description: "Visual design, UX, illustration, typography, and creative tools." },
  { name: "Psychology",    slug: "psychology",   emoji: "🧠", videoCount: 8100,  description: "Human behavior, cognitive science, mental health, and the mind." },
  { name: "Astronomy",     slug: "astronomy",    emoji: "🌌", videoCount: 5400,  description: "The cosmos, planets, black holes, dark matter, and the universe." },
  { name: "Engineering",   slug: "engineering",  emoji: "⚙️", videoCount: 9200,  description: "Civil, mechanical, electrical, and software engineering concepts." },
  { name: "Medicine",      slug: "medicine",     emoji: "⚕️", videoCount: 7800,  description: "Human anatomy, physiology, diseases, and medical breakthroughs." },
  { name: "Economics",     slug: "economics",    emoji: "💹", videoCount: 6300,  description: "Micro and macroeconomics, global markets, and economic theory." },
  { name: "Literature",    slug: "literature",   emoji: "📖", videoCount: 4200,  description: "Classic and modern literature, writing craft, and storytelling." },
  { name: "Geography",     slug: "geography",    emoji: "🌍", videoCount: 3900,  description: "World geography, cartography, geopolitics, and cultures." },
];

async function getTopics() {
  try {
    const { prisma } = await import("@weknoq/db");
    const topics = await prisma.topic.findMany({
      orderBy: { videoCount: "desc" },
    });
    return topics.length ? topics : FALLBACK_TOPICS;
  } catch {
    return FALLBACK_TOPICS;
  }
}

export default async function TopicsPage() {
  const topics = await getTopics();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24">
        {/* Header */}
        <div className="px-12 pt-4 mb-14">
          <p className="label mb-3">Browse by Topic</p>
          <div className="flex items-end justify-between">
            <h1
              className="font-display font-bold leading-[1.05]"
              style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
            >
              Every field of
              <br />
              <em className="text-amber italic">human knowledge.</em>
            </h1>
            <p className="text-[13px] text-paper/35 mb-1">
              {topics.length} topic categories
            </p>
          </div>

          <p className="mt-5 text-[15px] text-paper/45 leading-relaxed max-w-2xl">
            Weknoq aggregates the best educational videos from across the internet,
            organized into topics so you can go deep on anything that interests you.
          </p>
        </div>

        {/* Topics grid */}
        <div className="px-12 grid grid-cols-4 gap-5">
          {topics.map((t) => (
            <Link
              key={t.slug}
              href={`/search?topic=${encodeURIComponent(t.slug)}`}
              className="group relative overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1.5"
              style={{ aspectRatio: "1 / 1.1" }}
            >
              {/* Gradient background */}
              <div
                className="absolute inset-0 flex items-center justify-center text-[64px] transition-transform duration-300 group-hover:scale-[1.08]"
                style={{
                  background:
                    TOPIC_GRADIENTS[t.slug] ??
                    "linear-gradient(135deg, #1a1a1a, #2a2a2a)",
                }}
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

              {/* Arrow on hover */}
              <div className="absolute top-4 right-4 w-8 h-8 border border-paper/20 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 group-hover:bg-amber group-hover:border-amber group-hover:text-ink transition-all duration-300">
                ↗
              </div>

              {/* Text */}
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-display text-xl font-bold mb-1">{t.name}</p>
                {"description" in t && t.description ? (
                  <p className="text-[11px] text-paper/40 leading-snug line-clamp-2 mb-1.5 hidden group-hover:block">
                    {t.description}
                  </p>
                ) : null}
                <p className="text-[11px] tracking-[1.5px] uppercase text-paper/40">
                  {t.videoCount ? `${t.videoCount.toLocaleString()} videos` : "Coming soon"}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="px-12 mt-20 pt-14 border-t border-paper/[0.06]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-xl font-bold mb-2">
                Don&apos;t see your topic?
              </p>
              <p className="text-[14px] text-paper/40">
                Submit a video or request a new topic category.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/submit"
                className="bg-amber text-ink px-7 py-3 text-sm font-medium hover:bg-amber-light transition-colors"
              >
                Submit a Video
              </Link>
              <Link
                href="/explore"
                className="border border-paper/20 text-paper/60 px-7 py-3 text-sm hover:border-amber hover:text-amber transition-colors"
              >
                Explore All Videos
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
