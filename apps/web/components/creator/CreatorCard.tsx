import Link from "next/link";
import Image from "next/image";

interface CreatorCardProps {
  creator: {
    id: string;
    channelId: string;
    channelName: string;
    country: string | null;
    subscriberCount: number | null;
    thumbnailUrl: string | null;
    description: string | null;
    totalViewCount: bigint | null;
    _count?: { videos: number };
  };
}

function formatCount(n: number | bigint | null): string {
  if (n === null || n === undefined) return "—";
  const num = typeof n === "bigint" ? Number(n) : n;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return String(num);
}

// Returns a flag emoji from a 2-letter ISO country code
function countryFlag(code: string): string {
  const codePoints = [...code.toUpperCase()].map(
    (c) => 127397 + c.charCodeAt(0)
  );
  return String.fromCodePoint(...codePoints);
}

export function CreatorCard({ creator }: CreatorCardProps) {
  const videoCount = creator._count?.videos ?? 0;

  return (
    <Link
      href={`/creators/${creator.channelId}`}
      className="group flex flex-col items-center text-center p-6 border border-white/10 hover:border-amber/30 transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full overflow-hidden bg-white/10 mb-4 flex-shrink-0 ring-2 ring-white/10 group-hover:ring-amber/30 transition-all">
        {creator.thumbnailUrl ? (
          <Image
            src={creator.thumbnailUrl}
            alt={creator.channelName}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-paper/30">
            {creator.channelName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="font-display font-semibold text-[15px] text-paper group-hover:text-amber transition-colors leading-tight mb-1 line-clamp-2">
        {creator.channelName}
      </h3>

      {/* Country */}
      {creator.country && (
        <p className="text-[12px] text-paper/40 mb-3">
          {countryFlag(creator.country)} {creator.country}
        </p>
      )}

      {/* Stats */}
      <div className="flex gap-4 text-[11px] tracking-[1px] uppercase text-paper/30 mt-auto">
        <span>{formatCount(creator.subscriberCount)} subs</span>
        {videoCount > 0 && <span>{videoCount} videos</span>}
      </div>
    </Link>
  );
}
