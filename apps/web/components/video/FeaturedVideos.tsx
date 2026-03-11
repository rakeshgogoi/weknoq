import Link from "next/link";
import type { Video, Topic } from "@weknoq/db";
import { VideoCard } from "@/components/video/VideoCard";

type VideoWithTopics = Video & {
  topics: { topic: Pick<Topic, "name" | "slug"> }[];
};

export function FeaturedVideos({ videos }: { videos: VideoWithTopics[] }) {
  if (!videos?.length) return null;

  return (
    <section className="px-12 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="label">Featured</p>
            <h2 className="mt-3 font-display text-3xl font-semibold">
              High-signal picks
            </h2>
          </div>
          <Link
            href="/search"
            className="text-sm text-paper/50 hover:text-amber transition-colors"
          >
            Search everything
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </div>
    </section>
  );
}

