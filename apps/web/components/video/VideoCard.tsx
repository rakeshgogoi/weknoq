import Link from "next/link";
import Image from "next/image";
import { formatDuration } from "@/lib/youtube";
import type { Video, Topic } from "@weknoq/db";

interface VideoWithTopics extends Video {
  topics: { topic: Pick<Topic, "name" | "slug"> }[];
}

interface VideoCardProps {
  video: VideoWithTopics;
  size?: "sm" | "md" | "lg";
}

const DIFFICULTY_STYLES = {
  BEGINNER:     "text-sage",
  INTERMEDIATE: "text-amber",
  ADVANCED:     "text-rust",
};

export function VideoCard({ video, size = "md" }: VideoCardProps) {
  const duration = video.durationSeconds
    ? formatDuration(video.durationSeconds)
    : null;

  return (
    <Link
      href={`/videos/${video.slug ?? video.platformId}`}
      className="group flex flex-col bg-white/[0.03] border border-white/[0.07] overflow-hidden hover:border-amber/30 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-slate to-ink">
            📺
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-ink/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-amber rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform">
            <span className="text-ink text-lg ml-1">▶</span>
          </div>
        </div>

        {/* Duration badge */}
        {duration && (
          <div className="absolute bottom-2 right-2 bg-ink/80 text-paper/80 text-[11px] font-mono px-2 py-0.5">
            {duration}
          </div>
        )}

        {/* Platform badge */}
        <div className="absolute top-2 left-2 bg-ink/70 text-amber text-[9px] tracking-[1.5px] uppercase px-2 py-1">
          {video.platform.replace("_", " ")}
        </div>
      </div>

      {/* Info */}
      <div className={`p-4 flex flex-col gap-1.5 ${size === "lg" ? "p-6" : ""}`}>
        <p className="text-[11px] tracking-[1px] uppercase text-paper/40">
          {video.channelName}
        </p>

        <h3
          className={`font-display font-semibold leading-snug line-clamp-2 ${
            size === "lg" ? "text-xl" : "text-[15px]"
          }`}
        >
          {video.title}
        </h3>

        {video.aiSummary && size !== "sm" && (
          <p className="text-[13px] text-paper/40 leading-relaxed line-clamp-2">
            {video.aiSummary}
          </p>
        )}

        <div className="flex items-center gap-3 mt-1">
          {video.difficulty && (
            <span
              className={`text-[10px] tracking-[1px] uppercase font-medium ${
                DIFFICULTY_STYLES[video.difficulty]
              }`}
            >
              {video.difficulty.toLowerCase()}
            </span>
          )}
          {video.topics.slice(0, 2).map(({ topic }) => (
            <span
              key={topic.slug}
              className="text-[10px] text-paper/30 bg-white/5 px-2 py-0.5"
            >
              {topic.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
