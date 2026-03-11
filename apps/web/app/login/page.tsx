/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  return (
    <div className="w-full max-w-md rounded-2xl border border-paper/10 bg-ink/40 p-6 shadow-xl">
      <h1 className="font-display text-3xl text-paper">Sign in</h1>
      <p className="mt-2 text-sm text-paper/70">
        Continue to Weknoq to save bookmarks, track progress, and build learning
        paths.
      </p>

      <button
        type="button"
        disabled={status === "loading"}
        onClick={() => signIn("google", { callbackUrl })}
        className="mt-6 w-full rounded-xl bg-paper px-4 py-3 text-ink font-medium hover:bg-paper/90 disabled:opacity-60"
      >
        Continue with Google
      </button>

      <p className="mt-4 text-xs text-paper/60">
        Having trouble? Try opening{" "}
        <a className="underline" href="/api/auth/signin">
          the default sign-in page
        </a>
        .
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <Suspense fallback={<div className="w-full max-w-md rounded-2xl border border-paper/10 bg-ink/40 p-6 shadow-xl animate-pulse h-48" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}

