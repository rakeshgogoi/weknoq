const FEATURES = [
  {
    icon: "⚡",
    name: "AI-Powered Tagging",
    desc: "Every video is automatically classified by topic, difficulty, and language using machine learning.",
  },
  {
    icon: "🔗",
    name: "Multi-Platform",
    desc: "Aggregated from YouTube, TED, Vimeo, university sites, and 8 more sources in one place.",
  },
  {
    icon: "🗺️",
    name: "Knowledge Maps",
    desc: "See how topics connect. Navigate from beginner to advanced through guided learning journeys.",
  },
  {
    icon: "📖",
    name: "AI Summaries",
    desc: "Get a quick \"what you'll learn\" breakdown before committing to any video or course.",
  },
];

export function FeaturesStrip() {
  return (
    <div
      className="grid mx-12 border-t border-b border-paper/[0.06]"
      style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
    >
      {FEATURES.map((f, i) => (
        <div
          key={f.name}
          className={`group px-9 py-10 transition-all duration-300 hover:bg-paper/[0.03] relative overflow-hidden ${
            i < FEATURES.length - 1 ? "border-r border-paper/[0.06]" : ""
          }`}
        >
          {/* Bottom accent line on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />

          <div className="text-[28px] mb-3.5 transition-transform duration-300 group-hover:scale-110 inline-block">
            {f.icon}
          </div>
          <p className="text-[15px] font-medium mb-2 group-hover:text-amber transition-colors duration-300">
            {f.name}
          </p>
          <p className="text-[13px] text-paper/40 leading-[1.6]">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
