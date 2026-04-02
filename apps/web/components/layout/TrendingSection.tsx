import Link from "next/link";
import { VideoCard } from "@/components/video/VideoCard";
import type { Video, Topic } from "@weknoq/db";

type VideoWithTopics = Video & {
  topics: { topic: Pick<Topic, "name" | "slug"> }[];
};

export function TrendingSection({ videos }: { videos: VideoWithTopics[] }) {
  if (!videos?.length) return null;

  return (
    <section className="px-12 py-24 bg-paper/[0.015]">
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="label mb-3">Popular Now</p>
          <h2
            className="font-display font-bold leading-[1.1]"
            style={{ fontSize: "clamp(30px, 3.5vw, 44px)" }}
          >
            What people are
            <br />
            <em className="italic text-amber">watching today.</em>
          </h2>
        </div>
        <Link
          href="/search"
          className="text-[13px] tracking-[1px] uppercase text-paper/40 border-b border-paper/15 pb-0.5 hover:text-amber hover:border-amber transition-all duration-200 whitespace-nowrap"
        >
          Browse all videos →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </section>
  );
}
