import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Sparkles, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { to: "/cars", label: "Cars" },
  { to: "/evs", label: "EVs" },
  { to: "/bikes", label: "Bikes" },
  { to: "/scooters", label: "Scooters" },
  { to: "/compare", label: "Compare" },
  { to: "/reviews", label: "Reviews" },
  { to: "/news", label: "News" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-2" : "py-4",
      )}
    >
      <nav className="container mx-auto max-w-7xl px-4 md:px-6 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-1.5 group">
          <span className="text-lg font-semibold tracking-tight">
            TECH<span className="text-primary">360</span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeProps={{ className: "text-foreground" }}
                className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/search">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">
              <User className="h-4 w-4" /> Login
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/ai">
              <Sparkles className="h-4 w-4" /> AI Assistant
            </Link>
          </Button>
        </div>

        <button
          className="lg:hidden grid place-items-center h-9 w-9 rounded-md border border-border"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border mt-2">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild className="flex-1">
                <Link to="/ai">AI Assistant</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
