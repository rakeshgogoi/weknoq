import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24 px-12">
        <div className="max-w-2xl mx-auto pt-8">
          <p className="label mb-4">About</p>
          <h1 className="font-display text-5xl font-bold leading-tight mb-6">
            One place for all <br />
            <em className="text-amber italic">human knowledge.</em>
          </h1>
          <p className="text-[15px] text-paper/55 leading-[1.8] mb-6">
            Weknoq is a free, open educational video aggregator. We collect the
            best learning videos from YouTube, TED, MIT OpenCourseWare, Khan Academy,
            and dozens of other platforms — and organize them into topics, structured
            learning paths, and curated collections.
          </p>
          <p className="text-[15px] text-paper/55 leading-[1.8] mb-6">
            We believe that great educational content exists everywhere on the
            internet, but it's scattered, hard to find, and surrounded by noise.
            Weknoq fixes that. No paywalls, no subscriptions, no rabbit holes —
            just signal.
          </p>
          <p className="text-[15px] text-paper/55 leading-[1.8] mb-12">
            All videos remain the property of their original creators and platforms.
            We only aggregate metadata and links — we never host or re-upload content.
          </p>

          <div className="grid grid-cols-3 gap-6 mb-14 py-10 border-y border-paper/[0.07]">
            {[
              { num: "120K+", label: "Videos curated" },
              { num: "48",    label: "Topic categories" },
              { num: "12",    label: "Source platforms" },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <span className="font-display text-4xl font-bold text-amber block">{num}</span>
                <span className="text-[12px] tracking-[1.5px] uppercase text-paper/35 mt-1 block">{label}</span>
              </div>
            ))}
          </div>

          <h2 className="font-display text-2xl font-bold mb-4">Our principles</h2>
          <div className="space-y-4 mb-12">
            {[
              { title: "Free forever", desc: "Great education shouldn't cost money. Every video on Weknoq is free to watch." },
              { title: "Creator-first", desc: "We link to original sources. Watch time, ad revenue, and recognition go to the creators." },
              { title: "No noise", desc: "Every video is reviewed. We only surface high-quality, educational content." },
              { title: "Privacy-respecting", desc: "No tracking beyond what's needed to run the service. Your learning is your business." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-4 p-5 border border-paper/[0.07]">
                <div className="w-1.5 h-1.5 bg-amber rounded-full flex-shrink-0 mt-2" />
                <div>
                  <p className="font-medium mb-1">{title}</p>
                  <p className="text-[13px] text-paper/45 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Link href="/explore" className="bg-amber text-ink px-7 py-3 text-sm font-medium hover:bg-amber-light transition-colors">
              Start Exploring
            </Link>
            <Link href="/submit" className="border border-paper/20 text-paper/60 px-7 py-3 text-sm hover:border-amber hover:text-amber transition-colors">
              Submit a Video
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
