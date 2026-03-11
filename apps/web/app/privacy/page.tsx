import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24 px-12">
        <div className="max-w-2xl mx-auto pt-8">
          <p className="label mb-4">Legal</p>
          <h1 className="font-display text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-[13px] text-paper/30 mb-10">Last updated: March 2025 · v0.1.0</p>

          <div className="space-y-8 text-[14px] text-paper/55 leading-[1.8]">
            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">1. What we collect</h2>
              <p>When you sign in with Google, we store your name, email address, and profile picture to create your account. We also store your bookmarks, enrolled learning paths, and video progress within Weknoq.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">2. What we don't collect</h2>
              <p>We do not sell your data. We do not track you across other websites. We do not use advertising cookies. We do not share your data with third parties beyond what is required to operate the service (e.g., database hosting).</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">3. Cookies</h2>
              <p>We use a single session cookie for authentication. No advertising or tracking cookies are set. Analytics, if any, are privacy-preserving and aggregate-only.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">4. Third-party embeds</h2>
              <p>When you watch a video on Weknoq, the video is embedded from its original platform (e.g., YouTube). Those platforms may set their own cookies and collect data per their own privacy policies.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">5. Data deletion</h2>
              <p>You may request deletion of your account and all associated data at any time by emailing us. Account deletion is permanent and irreversible.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">6. Security</h2>
              <p>We use industry-standard security practices including HTTPS, encrypted database connections, and JWT-based session management. Passwords are never stored — we use OAuth only.</p>
            </section>

            <section>
              <h2 className="font-display text-xl font-bold text-paper mb-3">7. Contact</h2>
              <p>For privacy questions or data deletion requests, please use our <Link href="/submit" className="text-amber hover:underline">contact form</Link>.</p>
            </section>
          </div>

          <div className="mt-10 pt-8 border-t border-paper/[0.07] flex gap-5 text-[13px]">
            <Link href="/terms" className="text-amber hover:underline">Terms of Service</Link>
            <Link href="/copyright" className="text-amber hover:underline">Copyright Policy</Link>
            <Link href="/about" className="text-amber hover:underline">About Weknoq</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
