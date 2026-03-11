// apps/web/lib/tagger.ts
// Rule-based video tagger — no AI cost, works great for MVP.
// Feed it a video title + description → get back topics, difficulty, and tags.

import { DifficultyLevel } from "@weknoq/db";

// ─────────────────────────────────────────────
// Keyword maps
// ─────────────────────────────────────────────

const TOPIC_KEYWORDS: Record<string, string[]> = {
  programming: [
    "python", "javascript", "typescript", "react", "node", "css", "html",
    "programming", "coding", "software", "algorithm", "data structure",
    "web development", "backend", "frontend", "api", "database", "sql",
    "machine learning", "deep learning", "ai", "tensorflow", "pytorch",
    "git", "docker", "kubernetes", "linux", "bash", "shell",
  ],
  science: [
    "physics", "chemistry", "biology", "quantum", "relativity", "evolution",
    "genetics", "dna", "neuroscience", "brain", "atom", "molecule",
    "astronomy", "space", "cosmos", "black hole", "nasa", "crispr",
    "climate", "ecology", "scientific", "laboratory", "experiment",
  ],
  philosophy: [
    "philosophy", "stoicism", "ethics", "epistemology", "ontology",
    "socrates", "plato", "aristotle", "nietzsche", "kant", "descartes",
    "existentialism", "logic", "consciousness", "metaphysics", "morality",
    "free will", "meaning of life",
  ],
  finance: [
    "finance", "investing", "stock market", "stocks", "bonds", "etf",
    "compound interest", "personal finance", "budget", "money", "wealth",
    "economics", "inflation", "cryptocurrency", "bitcoin", "portfolio",
    "retirement", "index fund", "warren buffett",
  ],
  "music-arts": [
    "music theory", "piano", "guitar", "violin", "composition", "harmony",
    "rhythm", "chord", "scale", "melody", "music", "instrument",
    "carnatic", "hindustani", "classical music", "jazz", "blues",
    "painting", "drawing", "illustration", "art history",
  ],
  languages: [
    "language learning", "japanese", "spanish", "french", "mandarin",
    "hindi", "assamese", "korean", "german", "arabic", "portuguese",
    "grammar", "vocabulary", "pronunciation", "fluency",
  ],
  mathematics: [
    "mathematics", "calculus", "algebra", "geometry", "statistics",
    "probability", "linear algebra", "number theory", "proof",
    "differential equations", "fourier", "topology", "discrete math",
  ],
  history: [
    "history", "ancient", "civilization", "world war", "roman empire",
    "medieval", "renaissance", "industrial revolution", "independence",
    "historical", "archival", "empire", "dynasty",
  ],
  psychology: [
    "psychology", "cognitive", "behavior", "mental health", "therapy",
    "mindfulness", "meditation", "stoicism", "emotional intelligence",
    "memory", "learning science", "motivation", "habits",
  ],
};

const DIFFICULTY_KEYWORDS = {
  BEGINNER: [
    "beginner", "introduction", "intro", "getting started", "basics",
    "fundamentals", "101", "for beginners", "start", "first", "easy",
    "simple", "overview", "what is", "explained",
  ],
  INTERMEDIATE: [
    "intermediate", "deep dive", "in depth", "advanced concepts",
    "how to build", "build a", "project", "tutorial", "hands on",
    "practical", "real world",
  ],
  ADVANCED: [
    "advanced", "expert", "mastery", "internals", "under the hood",
    "architecture", "optimization", "performance", "research", "paper",
    "theory", "proof", "graduate",
  ],
};

// ─────────────────────────────────────────────
// Main tagger function
// ─────────────────────────────────────────────

export interface TagResult {
  topicSlugs: string[];       // matched topic slugs from our DB
  difficulty: DifficultyLevel | null;
  extractedTags: string[];    // raw keyword matches for Tag table
}

export function tagVideo(title: string, description: string): TagResult {
  const text = `${title} ${description}`.toLowerCase();

  // ── Topics ──────────────────────────────────
  const topicSlugs: string[] = [];
  for (const [slug, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    const matched = keywords.some((kw) => text.includes(kw));
    if (matched) topicSlugs.push(slug);
  }

  // ── Difficulty ──────────────────────────────
  let difficulty: DifficultyLevel | null = null;
  // Check from specific to general to avoid false positives
  for (const [level, keywords] of Object.entries(DIFFICULTY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      difficulty = level as DifficultyLevel;
      break;
    }
  }
  // Default: if no match, guess from duration or leave null
  if (!difficulty) difficulty = "BEGINNER";

  // ── Raw tags ────────────────────────────────
  // Pull all matched keywords as tags (deduplicated)
  const extractedTags = Array.from(
    new Set(
      Object.values(TOPIC_KEYWORDS)
        .flat()
        .filter((kw) => text.includes(kw) && kw.length > 3)
        .slice(0, 10) // max 10 tags per video
    )
  );

  return { topicSlugs, difficulty, extractedTags };
}

// ─────────────────────────────────────────────
// Summary generator (rule-based, no AI needed)
// ─────────────────────────────────────────────

export function generateSummary(title: string, description: string): string {
  // Strip YouTube cruft (links, timestamps, sponsor lines)
  const cleaned = description
    .split("\n")
    .filter(
      (line) =>
        !line.match(/https?:\/\//) &&      // no links
        !line.match(/^\d+:\d+/) &&          // no timestamps
        !line.match(/subscribe|patreon|sponsor|affiliate/i) &&
        line.trim().length > 30             // must be a real sentence
    )
    .slice(0, 3)
    .join(" ")
    .trim();

  // If description is usable, trim it to ~160 chars
  if (cleaned.length > 80) {
    return cleaned.length > 160 ? cleaned.slice(0, 157) + "…" : cleaned;
  }

  // Fallback: generic summary from title
  return `A video about ${title.toLowerCase().replace(/[^a-z0-9\s]/g, "")}.`;
}
