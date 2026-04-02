import { HeroSection } from "@/components/layout/HeroSection";
import { TopicsGrid } from "@/components/layout/TopicsGrid";
import { FeaturedVideos } from "@/components/video/FeaturedVideos";
import { TrendingSection } from "@/components/layout/TrendingSection";
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
    const [topics, featuredVideos, featuredPaths, trendingVideos, videoCount] =
      await Promise.all([
        prisma.topic.findMany({
          orderBy: { videoCount: "desc" },
          take: 8,
        }),
        prisma.video.findMany({
          where: { isFeatured: true, isActive: true, thumbnailUrl: { not: null } },
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
        prisma.video.findMany({
          where: { isActive: true, thumbnailUrl: { not: null } },
          take: 6,
          include: {
            topics: { select: { topic: { select: { name: true, slug: true } } } },
          },
          orderBy: { viewCount: "desc" },
        }),
        prisma.video.count({ where: { isActive: true } }),
      ]);
    return { topics, featuredVideos, featuredPaths, trendingVideos, videoCount };
  } catch {
    return { topics: [], featuredVideos: [], featuredPaths: [], trendingVideos: [], videoCount: 0 };
  }
}

export default async function HomePage() {
  const { topics, featuredVideos, featuredPaths, trendingVideos, videoCount } =
    await getHomeData();

  return (
    <>
      <Navbar />
      <main>
        <HeroSection
          previewVideos={featuredVideos.slice(0, 3).map((v) => ({
            id: v.id,
            thumbnailUrl: v.thumbnailUrl!,
            title: v.title,
            platform: v.platform,
            difficulty: v.difficulty,
            durationSeconds: v.durationSeconds,
            topics: v.topics,
          }))}
          videoCount={videoCount}
          topicCount={topics.length}
        />
        <Marquee topics={topics} />
        <SearchSection />
        <FeaturedVideos videos={featuredVideos} />
        <TrendingSection videos={trendingVideos} />
        <TopicsGrid topics={topics} />
        <HowItWorks />
        <LearningPaths paths={featuredPaths} />
        <FeaturesStrip />
        <CTASection videoCount={videoCount} topicCount={topics.length} />
      </main>
      <Footer />
    </>
  );
}
