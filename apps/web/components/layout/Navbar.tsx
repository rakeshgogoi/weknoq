"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-12 py-5 transition-all duration-300 ${
        scrolled
          ? "bg-ink/95 backdrop-blur-md border-b border-white/5"
          : "bg-gradient-to-b from-ink/95 to-transparent backdrop-blur-[2px]"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5">
        <div className="w-[34px] h-[34px] rounded-full border-2 border-amber flex items-center justify-center animate-spin-slow">
          <div className="w-2.5 h-2.5 bg-amber rounded-full" />
        </div>
        <span className="font-display font-bold text-xl tracking-[0.5px] text-paper">
          we<span className="text-amber">knoq</span>
        </span>
      </Link>

      {/* Links */}
      <ul className="hidden md:flex gap-9 list-none">
        {[
          { href: "/explore",   label: "Explore"   },
          { href: "/topics",    label: "Topics"    },
          { href: "/paths",     label: "Paths"     },
          { href: "/creators",  label: "Creators"  },
        ].map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-[13px] tracking-[1.5px] uppercase text-paper/60 hover:text-amber transition-colors font-normal"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Auth */}
      <div>
        {session ? (
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-[13px] text-paper/60 hover:text-amber transition-colors"
            >
              My Learning
            </Link>
            <button
              onClick={() => signOut()}
              className="text-[13px] text-paper/30 hover:text-paper/60 transition-colors"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="bg-amber text-ink text-[13px] font-medium px-6 py-2.5 tracking-[0.5px] hover:bg-amber-light transition-all duration-200 hover:-translate-y-px"
          >
            Start Learning
          </button>
        )}
      </div>
    </nav>
  );
}
