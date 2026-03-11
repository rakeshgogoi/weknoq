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
          className={`px-5 sm:px-7 md:px-9 py-8 md:py-10 ${
            i % 2 === 0 ? "border-r border-paper/[0.06]" : ""
          } md:border-r md:last:border-r-0 border-paper/[0.06] ${
            i < 2 ? "border-b md:border-b-0 border-paper/[0.06]" : ""
          }`}
        >
          <div className="text-[24px] md:text-[28px] mb-3">{f.icon}</div>
          <p className="text-[14px] md:text-[15px] font-medium mb-2">{f.name}</p>
          <p className="text-[12px] md:text-[13px] text-paper/40 leading-[1.6]">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
