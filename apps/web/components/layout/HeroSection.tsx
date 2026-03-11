import Link from "next/link";

export function HeroSection() {
  return (
    <section className="pt-28 pb-16 px-12">
      <div className="max-w-5xl mx-auto">
        <p className="label text-paper/60">Curated learning, not endless feeds</p>
        <h1 className="mt-4 font-display text-5xl md:text-6xl font-bold leading-[1.05]">
          Learn the <span className="italic text-amber">best</span> videos,
          organized into topics and paths.
        </h1>
        <p className="mt-6 text-paper/50 text-lg max-w-2xl leading-relaxed">
          Weknoq pulls high-signal educational videos and loops them into a
          searchable library with progress tracking.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/search"
            className="bg-amber text-ink px-6 py-3 text-[13px] font-medium tracking-[1px] uppercase hover:bg-amber-light transition-colors text-center"
          >
            Explore now
          </Link>
          <Link
            href="/api/auth/signin"
            className="border border-white/15 text-paper/70 px-6 py-3 text-[13px] font-medium tracking-[1px] uppercase hover:border-amber/40 hover:text-amber transition-colors text-center"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}

