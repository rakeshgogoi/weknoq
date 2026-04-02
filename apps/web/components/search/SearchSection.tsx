"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const SUGGESTIONS = [
  { emoji: "🐍", label: "Learn Python" },
  { emoji: "🌌", label: "Astrophysics" },
  { emoji: "🎸", label: "Music Theory" },
  { emoji: "💰", label: "Personal Finance" },
  { emoji: "🧘", label: "Stoicism" },
  { emoji: "🇯🇵", label: "Japanese" },
  { emoji: "🧬", label: "Genetics" },
];

const PLACEHOLDERS = [
  "Search any topic — Python, Black Holes, Stoicism…",
  "Try: Introduction to Machine Learning",
  "Try: History of Ancient Rome",
  "Try: How does CRISPR work?",
  "Try: Quantum mechanics for beginners",
  "Try: Personal finance fundamentals",
  "Try: Music theory from scratch",
];

export function SearchSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cycle through placeholders with a typewriter-erase effect
  useEffect(() => {
    let charIdx = 0;
    let erasing = false;
    const target = PLACEHOLDERS[placeholderIdx];

    const tick = () => {
      if (!erasing) {
        if (charIdx <= target.length) {
          setDisplayedPlaceholder(target.slice(0, charIdx));
          charIdx++;
          timeoutRef.current = setTimeout(tick, 40);
        } else {
          // Pause before erasing
          timeoutRef.current = setTimeout(() => {
            erasing = true;
            tick();
          }, 2200);
        }
      } else {
        if (charIdx > 0) {
          charIdx--;
          setDisplayedPlaceholder(target.slice(0, charIdx));
          timeoutRef.current = setTimeout(tick, 20);
        } else {
          setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
        }
      }
    };

    timeoutRef.current = setTimeout(tick, 300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [placeholderIdx]);

  const handleSearch = (q: string) => {
    const term = q.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <section
      className="text-center px-12 py-20"
      style={{
        background:
          "linear-gradient(to bottom, transparent, rgba(232,160,32,0.04), transparent)",
      }}
    >
      <p className="text-[11px] tracking-[3px] uppercase text-amber mb-5">
        Discover Knowledge
      </p>
      <h2
        className="font-display font-bold mb-10"
        style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
      >
        What do you want to{" "}
        <em className="italic text-amber">learn today?</em>
      </h2>

      {/* Search bar */}
      <div
        className="max-w-[680px] mx-auto flex border bg-paper/[0.04] transition-all duration-300 focus-within:border-amber"
        style={{ borderColor: "rgba(245,240,232,0.15)" }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
          placeholder={displayedPlaceholder || PLACEHOLDERS[0]}
          className="flex-1 bg-transparent border-none px-6 py-[18px] text-paper text-[15px] outline-none placeholder:text-paper/30"
        />
        <button
          onClick={() => handleSearch(query)}
          className="bg-amber text-ink px-8 py-[18px] text-sm font-medium tracking-[0.5px] hover:bg-amber-light transition-colors duration-200 whitespace-nowrap"
        >
          Search →
        </button>
      </div>

      {/* Suggestion pills */}
      <div className="flex gap-2.5 justify-center flex-wrap mt-6">
        {SUGGESTIONS.map(({ emoji, label }) => (
          <button
            key={label}
            onClick={() => handleSearch(label)}
            className="px-4 py-1.5 border text-xs text-paper/45 cursor-pointer transition-all duration-200 bg-transparent hover:border-amber hover:text-amber hover:bg-amber/[0.12]"
            style={{ borderColor: "rgba(245,240,232,0.1)" }}
          >
            {emoji} {label}
          </button>
        ))}
      </div>
    </section>
  );
}
