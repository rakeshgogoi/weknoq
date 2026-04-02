"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { VideoThumbnailPlaceholder } from "@/components/video/VideoThumbnailPlaceholder";
import type { Video, Topic } from "@weknoq/db";

type VideoWithTopics = Video & {
  topics: { topic: Pick<Topic, "name" | "slug"> }[];
};

const DIFFICULTY_STYLES = {
  BEGINNER:     "text-sage",
  INTERMEDIATE: "text-amber",
  ADVANCED:     "text-rust",
};

const PLATFORM_LABELS: Record<string, string> = {
  YOUTUBE:      "YouTube",
  VIMEO:        "Vimeo",
  TED:          "TED",
  MIT_OCW:      "MIT OpenCourseWare",
  KHAN_ACADEMY: "Khan Academy",
  COURSERA:     "Coursera",
  EDX:          "edX",
  OTHER:        "Video",
};

function formatSeconds(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function FeatCard({
  video,
  large = false,
}: {
  video: VideoWithTopics;
  large?: boolean;
}) {
  const [thumbError, setThumbError] = useState(false);

  if (thumbError) return null;

  const duration = video.durationSeconds ? formatSeconds(video.durationSeconds) : null;
  const platform = PLATFORM_LABELS[video.platform] ?? video.platform;
  const topic = video.topics[0]?.topic;

  return (
    <Link
      href={`/video/${video.id}`}
      className={`group bg-paper/[0.04] border border-paper/[0.07] overflow-hidden cursor-pointer transition-all duration-300 hover:border-amber/30 relative flex flex-col ${
        large ? "row-span-2" : ""
      }`}
    >
      {/* Thumbnail */}
      <div
        className={`relative w-full overflow-hidden bg-slate ${
          large ? "flex-1" : "aspect-video"
        }`}
        style={large ? { aspectRatio: "4/3" } : {}}
      >
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setThumbError(true)}
          />
        ) : (
          <VideoThumbnailPlaceholder />
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 bg-ink/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className={`bg-amber rounded-full flex items-center justify-center transition-transform duration-300 scale-75 group-hover:scale-100 ${
              large ? "w-14 h-14 text-lg" : "w-10 h-10 text-sm"
            }`}
          >
            ▶
          </div>
        </div>
      </div>

      {/* Info */}
      <div className={large ? "p-7" : "p-[18px]"}>
        {topic && (
          <div className="flex items-center gap-1.5 mb-2 text-[10px] tracking-[2px] uppercase text-amber">
            <span>◉</span>
            <span>{platform}{topic ? ` · ${topic.name}` : ""}</span>
          </div>
        )}
        <h3
          className={`font-display font-semibold leading-[1.3] mb-2.5 ${
            large ? "text-[22px]" : "text-base"
          }`}
        >
          {video.title}
        </h3>
        {large && video.channelName && (
          <p className="text-xs text-paper/45 mb-3">{video.channelName}</p>
        )}
        <div className="flex items-center gap-3.5">
          {duration && (
            <span className="font-mono text-[11px] text-paper/30 bg-paper/[0.06] px-2 py-0.5">
              {duration}
            </span>
          )}
          {video.difficulty && (
            <span
              className={`text-[10px] tracking-[1px] uppercase ${
                DIFFICULTY_STYLES[video.difficulty]
              }`}
            >
              {video.difficulty.charAt(0) + video.difficulty.slice(1).toLowerCase()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function FeaturedVideos({ videos }: { videos: VideoWithTopics[] }) {
  if (!videos?.length) return null;

  const [large, ...rest] = videos;
  const remaining = rest.slice(0, 4);

  return (
    <section className="px-12 py-24">
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="label mb-3">Editor&apos;s Picks</p>
          <h2
            className="font-display font-bold leading-[1.1]"
            style={{ fontSize: "clamp(30px, 3.5vw, 44px)" }}
          >
            Curated for
            <br />
            <em className="italic text-amber">curious minds.</em>
          </h2>
        </div>
        <Link
          href="/search"
          className="text-[13px] tracking-[1px] uppercase text-paper/40 border-b border-paper/15 pb-0.5 hover:text-amber hover:border-amber transition-all duration-200 whitespace-nowrap"
        >
          All featured videos →
        </Link>
      </div>

      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: "2fr 1fr 1fr",
          gridTemplateRows: "auto auto",
        }}
      >
        <FeatCard video={large} large />
        {remaining.map((v) => (
          <FeatCard key={v.id} video={v} />
        ))}
      </div>
    </section>
  );
}
