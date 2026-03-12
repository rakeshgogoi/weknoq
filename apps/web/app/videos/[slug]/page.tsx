import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@weknoq/db";
import { formatDuration } from "@/lib/youtube";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getVideo(slug: string) {
  return prisma.video.findFirst({
    where: {
      OR: [
        { slug },
        { platformId: slug }, // fallback for old links
      ],
      isActive: true,
    },
    include: {
      topics: { include: { topic: { select: { name: true, slug: true } } } },
      tags:   { include: { tag: { select: { name: true } } } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideo(slug);
  if (!video) return {};

  const topics = video.topics.map((vt) => vt.topic.name);
  const keywordSuffix = topics.length ? ` — ${topics.slice(0, 3).join(", ")}` : "";
  const title = `${video.title}${keywordSuffix}`;
  const description =
    video.aiSummary ??
    video.description?.slice(0, 160) ??
    `Watch "${video.title}" on Weknoq — curated educational videos.`;

  return {
    title,
    description,
    keywords: [
      ...topics,
      video.channelName ?? "",
      video.difficulty?.toLowerCase() ?? "",
      "educational video",
      "learn",
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      type: "video.other",
      url: `https://weknoq.com/videos/${video.slug ?? video.platformId}`,
      images: video.thumbnailUrl
        ? [{ url: video.thumbnailUrl, width: 1280, height: 720, alt: video.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: video.thumbnailUrl ? [video.thumbnailUrl] : [],
    },
  };
}

export default async function VideoPage({ params }: Props) {
  const { slug } = await params;
  const video = await getVideo(slug);
  if (!video) notFound();

  const topics = video.topics.map((vt) => vt.topic);
  const duration = video.durationSeconds ? formatDuration(video.durationSeconds) : null;
  const publishedAt = video.publishedAt?.toISOString();

  // Schema.org VideoObject structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description:
      video.aiSummary ?? video.description ?? video.title,
    thumbnailUrl: video.thumbnailUrl ? [video.thumbnailUrl] : undefined,
    uploadDate: publishedAt,
    duration: video.durationSeconds
      ? `PT${Math.floor(video.durationSeconds / 60)}M${video.durationSeconds % 60}S`
      : undefined,
    contentUrl: video.sourceUrl,
    embedUrl: video.embedUrl ?? undefined,
    author: video.channelName
      ? { "@type": "Person", name: video.channelName }
      : undefined,
    interactionStatistic: video.viewCount
      ? {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/WatchAction",
          userInteractionCount: video.viewCount.toString(),
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-[11px] tracking-[1.5px] uppercase text-paper/30 mb-8 flex gap-2">
          {topics[0] && (
            <>
              <a href={`/topics/${topics[0].slug}`} className="hover:text-amber transition-colors">
                {topics[0].name}
              </a>
              <span>/</span>
            </>
          )}
          <span className="text-paper/50 truncate max-w-xs">{video.title}</span>
        </nav>

        {/* Video embed */}
        {video.embedUrl && (
          <div className="relative w-full aspect-video bg-slate mb-8 overflow-hidden">
            <iframe
              src={video.embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 items-center mb-4 text-[11px] tracking-[1.5px] uppercase">
          {video.platform && (
            <span className="text-amber border border-amber/30 px-2 py-0.5">
              {video.platform.replace("_", " ")}
            </span>
          )}
          {video.difficulty && (
            <span className="text-paper/40">{video.difficulty.toLowerCase()}</span>
          )}
          {duration && (
            <span className="font-mono text-paper/30">{duration}</span>
          )}
          {topics.map((t) => (
            <a
              key={t.slug}
              href={`/topics/${t.slug}`}
              className="text-paper/30 hover:text-amber transition-colors"
            >
              {t.name}
            </a>
          ))}
        </div>

        {/* H1 — primary keyword target */}
        <h1 className="font-display font-bold text-3xl md:text-4xl leading-tight mb-3">
          {video.title}
        </h1>

        {/* Channel / author */}
        {video.channelName && (
          <p className="text-sm text-paper/40 mb-6">
            by <span className="text-paper/60">{video.channelName}</span>
          </p>
        )}

        {/* AI summary */}
        {video.aiSummary && (
          <div className="border-l-2 border-amber/40 pl-5 mb-8">
            <p className="text-[11px] tracking-[2px] uppercase text-amber/60 mb-1">
              What you&apos;ll learn
            </p>
            <p className="text-paper/70 leading-relaxed">{video.aiSummary}</p>
          </div>
        )}

        {/* Full description */}
        {video.description && (
          <div className="text-paper/50 text-sm leading-relaxed whitespace-pre-line max-w-3xl">
            {video.description}
          </div>
        )}
      </main>
    </>
  );
}
