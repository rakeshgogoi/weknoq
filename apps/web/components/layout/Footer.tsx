import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink/70">
      <div className="px-12 py-10 flex flex-col md:flex-row gap-8 md:items-center md:justify-between">
        <div>
          <Link href="/" className="font-display font-semibold tracking-wide">
            Weknoq
          </Link>
          <p className="mt-2 text-sm text-paper/50 max-w-md">
            The world&apos;s knowledge, finally looped together.
          </p>
        </div>

        <div className="flex gap-8 text-sm">
          <Link className="text-paper/50 hover:text-amber transition-colors" href="/search">
            Search
          </Link>
          <Link className="text-paper/50 hover:text-amber transition-colors" href="/api/auth/signin">
            Sign in
          </Link>
          <a
            className="text-paper/50 hover:text-amber transition-colors"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

