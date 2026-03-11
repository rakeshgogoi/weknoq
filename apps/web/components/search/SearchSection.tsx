import Link from "next/link";

export function SearchSection() {
  return (
    <section className="px-12 py-12">
      <div className="max-w-5xl mx-auto border border-white/10 bg-white/[0.02] p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="label">Search</p>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-semibold">
              Find any topic in seconds
            </h2>
            <p className="mt-3 text-paper/50">
              Search across ingested videos without burning YouTube quota.
            </p>
          </div>
          <Link
            href="/search"
            className="bg-amber text-ink px-6 py-3 text-[13px] font-medium tracking-[1px] uppercase hover:bg-amber-light transition-colors text-center"
          >
            Open search
          </Link>
        </div>
      </div>
    </section>
  );
}

