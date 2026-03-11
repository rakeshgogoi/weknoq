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
          className={`px-9 py-10 ${i < FEATURES.length - 1 ? "border-r border-paper/[0.06]" : ""}`}
        >
          <div className="text-[28px] mb-3.5">{f.icon}</div>
          <p className="text-[15px] font-medium mb-2">{f.name}</p>
          <p className="text-[13px] text-paper/40 leading-[1.6]">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
