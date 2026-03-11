import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TakedownPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24 px-12">
        <div className="max-w-xl mx-auto pt-8">
          <p className="label mb-4">DMCA / Takedown</p>
          <h1 className="font-display text-4xl font-bold leading-tight mb-4">
            Request content <br />
            <em className="text-amber italic">removal.</em>
          </h1>
          <p className="text-[14px] text-paper/45 leading-relaxed mb-10">
            Weknoq only links to content hosted on third-party platforms. If you
            wish to have your content removed from our index, please fill out the
            form below. We process all valid requests within 5 business days.
          </p>

          <form className="space-y-5" action="#" method="post">
            <div>
              <label className="text-[11px] tracking-[1.5px] uppercase text-paper/40 block mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Full name"
                className="w-full bg-transparent border border-paper/15 focus:border-amber/60 px-4 py-3 text-[14px] text-paper placeholder-paper/25 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] tracking-[1.5px] uppercase text-paper/40 block mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                className="w-full bg-transparent border border-paper/15 focus:border-amber/60 px-4 py-3 text-[14px] text-paper placeholder-paper/25 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] tracking-[1.5px] uppercase text-paper/40 block mb-2">
                URL(s) to remove *
              </label>
              <textarea
                name="urls"
                rows={4}
                required
                placeholder="https://weknoq.com/video/...&#10;https://weknoq.com/video/..."
                className="w-full bg-transparent border border-paper/15 focus:border-amber/60 px-4 py-3 text-[14px] text-paper placeholder-paper/25 outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label className="text-[11px] tracking-[1.5px] uppercase text-paper/40 block mb-2">
                Reason for removal *
              </label>
              <select
                name="reason"
                required
                className="w-full bg-ink border border-paper/15 focus:border-amber/60 px-4 py-3 text-[14px] text-paper/70 outline-none transition-colors"
              >
                <option value="">Select a reason...</option>
                <option value="copyright">Copyright infringement</option>
                <option value="privacy">Privacy violation</option>
                <option value="incorrect">Incorrect metadata</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] tracking-[1.5px] uppercase text-paper/40 block mb-2">
                Additional details
              </label>
              <textarea
                name="details"
                rows={3}
                placeholder="Any additional context..."
                className="w-full bg-transparent border border-paper/15 focus:border-amber/60 px-4 py-3 text-[14px] text-paper placeholder-paper/25 outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber text-ink py-4 text-sm font-medium hover:bg-amber-light transition-colors"
            >
              Submit Request →
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-paper/[0.07]">
            <p className="text-[12px] text-paper/30 leading-relaxed">
              For urgent matters, please also contact the platform hosting the
              original video directly (YouTube, Vimeo, etc.) as we only index
              links — removing content from the source is more effective.{" "}
              <Link href="/copyright" className="text-amber hover:underline">
                Read our copyright policy.
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
