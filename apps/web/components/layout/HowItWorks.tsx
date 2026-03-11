const STEPS = [
  {
    num: "01",
    icon: "🔍",
    title: "Search or Browse",
    desc: "Type any subject or browse our curated topic map. Weknoq searches across 12+ platforms simultaneously — YouTube, TED, Vimeo, MIT OCW, and more.",
  },
  {
    num: "02",
    icon: "🤖",
    title: "AI Curates for You",
    desc: "Our AI engine tags videos by topic, difficulty, duration, and language. It builds structured learning paths — not just a pile of links.",
  },
  {
    num: "03",
    icon: "▶️",
    title: "Watch & Progress",
    desc: "Watch embedded videos without leaving Weknoq. Track progress, bookmark favourites, and follow structured paths to mastery.",
  },
];

export function HowItWorks() {
  return (
    <section className="px-4 sm:px-8 md:px-12 py-16 md:py-24 bg-paper/[0.015]">
      <div className="flex items-end justify-between mb-10 md:mb-14">
        <div>
          <p className="label mb-3">How It Works</p>
          <h2
            className="font-display font-bold leading-[1.1]"
            style={{ fontSize: "clamp(30px, 3.5vw, 44px)" }}
          >
            One place for all
            <br />
            <em className="italic text-amber">your learning.</em>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="group relative pl-7 border-l border-paper/[0.08] transition-all duration-300 hover:border-amber"
          >
            <div className="font-display text-[60px] font-black text-amber/[0.12] leading-none mb-5 tracking-[-2px]">
              {step.num}
            </div>
            <div className="text-[28px] mb-4">{step.icon}</div>
            <h3 className="font-display text-xl font-semibold mb-3">
              {step.title}
            </h3>
            <p className="text-sm leading-[1.7] text-paper/50">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
