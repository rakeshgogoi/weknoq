import type { Topic } from "@weknoq/db";

export function Marquee({ topics }: { topics: Pick<Topic, "name" | "emoji" | "slug">[] }) {
  if (!topics?.length) return null;

  const items = topics
    .map((t) => `${t.emoji ?? "•"} ${t.name}`)
    .join("   •   ");

  return (
    <div className="px-12 pb-8">
      <div className="border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="py-3 px-6 text-[12px] tracking-[2px] uppercase text-paper/40 whitespace-nowrap">
          {items}
        </div>
      </div>
    </div>
  );
}

