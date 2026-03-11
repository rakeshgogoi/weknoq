"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

type Status = "idle" | "loading" | "success" | "error";

export default function SubmitPage() {
  const [status, setStatus]   = useState<Status>("idle");
  const [errorMsg, setError]  = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form  = e.currentTarget;
    const data  = new FormData(form);

    try {
      const res = await fetch("/api/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url:   data.get("url"),
          topic: data.get("topic") || undefined,
          note:  data.get("note")  || undefined,
          email: data.get("email") || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setStatus("success");
        form.reset();
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24 px-4 sm:px-8 md:px-12">
        <div className="max-w-xl mx-auto pt-8">
          <p className="label mb-4">Submit a Video</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight mb-4">
            Share great <br />
            <em className="text-amber italic">educational content.</em>
          </h1>
          <p className="text-[14px] text-paper/45 leading-relaxed mb-10">
            Found an exceptional educational video that isn&apos;t on Weknoq yet?
            Submit it and we&apos;ll review it for inclusion.
          </p>

          {/* Success state */}
          {status === "success" ? (
            <div className="border border-sage/40 bg-sage/[0.08] p-8 text-center">
              <div className="text-3xl mb-4">✓</div>
              <h2 className="font-display text-xl font-semibold mb-2 text-sage">
                Submission received!
              </h2>
              <p className="text-[13px] text-paper/50 mb-6">
                Thank you for contributing. We review submissions manually and will
                add great videos to the library within a few days.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="text-[13px] text-amber border border-amber/30 px-6 py-2.5 hover:bg-amber/10 transition-colors"
              >
                Submit another video →
              </button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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

              {/* Error message */}
              {status === "error" && (
                <p className="text-[13px] text-rust border border-rust/30 bg-rust/[0.07] px-4 py-3">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-amber text-ink py-4 text-sm font-medium hover:bg-amber-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Submitting…" : "Submit Video →"}
              </button>
            </form>
          )}

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
