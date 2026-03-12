import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@weknoq/db";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CreatorCard } from "@/components/creator/CreatorCard";
import { VideoCard } from "@/components/video/VideoCard";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Top Educational Creators | Weknoq",
  description:
    "Discover the world's top educational YouTube creators — filtered by country, ranked by subscribers and views.",
  openGraph: {
    title: "Top Educational Creators | Weknoq",
    description:
      "Discover the world's top educational YouTube creators — filtered by country.",
  },
};

interface Props {
  searchParams: Promise<{ country?: string }>;
}

async function getCreators(country?: string) {
  return prisma.creator.findMany({
    where: {
      isActive: true,
      ...(country ? { country } : {}),
    },
    orderBy: [{ subscriberCount: "desc" }, { channelName: "asc" }],
    include: { _count: { select: { videos: true } } },
  });
}

async function getCountries() {
  const rows = await prisma.creator.findMany({
    where: { isActive: true, country: { not: null } },
    select: { country: true },
    distinct: ["country"],
    orderBy: { country: "asc" },
  });
  return rows.map((r) => r.country!).filter(Boolean);
}

async function getTopVideos() {
  return prisma.video.findMany({
    where: { isActive: true },
    orderBy: { viewCount: "desc" },
    take: 8,
    include: {
      topics: { select: { topic: { select: { name: true, slug: true } } } },
    },
  });
}

// Returns a flag emoji from a 2-letter ISO country code
function countryFlag(code: string): string {
  const codePoints = [...code.toUpperCase()].map(
    (c) => 127397 + c.charCodeAt(0)
  );
  return String.fromCodePoint(...codePoints);
}

export default async function CreatorsPage({ searchParams }: Props) {
  const { country } = await searchParams;

  const [creators, countries, topVideos] = await Promise.all([
    getCreators(country),
    getCountries(),
    getTopVideos(),
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24">
        {/* Header */}
        <div className="px-4 sm:px-8 md:px-12 pt-4 mb-14">
          <p className="label mb-3">Creators</p>
          <div className="flex items-end justify-between">
            <h1
              className="font-display font-bold leading-[1.05]"
              style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
            >
              The channels
              <br />
              <em className="text-amber italic">behind the knowledge.</em>
            </h1>
          </div>
          <p className="mt-5 text-[15px] text-paper/45 leading-relaxed max-w-2xl">
            Weknoq aggregates content from these exceptional educational channels.
            All views, watch time, and revenue go to the original creators.
          </p>
        </div>

        {/* Country filter chips */}
        {countries.length > 0 && (
          <div className="px-4 sm:px-8 md:px-12 flex flex-wrap gap-2 mb-10">
            <a
              href="/creators"
              className={`px-4 h-8 flex items-center text-[12px] tracking-[1px] uppercase transition-colors ${
                !country
                  ? "bg-amber text-ink"
                  : "border border-white/15 text-paper/50 hover:border-amber/40 hover:text-amber"
              }`}
            >
              All
            </a>
            {countries.map((c) => (
              <a
                key={c}
                href={`/creators?country=${c}`}
                className={`px-4 h-8 flex items-center gap-1.5 text-[12px] tracking-[1px] uppercase transition-colors ${
                  country === c
                    ? "bg-amber text-ink"
                    : "border border-white/15 text-paper/50 hover:border-amber/40 hover:text-amber"
                }`}
              >
                <span>{countryFlag(c)}</span>
                <span>{c}</span>
              </a>
            ))}
          </div>
        )}

        {/* Creator grid */}
        {creators.length === 0 ? (
          <div className="px-4 sm:px-8 md:px-12 text-center py-24 text-paper/30">
            <p className="font-display text-2xl mb-2">No creators yet</p>
            <p className="text-sm">
              Creators are added automatically when videos are ingested.
            </p>
          </div>
        ) : (
          <div className="px-4 sm:px-8 md:px-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-20">
            {creators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        )}

        {/* Top Videos section */}
        {topVideos.length > 0 && (
          <section className="px-4 sm:px-8 md:px-12 mb-16">
            <div className="border-t border-white/10 pt-14 mb-10">
              <p className="label mb-3">Most Watched</p>
              <h2 className="font-display text-3xl font-bold">Top Videos</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {topVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Are you a creator? */}
        <div className="px-4 sm:px-8 md:px-12">
          <div className="bg-amber/[0.04] border border-amber/15 p-7 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl font-bold mb-2">
                Are you an educational creator?
              </h2>
              <p className="text-[14px] text-paper/45 max-w-lg">
                If your content is featured on Weknoq and you&apos;d like it removed,
                want to update your profile, or have questions — reach out.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto flex-shrink-0">
              <Link
                href="/submit"
                className="bg-amber text-ink px-7 py-3 text-sm font-medium hover:bg-amber-light transition-colors text-center"
              >
                Submit Your Videos
              </Link>
              <Link
                href="/takedown"
                className="border border-paper/20 text-paper/60 px-7 py-3 text-sm hover:border-amber hover:text-amber transition-colors text-center"
              >
                Request Takedown
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
