import type { Topic } from "@weknoq/db";

const FALLBACK_ITEMS = [
  "Programming", "Science", "Philosophy", "Finance", "Music & Arts",
  "Language Learning", "History", "Medicine", "Mathematics",
  "Engineering", "Psychology", "Astronomy",
];

export function Marquee({ topics }: { topics: Pick<Topic, "name" | "emoji" | "slug">[] }) {
  const items = topics?.length
    ? topics.map((t) => t.name)
    : FALLBACK_ITEMS;

  // Duplicate for seamless loop
  const allItems = [...items, ...items];

  return (
    <div className="overflow-hidden border-t border-paper/[0.06] border-b bg-paper/[0.02] py-3.5">
      <div className="flex gap-[60px] animate-marquee w-max">
        {allItems.map((name, i) => (
          <div
            key={i}
            className="flex items-center gap-5 text-[12px] tracking-[2px] uppercase text-paper/30 whitespace-nowrap"
          >
            {name}
            <span className="text-amber text-[8px]">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
