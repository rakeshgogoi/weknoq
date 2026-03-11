import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function SubmitPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24 px-12">
        <div className="max-w-xl mx-auto pt-8">
          <p className="label mb-4">Submit a Video</p>
          <h1 className="font-display text-4xl font-bold leading-tight mb-4">
            Share great <br />
            <em className="text-amber italic">educational content.</em>
          </h1>
          <p className="text-[14px] text-paper/45 leading-relaxed mb-10">
            Found an exceptional educational video that isn&apos;t on Weknoq yet?
            Submit it and we&apos;ll review it for inclusion.
          </p>

          <form className="space-y-5" action="#" method="post">
            <div>
              <label className="text-[11px] tracking-[1.5px] uppercase text-paper/40 block mb-2">
                Video URL *
              </label>
              <input
                type="url"
                name="url"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-transparent border border-paper/15 focus:border-amber/60 px-4 py-3 text-[14px] text-paper placeholder-paper/25 outline-none transition-colors"
              />
              <p className="text-[11px] text-paper/25 mt-1.5">
                YouTube, Vimeo, TED, MIT OCW, Khan Academy, and more.
              </p>
            </div>

            <div>
              <label className="text-[11px] tracking-[1.5px] uppercase text-paper/40 block mb-2">
                Suggested Topic
              </label>
              <select
                name="topic"
                className="w-full bg-ink border border-paper/15 focus:border-amber/60 px-4 py-3 text-[14px] text-paper/70 outline-none transition-colors"
              >
                <option value="">Select a topic...</option>
                {[
                  "Programming", "Mathematics", "Science", "Philosophy",
                  "Finance", "History", "Music & Arts", "Languages",
                  "Design & Art", "Psychology", "Astronomy", "Engineering",
                ].map((t) => (
                  <option key={t} value={t.toLowerCase()}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] tracking-[1.5px] uppercase text-paper/40 block mb-2">
                Why is it great? (optional)
              </label>
              <textarea
                name="note"
                rows={3}
                placeholder="What makes this video exceptional..."
                className="w-full bg-transparent border border-paper/15 focus:border-amber/60 px-4 py-3 text-[14px] text-paper placeholder-paper/25 outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label className="text-[11px] tracking-[1.5px] uppercase text-paper/40 block mb-2">
                Your email (optional, for updates)
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full bg-transparent border border-paper/15 focus:border-amber/60 px-4 py-3 text-[14px] text-paper placeholder-paper/25 outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber text-ink py-4 text-sm font-medium hover:bg-amber-light transition-colors"
            >
              Submit Video →
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-paper/[0.07]">
            <p className="text-[12px] text-paper/30 leading-relaxed">
              All submissions are reviewed manually. We check for quality, accuracy,
              and educational value before adding videos to the library. Creator
              content rights are always respected.{" "}
              <Link href="/takedown" className="text-amber hover:underline">
                Need a takedown?
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
