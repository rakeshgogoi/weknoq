#!/usr/bin/env node
/**
 * Batch-ingest 100+ popular educational videos across all 10 topics.
 *
 * Usage (while dev server is running):
 *   INGEST_API_KEY=your-key node scripts/batch-ingest.mjs
 *
 * Or against production:
 *   INGEST_API_KEY=your-key APP_URL=https://yourapp.com node scripts/batch-ingest.mjs
 *
 * YouTube API quota used: ~2,200 units (well within 10,000/day limit)
 *   - 22 search calls × 100 units = 2,200 units
 *   - ~22 video-detail batch calls × 1 unit ≈ 22 units
 */

const BASE_URL = process.env.APP_URL ?? "http://localhost:3000";
const API_KEY = process.env.INGEST_API_KEY;

if (!API_KEY) {
  console.error("❌  INGEST_API_KEY env var is required.");
  console.error("    Example: INGEST_API_KEY=secret node scripts/batch-ingest.mjs");
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// 22 curated queries  ×  5 results each  =  ~110 videos across all 10 topics
// Queries are crafted to surface popular, high-quality educational content.
// ─────────────────────────────────────────────────────────────────────────────
const QUERIES = [
  // ── Programming (3 queries) ───────────────────────────────────────────────
  {
    query: "python programming full course beginners 2024",
    topicSlug: "programming",
    maxResults: 5,
  },
  {
    query: "javascript react web development tutorial complete",
    topicSlug: "programming",
    maxResults: 5,
  },
  {
    query: "machine learning deep learning AI neural network tutorial",
    topicSlug: "programming",
    maxResults: 5,
  },

  // ── Mathematics (2 queries) ───────────────────────────────────────────────
  {
    query: "calculus linear algebra mathematics visual explained",
    topicSlug: "mathematics",
    maxResults: 5,
  },
  {
    query: "statistics probability data science mathematics",
    topicSlug: "mathematics",
    maxResults: 5,
  },

  // ── Science (2 queries) ───────────────────────────────────────────────────
  {
    query: "quantum physics relativity explained visual",
    topicSlug: "science",
    maxResults: 5,
  },
  {
    query: "biology evolution DNA genetics neuroscience space astronomy",
    topicSlug: "science",
    maxResults: 5,
  },

  // ── Philosophy (2 queries) ────────────────────────────────────────────────
  {
    query: "stoicism philosophy ethics meaning life explained",
    topicSlug: "philosophy",
    maxResults: 5,
  },
  {
    query: "existentialism consciousness free will morality philosophy",
    topicSlug: "philosophy",
    maxResults: 5,
  },

  // ── Finance (2 queries) ───────────────────────────────────────────────────
  {
    query: "investing personal finance stock market beginners wealth",
    topicSlug: "finance",
    maxResults: 5,
  },
  {
    query: "economics inflation cryptocurrency bitcoin financial literacy",
    topicSlug: "finance",
    maxResults: 5,
  },

  // ── History (2 queries) ───────────────────────────────────────────────────
  {
    query: "ancient civilizations world history empires rome greece",
    topicSlug: "history",
    maxResults: 5,
  },
  {
    query: "world war modern history documentary explained",
    topicSlug: "history",
    maxResults: 5,
  },

  // ── Psychology (2 queries) ────────────────────────────────────────────────
  {
    query: "psychology cognitive behavior science social human mind",
    topicSlug: "psychology",
    maxResults: 5,
  },
  {
    query: "mindfulness meditation habits neuroscience mental health",
    topicSlug: "psychology",
    maxResults: 5,
  },

  // ── Music & Arts (2 queries) ──────────────────────────────────────────────
  {
    query: "music theory harmony composition fundamentals",
    topicSlug: "music-arts",
    maxResults: 5,
  },
  {
    query: "piano guitar violin classical music tutorial beginner",
    topicSlug: "music-arts",
    maxResults: 5,
  },

  // ── Languages (2 queries) ─────────────────────────────────────────────────
  {
    query: "learn japanese beginner complete course",
    topicSlug: "languages",
    maxResults: 5,
  },
  {
    query: "learn spanish french language pronunciation grammar",
    topicSlug: "languages",
    maxResults: 5,
  },

  // ── Design (2 queries) ────────────────────────────────────────────────────
  {
    query: "UI UX design principles product design tutorial",
    topicSlug: "design",
    maxResults: 5,
  },
  {
    query: "graphic design typography visual design fundamentals",
    topicSlug: "design",
    maxResults: 5,
  },

  // ── Extra: cross-topic popular educational content ────────────────────────
  {
    query: "TED talk education motivation learning science",
    topicSlug: undefined,
    maxResults: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────────────

async function ingest(query, topicSlug, maxResults) {
  const body = { query, maxResults };
  if (topicSlug) body.topicSlug = topicSlug;

  const res = await fetch(`${BASE_URL}/api/youtube/ingest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? `HTTP ${res.status}`);
  }

  return data;
}

async function main() {
  const total = QUERIES.reduce((s, q) => s + q.maxResults, 0);
  console.log(`🎬  Weknoq batch video ingest`);
  console.log(`📡  Target  : ${BASE_URL}`);
  console.log(`📋  Queries : ${QUERIES.length}  (up to ${total} videos)\n`);

  let totalIngested = 0;
  let errors = 0;

  for (let i = 0; i < QUERIES.length; i++) {
    const { query, topicSlug, maxResults } = QUERIES[i];
    const label = topicSlug ?? "general";
    process.stdout.write(
      `[${String(i + 1).padStart(2)}/${QUERIES.length}] ${label.padEnd(12)} "${query.slice(0, 50)}${query.length > 50 ? "…" : ""}" … `
    );

    try {
      const result = await ingest(query, topicSlug, maxResults);
      const count = result.count ?? 0;
      totalIngested += count;
      console.log(`✅  ${count} videos`);
    } catch (err) {
      errors++;
      console.log(`❌  ${err.message}`);
    }

    // Brief pause to be polite to the API and avoid hammering Redis
    if (i < QUERIES.length - 1) {
      await new Promise((r) => setTimeout(r, 1200));
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`✨  Done!  ${totalIngested} videos ingested, ${errors} error(s)`);
  if (errors > 0) {
    console.log(`\n   Tip: re-run the script — cached queries skip YouTube quota.`);
  }
}

main().catch((err) => {
  console.error("\n💥 Fatal error:", err.message);
  process.exit(1);
});
