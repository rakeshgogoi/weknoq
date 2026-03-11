import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 3600;

const FEATURED_CHANNELS = [
  { name: "3Blue1Brown",         slug: "3blue1brown",         emoji: "🔵", topic: "Mathematics",  videos: 130, desc: "Visual, intuitive mathematics — from linear algebra to neural networks." },
  { name: "freeCodeCamp",        slug: "freecodecamp",        emoji: "🔥", topic: "Programming",  videos: 980, desc: "Comprehensive programming tutorials — Python, JavaScript, databases, and more." },
  { name: "TED",                 slug: "ted",                 emoji: "🎙️", topic: "Various",      videos: 3200, desc: "Ideas worth spreading — science, technology, design, and the human condition." },
  { name: "Kurzgesagt",          slug: "kurzgesagt",          emoji: "🐦", topic: "Science",      videos: 190, desc: "Beautifully animated science and philosophy — designed to change how you see the world." },
  { name: "Khan Academy",        slug: "khan-academy",        emoji: "🎓", topic: "Various",      videos: 8000, desc: "Free world-class education for anyone, anywhere. Every subject from K-12 through college." },
  { name: "Veritasium",          slug: "veritasium",          emoji: "⚛️", topic: "Science",      videos: 260, desc: "Derek Muller explores the world's counterintuitive physics and interesting ideas." },
  { name: "CrashCourse",         slug: "crashcourse",         emoji: "💥", topic: "Various",      videos: 1600, desc: "Fast-paced, entertaining deep dives into history, science, literature, and more." },
  { name: "MIT OpenCourseWare",  slug: "mit-ocw",             emoji: "🏛️", topic: "Engineering",  videos: 2400, desc: "Complete MIT courses available free — engineering, CS, math, and more." },
  { name: "Lex Fridman",         slug: "lex-fridman",         emoji: "🤖", topic: "Technology",   videos: 400, desc: "Long-form conversations with scientists, engineers, and thinkers at the frontier." },
  { name: "The School of Life",  slug: "school-of-life",      emoji: "🦉", topic: "Philosophy",   videos: 460, desc: "Philosophical ideas about life, relationships, and emotional intelligence." },
  { name: "Two Cents",           slug: "two-cents",           emoji: "💰", topic: "Finance",      videos: 140, desc: "Personal finance, investing, and money skills for real people." },
  { name: "TED-Ed",              slug: "ted-ed",              emoji: "📚", topic: "Various",      videos: 1800, desc: "Animated lessons on science, math, history, and literature — perfect for all ages." },
];

export default function CreatorsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24">
        {/* Header */}
        <div className="px-12 pt-4 mb-14">
          <p className="label mb-3">Creators</p>
          <div className="flex items-end justify-between">
            <h1
              className="font-display font-bold leading-[1.05]"
              style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
            >
              The channels
              <br />
              <em className="text-amber italic">behind the knowledge.</em>
            </h1>
          </div>
          <p className="mt-5 text-[15px] text-paper/45 leading-relaxed max-w-2xl">
            Weknoq aggregates content from these exceptional educational channels.
            All views, watch time, and revenue go to the original creators.
          </p>
        </div>

        {/* Channels grid */}
        <div className="px-12 grid grid-cols-3 gap-5 mb-16">
          {FEATURED_CHANNELS.map((c) => (
            <Link
              key={c.slug}
              href={`/search?q=${encodeURIComponent(c.name)}`}
              className="group bg-paper/[0.03] border border-paper/[0.07] p-6 hover:border-amber/30 hover:bg-paper/[0.05] transition-all duration-200"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-xl flex-shrink-0 group-hover:border-amber/30 transition-colors">
                  {c.emoji}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-[17px] font-bold truncate">{c.name}</h3>
                  <p className="text-[10px] tracking-[1.5px] uppercase text-amber mt-0.5">
                    {c.topic}
                  </p>
                </div>
              </div>
              <p className="text-[13px] text-paper/45 leading-[1.6] mb-4 line-clamp-2">
                {c.desc}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-paper/30">
                  {c.videos.toLocaleString()} videos
                </span>
                <span className="text-[11px] text-paper/20 group-hover:text-amber transition-colors">
                  Search →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Are you a creator? */}
        <div className="px-12">
          <div className="bg-amber/[0.04] border border-amber/15 p-10 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold mb-2">
                Are you an educational creator?
              </h2>
              <p className="text-[14px] text-paper/45 max-w-lg">
                If your content is featured on Weknoq and you&apos;d like it removed,
                want to update your profile, or have questions — reach out.
              </p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <Link
                href="/submit"
                className="bg-amber text-ink px-7 py-3 text-sm font-medium hover:bg-amber-light transition-colors"
              >
                Submit Your Videos
              </Link>
              <Link
                href="/takedown"
                className="border border-paper/20 text-paper/60 px-7 py-3 text-sm hover:border-amber hover:text-amber transition-colors"
              >
                Request Takedown
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
