import Link from "next/link";
import Image from "next/image";

const PLATFORM_LABELS: Record<string, string> = {
  YOUTUBE:      "YouTube",
  VIMEO:        "Vimeo",
  TED:          "TED",
  MIT_OCW:      "MIT OCW",
  KHAN_ACADEMY: "Khan Academy",
  COURSERA:     "Coursera",
  EDX:          "edX",
  OTHER:        "Video",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER:     "bg-sage/20 text-sage",
  INTERMEDIATE: "bg-amber/20 text-amber",
  ADVANCED:     "bg-rust/20 text-rust",
};

const ANIM_CLASSES = [
  "animate-fade-slide-1",
  "animate-fade-slide-2",
  "animate-fade-slide-3",
];

type HeroVideo = {
  id: string;
  thumbnailUrl: string;
  title: string;
  platform: string;
  difficulty?: string | null;
  durationSeconds?: number | null;
  topics: { topic: { name: string } }[];
};

function formatSeconds(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

const MOCK_VIDEOS: HeroVideo[] = [
  {
    id: "mock-1",
    thumbnailUrl: "",
    title: "Introduction to Algorithms — Lecture 1",
    platform: "MIT_OCW",
    difficulty: "BEGINNER",
    durationSeconds: 4920,
    topics: [{ topic: { name: "Programming" } }],
  },
  {
    id: "mock-2",
    thumbnailUrl: "",
    title: "The philosophy of time management",
    platform: "TED",
    difficulty: "INTERMEDIATE",
    durationSeconds: 1080,
    topics: [{ topic: { name: "Philosophy" } }],
  },
  {
    id: "mock-3",
    thumbnailUrl: "",
    title: "How CRISPR is changing medicine forever",
    platform: "VIMEO",
    difficulty: "ADVANCED",
    durationSeconds: 2700,
    topics: [{ topic: { name: "Science" } }],
  },
];

const MOCK_GRADIENTS = [
  "linear-gradient(135deg,#1a2744,#2a4a7f)",
  "linear-gradient(135deg,#2b1a0d,#7a4010)",
  "linear-gradient(135deg,#0d2b1a,#1a5c35)",
];

export function HeroSection({
  previewVideos = [],
  videoCount = 0,
  topicCount = 0,
}: {
  previewVideos?: HeroVideo[];
  videoCount?: number;
  topicCount?: number;
}) {
  const displayVideos =
    previewVideos.length >= 3 ? previewVideos.slice(0, 3) : MOCK_VIDEOS;
  const useReal = previewVideos.length >= 3;

  const stats = [
    {
      num: videoCount > 0 ? `${videoCount.toLocaleString()}+` : "120K+",
      label: "Videos Curated",
    },
    {
      num: topicCount > 0 ? String(topicCount) : "48",
      label: "Topic Categories",
    },
    { num: "12", label: "Platforms" },
  ];

  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center px-4 sm:px-8 md:px-12 pt-24 pb-16 relative overflow-hidden gap-10 lg:gap-0">
      {/* Background radial gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 70% 40%, rgba(232,160,32,0.06) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(90,122,92,0.06) 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0 bg-grid" />
      </div>

      {/* Left column */}
      <div className="relative z-10 lg:pr-16">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2.5 bg-amber/[0.12] border border-amber/30 px-3.5 py-1.5 mb-6 md:mb-8">
          <span className="text-amber animate-pulse-dot text-[8px]">◉</span>
          <span className="text-[10px] sm:text-[11px] tracking-[1.5px] sm:tracking-[2px] uppercase text-amber font-medium">
            Knowledge from every corner of the internet
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-display font-black leading-[1.05] tracking-[-1px] mb-5 md:mb-7"
          style={{ fontSize: "clamp(38px, 5.5vw, 80px)" }}
        >
          The world&apos;s
          <br />
          knowledge,
          <br />
          <em className="italic text-amber not-italic" style={{ fontStyle: "italic" }}>
            finally unlocked
          </em>
          <br />
          together.
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base leading-[1.7] text-paper/55 mb-8 md:mb-11 max-w-[420px] font-light">
          Weknoq aggregates the best learning videos from YouTube, TED,
          universities, and more — organized into topics, paths, and curated
          journeys for curious minds.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <Link
            href="/explore"
            className="group relative bg-amber text-ink px-7 sm:px-9 py-3.5 sm:py-4 text-sm font-medium tracking-[0.3px] hover:bg-amber-light transition-all duration-200 overflow-hidden"
          >
            Start Exploring
            <span className="ml-2.5 inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            href="/topics"
            className="bg-transparent text-paper border border-paper/20 px-7 sm:px-9 py-3.5 sm:py-4 text-sm font-normal cursor-pointer transition-all duration-200 hover:border-amber hover:text-amber"
          >
            Browse Topics
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-6 sm:gap-9 mt-10 md:mt-14 pt-7 md:pt-9 border-t border-white/10">
          {stats.map(({ num, label }) => (
            <div key={label}>
              <span className="font-display text-[24px] sm:text-[28px] font-bold text-amber block">
                {num}
              </span>
              <span className="text-[10px] sm:text-[11px] tracking-[1.5px] uppercase text-paper/40 mt-0.5 block">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right column — video preview cards (desktop) */}
      <div className="relative z-10 hidden lg:flex flex-col gap-4">
        {displayVideos.map((v, i) => (
          <Link
            key={v.id}
            href={useReal ? `/video/${v.id}` : "/explore"}
            className={`group relative flex gap-4 items-start p-5 cursor-pointer transition-all duration-300
              border overflow-hidden
              ${i === 0
                ? "border-amber/30 bg-amber/[0.05]"
                : "border-paper/[0.08] bg-paper/[0.04] hover:bg-paper/[0.07]"
              }
              ${ANIM_CLASSES[i]}
              hover:translate-x-1`}
          >
            {/* Left accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
            {i === 0 && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber" />
            )}

            {/* Thumbnail */}
            <div
              className="relative flex-shrink-0 overflow-hidden"
              style={{ width: 88, height: 58 }}
            >
              {useReal && v.thumbnailUrl ? (
                <Image
                  src={v.thumbnailUrl}
                  alt={v.title}
                  fill
                  className="object-cover"
                  sizes="88px"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-xl"
                  style={{ background: MOCK_GRADIENTS[i] }}
                >
                  {["💻", "🧠", "🔬"][i]}
                </div>
              )}
              {/* Play overlay */}
              <div className="absolute inset-0 bg-ink/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div
                  className="w-5 h-5 bg-amber"
                  style={{ clipPath: "polygon(20% 10%, 85% 50%, 20% 90%)" }}
                />
              </div>
            </div>

            {/* Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-1 rounded-full bg-amber flex-shrink-0" />
                <span className="text-[10px] tracking-[1.5px] uppercase text-amber font-medium">
                  {PLATFORM_LABELS[v.platform] ?? v.platform}
                  {v.topics[0]?.topic.name ? ` · ${v.topics[0].topic.name}` : ""}
                </span>
              </div>
              <p className="text-[13px] font-medium text-paper leading-[1.4] mb-1.5 truncate">
                {v.title}
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {i === 0 && (
                  <span className="text-[10px] px-2 py-0.5 tracking-[0.5px] bg-amber/[0.12] text-amber">
                    Featured
                  </span>
                )}
                {v.difficulty && (
                  <span
                    className={`text-[10px] px-2 py-0.5 tracking-[0.5px] ${
                      DIFFICULTY_COLORS[v.difficulty] ?? "bg-paper/[0.07] text-paper/50"
                    }`}
                  >
                    {v.difficulty.charAt(0) + v.difficulty.slice(1).toLowerCase()}
                  </span>
                )}
                {v.durationSeconds && (
                  <span className="text-[10px] px-2 py-0.5 bg-paper/[0.07] text-paper/50">
                    {formatSeconds(v.durationSeconds)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile: scrollable video strip */}
      <div className="lg:hidden flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-8 sm:px-8 snap-x snap-mandatory">
        {displayVideos.map((v, i) => (
          <Link
            key={v.id + "-mobile"}
            href={useReal ? `/video/${v.id}` : "/explore"}
            className={`flex-shrink-0 w-[280px] snap-start flex gap-3 items-start p-4 border ${
              i === 0 ? "border-amber/30 bg-amber/[0.05]" : "border-paper/[0.08] bg-paper/[0.03]"
            }`}
          >
            <div
              className="relative flex-shrink-0 overflow-hidden"
              style={{ width: 72, height: 48 }}
            >
              {useReal && v.thumbnailUrl ? (
                <Image
                  src={v.thumbnailUrl}
                  alt={v.title}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-lg"
                  style={{ background: MOCK_GRADIENTS[i] }}
                >
                  {["💻", "🧠", "🔬"][i]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] tracking-[1px] uppercase text-amber mb-1">
                {PLATFORM_LABELS[v.platform] ?? v.platform}
                {v.topics[0]?.topic.name ? ` · ${v.topics[0].topic.name}` : ""}
              </p>
              <p className="text-[12px] font-medium text-paper leading-[1.35] line-clamp-2">{v.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
