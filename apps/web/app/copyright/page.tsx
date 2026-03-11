import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function CopyrightPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24 px-12">
        <div className="max-w-2xl mx-auto pt-8">
          <p className="label mb-4">Legal</p>
          <h1 className="font-display text-4xl font-bold mb-2">Copyright Policy</h1>
          <p className="text-[13px] text-paper/30 mb-10">Last updated: March 2025</p>

          <div className="space-y-8 text-[14px] text-paper/55 leading-[1.8]">
            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">Our approach to content</h2>
              <p>Weknoq is a link aggregator. We do not host, store, or re-upload any video content. Every video on Weknoq links to the original source on its respective platform (YouTube, Vimeo, TED, MIT OCW, etc.).</p>
              <p className="mt-3">We index publicly available metadata — titles, descriptions, thumbnails, and channel names — to help users discover great educational content. All intellectual property rights remain with the original creators and platforms.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">DMCA / Takedown requests</h2>
              <p>If you are a rights holder and believe your content has been listed inappropriately, or you wish to have your content removed from Weknoq&apos;s index, please submit a takedown request.</p>
              <p className="mt-3">We will review and process all valid requests within 5 business days.</p>
              <Link
                href="/takedown"
                className="inline-block mt-4 bg-amber/10 border border-amber/30 text-amber px-6 py-2.5 text-[13px] hover:bg-amber hover:text-ink transition-all"
              >
                Submit Takedown Request →
              </Link>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">Creator permissions</h2>
              <p>If you are a creator and want your videos featured more prominently, or wish to add a curator&apos;s note to your content on Weknoq, please <Link href="/submit" className="text-amber hover:underline">submit your videos</Link> directly.</p>
            </section>
          </div>

          <div className="mt-10 pt-8 border-t border-paper/[0.07] flex gap-5 text-[13px]">
            <Link href="/terms" className="text-amber hover:underline">Terms of Service</Link>
            <Link href="/privacy" className="text-amber hover:underline">Privacy Policy</Link>
            <Link href="/takedown" className="text-amber hover:underline">Takedown Request</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
