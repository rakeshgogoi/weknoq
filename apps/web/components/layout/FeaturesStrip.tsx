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
    <div className="mx-4 sm:mx-8 md:mx-12 border-t border-b border-paper/[0.06] grid grid-cols-2 md:grid-cols-4">
      {FEATURES.map((f, i) => (
        <div
          key={f.name}
          className={`group px-5 sm:px-7 md:px-9 py-8 md:py-10 transition-all duration-300 hover:bg-paper/[0.03] relative overflow-hidden ${
            i % 2 === 0 ? "border-r border-paper/[0.06]" : ""
          } md:border-r md:last:border-r-0 border-paper/[0.06] ${
            i < 2 ? "border-b md:border-b-0 border-paper/[0.06]" : ""
          }`}
        >
          {/* Bottom accent line on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

          <div className="text-[24px] md:text-[28px] mb-3 transition-transform duration-300 group-hover:scale-110 inline-block">
            {f.icon}
          </div>
          <p className="text-[14px] md:text-[15px] font-medium mb-2 group-hover:text-amber transition-colors duration-300">
            {f.name}
          </p>
          <p className="text-[12px] md:text-[13px] text-paper/40 leading-[1.6]">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
