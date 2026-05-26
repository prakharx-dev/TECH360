import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin } from "lucide-react";

const COLS = [
  {
    title: "Explore",
    links: [
      ["Cars", "/cars"],
      ["EVs", "/evs"],
      ["Bikes", "/bikes"],
      ["Scooters", "/scooters"],
    ],
  },
  {
    title: "Tools",
    links: [
      ["Compare", "/compare"],
      ["AI Recommend", "/ai"],
      ["Search", "/search"],
      ["Reviews", "/reviews"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Newsroom", "/news"],
      ["Charging Map", "#"],
      ["EMI Calculator", "#"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "#"],
      ["Careers", "#"],
      ["Contact", "#"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          <div className="col-span-2">
            <Link to="/" className="inline-block">
              <span className="text-lg font-semibold tracking-tight">
                TECH<span className="text-primary">360</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
              The complete vehicle intelligence platform. Discover, compare, decide.
            </p>
            <div className="flex gap-2 mt-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid place-items-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-medium mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link
                      to={to as string}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <p className="text-xs text-muted-foreground">© 2026 TECH360</p>
          <div className="flex gap-5 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
