import Link from "next/link";

export function CTASection({
  videoCount = 0,
  topicCount = 0,
}: {
  videoCount?: number;
  topicCount?: number;
}) {
  const stats = [
    { num: videoCount > 0 ? `${videoCount.toLocaleString()}+` : "120K+", label: "Videos" },
    { num: topicCount > 0 ? `${topicCount}+` : "48+", label: "Topics" },
    { num: "100%", label: "Free to browse" },
  ];

  return (
    <section className="text-center px-12 py-[120px] relative overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(232,160,32,0.08) 0%, transparent 65%)",
        }}
      />

      {/* Stats row */}
      <div className="flex items-center justify-center gap-12 mb-16 relative">
        {stats.map(({ num, label }, i) => (
          <div key={label} className="flex items-center gap-12">
            <div className="text-center">
              <span className="font-display text-[36px] font-black text-amber block leading-none">
                {num}
              </span>
              <span className="text-[11px] tracking-[2px] uppercase text-paper/35 mt-1.5 block">
                {label}
              </span>
            </div>
            {i < stats.length - 1 && (
              <div className="w-px h-10 bg-paper/10" />
            )}
          </div>
        ))}
      </div>

      <h2
        className="font-display font-black leading-[1.1] mb-5 relative"
        style={{ fontSize: "clamp(36px, 5vw, 60px)" }}
      >
        The world is your
        <br />
        <em className="italic text-amber">classroom.</em>
      </h2>

      <p className="text-[15px] text-paper/45 mb-11 max-w-[460px] mx-auto leading-[1.7] relative">
        Stop getting lost in endless YouTube rabbit holes. Weknoq turns the
        internet&apos;s best educational videos into your personal university.
      </p>

      <Link
        href="/explore"
        className="group relative inline-block bg-amber text-ink font-medium tracking-[0.3px] hover:bg-amber-light transition-all duration-200"
        style={{ fontSize: 15, padding: "18px 48px" }}
      >
        Start Learning{" "}
        <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </Link>
    </section>
  );
}
