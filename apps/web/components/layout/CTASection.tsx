import Link from "next/link";

export function CTASection() {
  return (
    <section className="text-center px-4 sm:px-8 md:px-12 py-20 md:py-[120px] relative overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(232,160,32,0.07) 0%, transparent 70%)",
        }}
      />

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
