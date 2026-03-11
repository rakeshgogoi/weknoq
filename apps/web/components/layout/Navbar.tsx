"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/explore",  label: "Explore"  },
  { href: "/topics",   label: "Topics"   },
  { href: "/paths",    label: "Paths"    },
  { href: "/creators", label: "Creators" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [scrolled,    setScrolled]   = useState(false);
  const [menuOpen,    setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change / outside click
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 sm:px-8 md:px-12 py-4 md:py-5 transition-all duration-300 ${
          scrolled || menuOpen
            ? "bg-ink/95 backdrop-blur-md border-b border-white/5"
            : "bg-gradient-to-b from-ink/95 to-transparent backdrop-blur-[2px]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 z-10">
          <div className="w-[34px] h-[34px] rounded-full border-2 border-amber flex items-center justify-center animate-spin-slow">
            <div className="w-2.5 h-2.5 bg-amber rounded-full" />
          </div>
          <span className="font-display font-bold text-xl tracking-[0.5px] text-paper">
            we<span className="text-amber">knoq</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-9 list-none">
          {NAV_LINKS.map(({ href, label }) => (
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

        {/* Desktop auth */}
        <div className="hidden md:block" suppressHydrationWarning>
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

        {/* Mobile: hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 z-10"
          aria-label="Toggle menu"
          onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
        >
          <span
            className={`block w-6 h-[2px] bg-paper/70 transition-all duration-300 origin-center ${
              menuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-paper/70 transition-all duration-300 ${
              menuOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-paper/70 transition-all duration-300 origin-center ${
              menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu drawer */}
      <div
        className={`fixed top-0 left-0 right-0 z-[99] bg-ink/98 backdrop-blur-md pt-20 pb-8 px-6 transition-all duration-300 md:hidden ${
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="flex flex-col gap-1 mb-8">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block text-[16px] tracking-[1px] uppercase text-paper/70 hover:text-amber transition-colors py-3 border-b border-paper/[0.06]"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile auth */}
        <div suppressHydrationWarning>
          {session ? (
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-[14px] text-paper/60 hover:text-amber transition-colors"
              >
                My Learning →
              </Link>
              <button
                onClick={() => { signOut(); setMenuOpen(false); }}
                className="text-left text-[14px] text-paper/30 hover:text-paper/60 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => { signIn("google"); setMenuOpen(false); }}
              className="w-full bg-amber text-ink text-[13px] font-medium px-6 py-3.5 tracking-[0.5px] hover:bg-amber-light transition-all"
            >
              Start Learning →
            </button>
          )}
        </div>
      </div>
    </>
  );
}
