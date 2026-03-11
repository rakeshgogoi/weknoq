"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useEffect, useState } from "react";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-paper/[0.04] border border-paper/[0.07] p-6">
      <p className="text-[11px] tracking-[2px] uppercase text-paper/30 mb-2">{label}</p>
      <p className="font-display text-3xl font-bold text-amber">{value}</p>
      {sub && <p className="text-[12px] text-paper/30 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      // Fetch user data (bookmarks, enrollments) from API
      Promise.all([
        fetch("/api/user/bookmarks").then((r) => r.ok ? r.json() : { bookmarks: [] }),
        fetch("/api/user/enrollments").then((r) => r.ok ? r.json() : { enrollments: [] }),
      ])
        .then(([bData, eData]) => {
          setBookmarks(bData.bookmarks ?? []);
          setEnrollments(eData.enrollments ?? []);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);

  // Not authenticated
  if (status === "unauthenticated") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 pb-24 flex items-center justify-center px-12">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full border-2 border-amber flex items-center justify-center mx-auto mb-6 text-amber text-2xl">
              🔑
            </div>
            <h1 className="font-display text-3xl font-bold mb-3">
              Sign in to track your learning
            </h1>
            <p className="text-[14px] text-paper/45 leading-relaxed mb-8">
              Save videos, enroll in learning paths, and track your progress across
              all topics.
            </p>
            <button
              onClick={() => signIn("google")}
              className="bg-amber text-ink px-10 py-4 text-sm font-medium hover:bg-amber-light transition-colors"
            >
              Sign in with Google
            </button>
            <p className="mt-4 text-[12px] text-paper/25">
              Free forever. No credit card required.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 px-12 animate-pulse">
          <div className="h-8 bg-white/10 w-64 mb-4 mt-4" />
          <div className="grid grid-cols-4 gap-5 mb-10">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-white/5" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-video bg-white/5" />
            ))}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const userName = session?.user?.name?.split(" ")[0] ?? "Learner";

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24 px-12">
        {/* Header */}
        <div className="pt-4 mb-12">
          <p className="label mb-3">My Dashboard</p>
          <h1 className="font-display text-4xl font-bold">
            Welcome back,{" "}
            <em className="text-amber italic not-italic">{userName}.</em>
          </h1>
          <p className="text-[14px] text-paper/40 mt-2">
            {session?.user?.email}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5 mb-14">
          <StatCard label="Saved Videos" value={bookmarks.length} sub="in your library" />
          <StatCard label="Enrolled Paths" value={enrollments.length} sub="learning journeys" />
          <StatCard label="Videos Watched" value={0} sub="keep going!" />
          <StatCard label="Hours Learned" value="0h" sub="total watch time" />
        </div>

        {/* Enrolled paths */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <p className="label">My Learning Paths</p>
            <Link href="/paths" className="text-[12px] text-paper/30 hover:text-amber transition-colors">
              Browse all paths →
            </Link>
          </div>

          {enrollments.length > 0 ? (
            <div className="grid grid-cols-3 gap-5">
              {enrollments.map((e: any) => (
                <Link
                  key={e.id}
                  href={`/paths/${e.path?.slug ?? "#"}`}
                  className="group bg-paper/[0.03] border border-paper/[0.07] p-6 hover:border-amber/30 transition-all"
                >
                  <div className="text-3xl mb-3">{e.path?.emoji ?? "🧭"}</div>
                  <h3 className="font-display text-lg font-bold mb-2">{e.path?.title}</h3>
                  {/* Progress bar */}
                  <div className="w-full h-1 bg-paper/10 mb-2">
                    <div
                      className="h-full bg-amber"
                      style={{
                        width: `${Math.min(
                          100,
                          ((e.currentVideoOrder - 1) / Math.max(1, e.path?.totalVideos ?? 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-paper/35">
                    Video {e.currentVideoOrder} of {e.path?.totalVideos ?? "?"}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-paper/[0.07] p-10 text-center text-paper/30">
              <div className="text-4xl mb-3">🧭</div>
              <p className="font-display text-lg mb-2">No paths yet</p>
              <p className="text-sm mb-5">Enroll in a structured learning journey.</p>
              <Link
                href="/paths"
                className="inline-block bg-amber/10 border border-amber/30 text-amber px-6 py-2.5 text-[13px] hover:bg-amber hover:text-ink transition-all"
              >
                Browse Learning Paths
              </Link>
            </div>
          )}
        </section>

        {/* Saved videos */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <p className="label">Saved Videos</p>
            <Link href="/explore" className="text-[12px] text-paper/30 hover:text-amber transition-colors">
              Explore more →
            </Link>
          </div>

          {bookmarks.length > 0 ? (
            <div className="grid grid-cols-3 gap-5">
              {bookmarks.map((b: any) => (
                <Link
                  key={b.id}
                  href={`/video/${b.video?.id}`}
                  className="group border border-paper/[0.07] overflow-hidden hover:border-amber/30 transition-all"
                >
                  <div className="aspect-video bg-slate flex items-center justify-center text-3xl">
                    📺
                  </div>
                  <div className="p-4">
                    <h3 className="text-[14px] font-medium line-clamp-2">{b.video?.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-paper/[0.07] p-10 text-center text-paper/30">
              <div className="text-4xl mb-3">🔖</div>
              <p className="font-display text-lg mb-2">No saved videos</p>
              <p className="text-sm mb-5">Bookmark videos to watch later.</p>
              <Link
                href="/explore"
                className="inline-block bg-amber/10 border border-amber/30 text-amber px-6 py-2.5 text-[13px] hover:bg-amber hover:text-ink transition-all"
              >
                Explore Videos
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
