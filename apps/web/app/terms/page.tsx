import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24 px-12">
        <div className="max-w-2xl mx-auto pt-8">
          <p className="label mb-4">Legal</p>
          <h1 className="font-display text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-[13px] text-paper/30 mb-10">Last updated: March 2025 · v0.1.0</p>

          <div className="space-y-8 text-[14px] text-paper/55 leading-[1.8]">
            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">1. About Weknoq</h2>
              <p>Weknoq is a free educational video aggregator. We index and link to publicly available educational content from platforms including YouTube, TED, MIT OpenCourseWare, Khan Academy, and others. We do not host video content.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">2. Use of the Service</h2>
              <p>You may use Weknoq for personal, non-commercial educational purposes. You may not scrape, reverse-engineer, or use our API without permission. You may not use the service for any illegal purpose.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">3. Content & Copyright</h2>
              <p>All videos featured on Weknoq belong to their respective creators and platforms. Weknoq claims no ownership over any video content. If you are a rights holder and wish to have content removed, please see our <Link href="/takedown" className="text-amber hover:underline">Takedown Request</Link> page.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">4. User Accounts</h2>
              <p>Accounts are optional and used only to save your learning progress, bookmarks, and enrolled paths. We use Google OAuth for authentication. We do not store passwords.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">5. Disclaimer of Warranties</h2>
              <p>Weknoq is provided "as is" without warranty of any kind. We make no guarantees regarding uptime, accuracy of metadata, or availability of third-party video content.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">6. Limitation of Liability</h2>
              <p>Weknoq shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">7. Changes to Terms</h2>
              <p>We may update these terms at any time. Continued use of the service constitutes acceptance of the new terms.</p>
            </section>
          </div>

          <div className="mt-10 pt-8 border-t border-paper/[0.07] flex gap-5 text-[13px]">
            <Link href="/privacy" className="text-amber hover:underline">Privacy Policy</Link>
            <Link href="/copyright" className="text-amber hover:underline">Copyright Policy</Link>
            <Link href="/about" className="text-amber hover:underline">About Weknoq</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
