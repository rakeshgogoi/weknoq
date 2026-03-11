import Link from "next/link";

const COLS = [
  {
    heading: "Explore",
    links: [
      { label: "All Topics",       href: "/topics"   },
      { label: "Learning Paths",   href: "/paths"    },
      { label: "Featured Videos",  href: "/explore"  },
      { label: "Creators",         href: "/creators" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "About",             href: "/about"    },
      { label: "Submit Video",      href: "/submit"   },
      { label: "Takedown Request",  href: "/takedown" },
      { label: "API",               href: "/api-docs" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms of Service",  href: "/terms"    },
      { label: "Privacy Policy",    href: "/privacy"  },
      { label: "Copyright",         href: "/copyright"},
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-paper/[0.06] pt-12 pb-8 px-12">
      {/* Top grid */}
      <div className="grid gap-12 mb-12" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
        {/* Brand */}
        <div className="footer-brand">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-full border-2 border-amber flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-amber rounded-full" />
            </div>
            <span className="font-display font-bold text-xl tracking-[0.5px] text-paper">
              we<span className="text-amber">knoq</span>
            </span>
          </Link>
          <p className="text-[13px] text-paper/40 leading-[1.7] mt-3.5 max-w-[260px]">
            A curated aggregator of the internet&apos;s best educational videos.
            One place. All knowledge.
          </p>
        </div>

        {/* Link columns */}
        {COLS.map((col) => (
          <div key={col.heading}>
            <h4 className="text-[11px] tracking-[2px] uppercase text-paper/30 mb-4 font-normal">
              {col.heading}
            </h4>
            <ul className="flex flex-col gap-2.5 list-none">
              {col.links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[13px] text-paper/50 hover:text-amber transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-paper/[0.06] pt-6 flex items-center justify-between">
        <p className="text-[12px] text-paper/25">
          © 2025 Weknoq. All videos belong to their respective creators and platforms.
        </p>
        <p className="font-mono text-[11px] text-paper/15">v0.1.0 — MVP</p>
      </div>
    </footer>
  );
}
