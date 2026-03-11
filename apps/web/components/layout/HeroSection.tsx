import Link from "next/link";

const HERO_VIDEOS = [
  {
    gradient: "linear-gradient(135deg,#1a2744,#2a4a7f)",
    emoji: "💻",
    source: "YouTube · freeCodeCamp",
    title: "Learn Python - Full Course for Beginners",
    href: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    tags: [
      { label: "Featured", amber: true },
      { label: "Beginner", amber: false },
      { label: "4h 22m", amber: false },
    ],
    featured: true,
    animClass: "animate-fade-slide-1",
  },
  {
    gradient: "linear-gradient(135deg,#2b1a0d,#7a4010)",
    emoji: "🎙️",
    source: "YouTube · TED",
    title: "How great leaders inspire action — Simon Sinek",
    href: "https://www.youtube.com/watch?v=qp0HIF3SfI4",
    tags: [
      { label: "Beginner", amber: false },
      { label: "18m", amber: false },
    ],
    featured: false,
    animClass: "animate-fade-slide-2",
  },
  {
    gradient: "linear-gradient(135deg,#0d0d2b,#1a1a7a)",
    emoji: "∑",
    source: "YouTube · 3Blue1Brown",
    title: "The Essence of Calculus, Chapter 1",
    href: "https://www.youtube.com/watch?v=WUvTyaaNkzM",
    tags: [
      { label: "Intermediate", amber: false },
      { label: "17m", amber: false },
    ],
    featured: false,
    animClass: "animate-fade-slide-3",
  },
];

export function HeroSection() {
  return (
    <section className="min-h-screen grid grid-cols-2 items-center px-12 pt-24 pb-16 relative overflow-hidden">
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
      <div className="relative z-10 pr-16">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2.5 bg-amber/[0.12] border border-amber/30 px-3.5 py-1.5 mb-8">
          <span className="text-amber animate-pulse-dot text-[8px]">◉</span>
          <span className="text-[11px] tracking-[2px] uppercase text-amber font-medium">
            Knowledge from every corner of the internet
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-display font-black leading-[1.05] tracking-[-1px] mb-7"
          style={{ fontSize: "clamp(48px, 5.5vw, 80px)" }}
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
        <p className="text-base leading-[1.7] text-paper/55 mb-11 max-w-[420px] font-light">
          Weknoq aggregates the best learning videos from YouTube, TED,
          universities, and more — organized into topics, paths, and curated
          journeys for curious minds.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href="/explore"
            className="group relative bg-amber text-ink px-9 py-4 text-sm font-medium tracking-[0.3px] hover:bg-amber-light transition-all duration-200 overflow-hidden"
          >
            Start Exploring
            <span className="ml-2.5 inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            href="/topics"
            className="bg-transparent text-paper border border-paper/20 px-9 py-4 text-sm font-normal cursor-pointer transition-all duration-200 hover:border-amber hover:text-amber"
          >
            Browse Topics
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-9 mt-14 pt-9 border-t border-white/10">
          {[
            { num: "120K+", label: "Videos Curated" },
            { num: "48",    label: "Topic Categories" },
            { num: "12",    label: "Platforms" },
          ].map(({ num, label }) => (
            <div key={label}>
              <span className="font-display text-[28px] font-bold text-amber block">
                {num}
              </span>
              <span className="text-[11px] tracking-[1.5px] uppercase text-paper/40 mt-0.5 block">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right column — video preview cards */}
      <div className="relative z-10 flex flex-col gap-4">
        {HERO_VIDEOS.map((v) => (
          <a
            key={v.title}
            href={(v as any).href ?? "/explore"}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative flex gap-4 items-start p-5 cursor-pointer transition-all duration-300
              border overflow-hidden
              ${v.featured
                ? "border-amber/30 bg-amber/[0.05]"
                : "border-paper/[0.08] bg-paper/[0.04] hover:bg-paper/[0.07]"
              }
              ${v.animClass}
              hover:translate-x-1`}
          >
            {/* Left accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
            {v.featured && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber" />
            )}

            {/* Thumbnail */}
            <div className="relative w-22 h-14 flex-shrink-0 overflow-hidden" style={{ width: 88, height: 58 }}>
              <div
                className="w-full h-full flex items-center justify-center text-xl"
                style={{ background: v.gradient }}
              >
                {v.emoji}
              </div>
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
                  {v.source}
                </span>
              </div>
              <p className="text-[13px] font-medium text-paper leading-[1.4] mb-1.5 truncate">
                {v.title}
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {v.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`text-[10px] px-2 py-0.5 tracking-[0.5px] ${
                      tag.amber
                        ? "bg-amber/[0.12] text-amber"
                        : "bg-paper/[0.07] text-paper/50"
                    }`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
