import { HeroSection } from "@/components/layout/HeroSection";
import { TopicsGrid } from "@/components/layout/TopicsGrid";
import { FeaturedVideos } from "@/components/video/FeaturedVideos";
import { LearningPaths } from "@/components/layout/LearningPaths";
import { HowItWorks } from "@/components/layout/HowItWorks";
import { FeaturesStrip } from "@/components/layout/FeaturesStrip";
import { CTASection } from "@/components/layout/CTASection";
import { SearchSection } from "@/components/search/SearchSection";
import { Marquee } from "@/components/layout/Marquee";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 600;

async function getHomeData() {
  try {
    const { prisma } = await import("@weknoq/db");
    const [topics, featuredVideos, featuredPaths] = await Promise.all([
      prisma.topic.findMany({
        orderBy: { videoCount: "desc" },
        take: 8,
      }),
      prisma.video.findMany({
        where: { isFeatured: true, isActive: true },
        take: 5,
        include: {
          topics: { select: { topic: { select: { name: true, slug: true } } } },
        },
        orderBy: { viewCount: "desc" },
      }),
      prisma.learningPath.findMany({
        where: { isFeatured: true },
        take: 6,
        include: { topic: { select: { name: true, emoji: true } } },
      }),
    ]);
    return { topics, featuredVideos, featuredPaths };
  } catch {
    return { topics: [], featuredVideos: [], featuredPaths: [] };
  }
}

export default async function HomePage() {
  const { topics, featuredVideos, featuredPaths } = await getHomeData();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <Marquee topics={topics} />
        <SearchSection />
        <TopicsGrid topics={topics} />
        <FeaturedVideos videos={featuredVideos} />
        <HowItWorks />
        <LearningPaths paths={featuredPaths} />
        <FeaturesStrip />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
