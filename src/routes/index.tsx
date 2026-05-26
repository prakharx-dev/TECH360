import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  GitCompare,
  Zap,
  Gauge,
  Battery,
  ShieldCheck,
  Cpu,
  ChevronRight,
  Star,
  TrendingUp,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { VehicleCard } from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { VEHICLES, CATEGORIES, NEWS, REVIEWS } from "@/data/vehicles";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "TECH360 — The Future of Mobility, Decoded" },
      {
        name: "description",
        content:
          "Discover vehicles, compare specs, read reviews, and get AI-powered recommendations across cars, EVs, bikes and scooters.",
      },
    ],
  }),
});

function Home() {
  const trendingCars = VEHICLES.filter((v) => v.category === "car" || v.category === "ev").slice(
    0,
    3,
  );
  const trendingBikes = VEHICLES.filter(
    (v) => v.category === "bike" || v.category === "scooter",
  ).slice(0, 3);
  return (
    <PageShell>
      <Hero />
      <FindYourVehicleWidget />
      <Trending cars={trendingCars} bikes={trendingBikes} />
      <Categories />
      <FeaturedComparison />
      <AISection />
      <LatestNews />
      <Community />
      <FuturePlaceholders />
    </PageShell>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted/30 to-background">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 pt-12 pb-24 md:pt-16 md:pb-32 relative z-10">
        <div className="flex flex-col items-center text-center animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/40 text-muted-foreground text-xs font-medium mb-6 tracking-wide backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
            India's Most Trusted Auto Portal
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight max-w-5xl leading-[1.1] md:leading-[1.05]">
            <span className="block bg-gradient-to-r from-foreground via-foreground to-foreground/75 bg-clip-text text-transparent">
              Find the Right Vehicle.
            </span>
            <span className="block mt-1 bg-gradient-to-r from-primary via-primary/90 to-primary/60 bg-clip-text text-transparent">
              Make the Right Choice.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground/90 leading-relaxed font-sans">
            Compare{" "}
            <span className="text-foreground/90 font-semibold transition-colors hover:text-primary cursor-default">
              on-road prices
            </span>
            , explore{" "}
            <span className="text-foreground/90 font-semibold transition-colors hover:text-primary cursor-default">
              features
            </span>
            , and read{" "}
            <span className="text-foreground/90 font-semibold transition-colors hover:text-primary cursor-default">
              expert reviews
            </span>{" "}
            to find the perfect car or bike for your lifestyle.
          </p>
        </div>
      </div>
    </section>
  );
}

function FindYourVehicleWidget() {
  const [activeTab, setActiveTab] = useState<"budget" | "brand" | "body">("budget");

  const budgets = [
    { label: "Under ₹10 Lakh", max: 10 },
    { label: "₹10 - ₹20 Lakh", max: 20 },
    { label: "₹20 - ₹50 Lakh", max: 50 },
    { label: "Above ₹50 Lakh", max: 200 },
  ];

  const brands = [
    "Tata",
    "Mahindra",
    "Maruti Suzuki",
    "Toyota",
    "Hyundai",
    "Royal Enfield",
    "Ola",
    "Ather",
  ];

  const bodyTypes = [
    { name: "SUV", icon: "🚙" },
    { name: "Sedan", icon: "🚗" },
    { name: "Sports", icon: "🏎️" },
    { name: "Hatchback", icon: "🚙" },
    { name: "Adventure", icon: "🏍️" },
    { name: "Electric", icon: "⚡" },
  ];

  return (
    <section className="container mx-auto max-w-4xl px-4 md:px-6 -mt-12 relative z-10">
      <div
        className="rounded-xl border border-border bg-card shadow-lg overflow-hidden animate-fade-up"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex border-b border-border overflow-x-auto">
          {[
            { id: "budget", label: "By Budget" },
            { id: "brand", label: "By Brand" },
            { id: "body", label: "By Body Type" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap px-4 ${
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6 md:p-8">
          {activeTab === "budget" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {budgets.map((b) => (
                <Link
                  key={b.label}
                  to="/vehicles"
                  search={{ maxPrice: b.max } as any}
                  className="p-4 rounded-lg border border-border text-center hover:border-foreground/20 hover:bg-muted/30 transition-all font-medium text-sm"
                >
                  {b.label}
                </Link>
              ))}
            </div>
          )}
          {activeTab === "brand" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {brands.map((brand) => (
                <Link
                  key={brand}
                  to="/vehicles"
                  search={{ brand: brand.toLowerCase() } as any}
                  className="p-4 rounded-lg border border-border text-center hover:border-foreground/20 hover:bg-muted/30 transition-all font-medium text-sm"
                >
                  {brand}
                </Link>
              ))}
            </div>
          )}
          {activeTab === "body" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {bodyTypes.map((body) => (
                <Link
                  key={body.name}
                  to="/vehicles"
                  search={{ bodyType: body.name.toLowerCase() } as any}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border text-center hover:border-foreground/20 hover:bg-muted/30 transition-all font-medium text-sm"
                >
                  <span className="text-2xl">{body.icon}</span>
                  {body.name}
                </Link>
              ))}
            </div>
          )}
          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline" className="px-8">
              <Link to="/search">
                Advanced Search <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  link,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  link?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-8 gap-4">
      <div>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">{eyebrow}</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">{title}</h2>
      </div>
      {link && (
        <Link
          to={link}
          className="text-sm font-medium text-primary hover:underline flex items-center gap-1 shrink-0 transition-colors"
        >
          {linkLabel ?? "View all"} <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function Trending({ cars, bikes }: { cars: typeof VEHICLES; bikes: typeof VEHICLES }) {
  const [activeTab, setActiveTab] = useState<"cars" | "bikes">("cars");
  const vehicles = activeTab === "cars" ? cars : bikes;

  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-6 py-20">
      <SectionHeader eyebrow="Trending Now" title="Popular right now" link="/vehicles" />
      <div className="flex gap-2 mb-6 border-b border-border pb-px">
        <button
          onClick={() => setActiveTab("cars")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors px-2 ${
            activeTab === "cars"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Cars & SUVs
        </button>
        <button
          onClick={() => setActiveTab("bikes")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors px-2 ${
            activeTab === "bikes"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Bikes & Scooters
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {vehicles.map((v, i) => (
          <VehicleCard key={v.id} vehicle={v} index={i} />
        ))}
      </div>
    </section>
  );
}

const CATEGORY_ICONS: Record<string, (className?: string) => React.ReactNode> = {
  cars: (className) => (
    <svg
      viewBox="0 0 100 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* Car body outline */}
      <path
        d="M 5 45 C 5 45 15 45 18 42 C 22 35 30 25 45 25 C 60 25 65 32 75 35 C 85 37 92 40 95 45 M 5 45 H 20 M 35 45 H 65 M 80 45 H 95"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Windshield */}
      <path d="M 40 27 C 40 27 55 27 60 33 L 64 36" strokeDasharray="1 1" />
      {/* Wheels */}
      <circle
        cx="27.5"
        cy="45"
        r="7.5"
        fill="none"
        strokeWidth="2"
        className="group-hover:animate-[spin_3s_linear_infinite]"
        style={{ transformOrigin: "27.5px 45px" }}
      />
      <circle cx="27.5" cy="45" r="2.5" fill="currentColor" />
      <circle
        cx="72.5"
        cy="45"
        r="7.5"
        fill="none"
        strokeWidth="2"
        className="group-hover:animate-[spin_3s_linear_infinite]"
        style={{ transformOrigin: "72.5px 45px" }}
      />
      <circle cx="72.5" cy="45" r="2.5" fill="currentColor" />
      {/* Headlight beam */}
      <path
        d="M 94 40 L 98 42 L 94 44 Z"
        fill="none"
        className="group-hover:fill-emerald-400 group-hover:stroke-emerald-400 transition-all duration-300 opacity-0 group-hover:opacity-100"
      />
      <path
        d="M 98 42 L 112 35 M 98 42 L 112 49"
        className="stroke-emerald-400/50 opacity-0 group-hover:opacity-100 transition-all duration-500 stroke-[1]"
      />
    </svg>
  ),
  evs: (className) => (
    <svg
      viewBox="0 0 100 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* Car body outline */}
      <path
        d="M 5 45 C 5 45 15 45 18 42 C 22 35 30 25 45 25 C 60 25 65 32 75 35 C 85 37 92 40 95 45 M 5 45 H 20 M 35 45 H 65 M 80 45 H 95"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Lightning bolt inside body */}
      <path
        d="M 46 30 L 41 36 H 48 L 43 42"
        className="stroke-cyan-400 group-hover:animate-pulse"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wheels */}
      <circle
        cx="27.5"
        cy="45"
        r="7.5"
        fill="none"
        strokeWidth="2"
        className="group-hover:animate-[spin_3s_linear_infinite]"
        style={{ transformOrigin: "27.5px 45px" }}
      />
      <circle cx="27.5" cy="45" r="2.5" fill="currentColor" />
      <circle
        cx="72.5"
        cy="45"
        r="7.5"
        fill="none"
        strokeWidth="2"
        className="group-hover:animate-[spin_3s_linear_infinite]"
        style={{ transformOrigin: "72.5px 45px" }}
      />
      <circle cx="72.5" cy="45" r="2.5" fill="currentColor" />
      {/* Headlight beam */}
      <path
        d="M 94 40 L 98 42 L 94 44 Z"
        fill="none"
        className="group-hover:fill-cyan-400 group-hover:stroke-cyan-400 transition-all duration-300 opacity-0 group-hover:opacity-100"
      />
      <path
        d="M 98 42 L 112 35 M 98 42 L 112 49"
        className="stroke-cyan-400/50 opacity-0 group-hover:opacity-100 transition-all duration-500 stroke-[1]"
      />
    </svg>
  ),
  bikes: (className) => (
    <svg
      viewBox="0 0 100 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* Frame / Body */}
      <path d="M 22 45 L 35 30 H 60 L 70 45" strokeWidth="2" strokeLinecap="round" />
      <path d="M 35 30 L 45 15 H 55 L 50 30" strokeWidth="2" strokeLinecap="round" />
      {/* Wheels */}
      <circle
        cx="22"
        cy="45"
        r="9"
        fill="none"
        strokeWidth="2"
        className="group-hover:animate-[spin_3s_linear_infinite]"
        style={{ transformOrigin: "22px 45px" }}
      />
      <circle cx="22" cy="45" r="3" fill="currentColor" />
      <circle
        cx="70"
        cy="45"
        r="9"
        fill="none"
        strokeWidth="2"
        className="group-hover:animate-[spin_3s_linear_infinite]"
        style={{ transformOrigin: "70px 45px" }}
      />
      <circle cx="70" cy="45" r="3" fill="currentColor" />
      {/* Glowing headlight */}
      <path
        d="M 70 30 L 75 32 L 72 34 Z"
        fill="none"
        className="group-hover:fill-orange-400 group-hover:stroke-orange-400 transition-all duration-300 opacity-0 group-hover:opacity-100"
      />
      <path
        d="M 75 32 L 90 27 M 75 32 L 90 37"
        className="stroke-orange-400/50 opacity-0 group-hover:opacity-100 transition-all duration-500 stroke-[1]"
      />
    </svg>
  ),
  "electric-bikes": (className) => (
    <svg
      viewBox="0 0 100 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* E-Bike body outline */}
      <path d="M 25 45 L 40 32 H 58 L 68 45" strokeWidth="2" strokeLinecap="round" />
      {/* Battery box in center */}
      <rect
        x="42"
        y="34"
        width="13"
        height="9"
        rx="2"
        className="stroke-lime-400 group-hover:fill-lime-400/10 transition-colors"
      />
      <path d="M 46 38 H 51" className="stroke-lime-400" strokeWidth="2" />
      {/* Wheels */}
      <circle
        cx="25"
        cy="45"
        r="8"
        fill="none"
        strokeWidth="2"
        className="group-hover:animate-[spin_3s_linear_infinite]"
        style={{ transformOrigin: "25px 45px" }}
      />
      <circle cx="25" cy="45" r="2" fill="currentColor" />
      <circle
        cx="68"
        cy="45"
        r="8"
        fill="none"
        strokeWidth="2"
        className="group-hover:animate-[spin_3s_linear_infinite]"
        style={{ transformOrigin: "68px 45px" }}
      />
      <circle cx="68" cy="45" r="2" fill="currentColor" />
      {/* Glowing headlight */}
      <path
        d="M 68 33 L 73 35 L 70 37 Z"
        fill="none"
        className="group-hover:fill-lime-400 group-hover:stroke-lime-400 transition-all duration-300 opacity-0 group-hover:opacity-100"
      />
      <path
        d="M 73 35 L 88 30 M 73 35 L 88 40"
        className="stroke-lime-400/50 opacity-0 group-hover:opacity-100 transition-all duration-500 stroke-[1]"
      />
    </svg>
  ),
  scooters: (className) => (
    <svg
      viewBox="0 0 100 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* Scooter Body outline */}
      <path
        d="M 15 45 C 15 45 25 45 28 38 C 30 33 32 25 35 25 C 40 25 45 35 55 35 H 68 C 72 35 76 40 78 45"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M 68 35 L 62 18 C 62 18 64 12 70 12" strokeWidth="2" strokeLinecap="round" />
      {/* Wheels */}
      <circle
        cx="20"
        cy="45"
        r="7.5"
        fill="none"
        strokeWidth="2"
        className="group-hover:animate-[spin_3s_linear_infinite]"
        style={{ transformOrigin: "20px 45px" }}
      />
      <circle
        cx="75"
        cy="45"
        r="7.5"
        fill="none"
        strokeWidth="2"
        className="group-hover:animate-[spin_3s_linear_infinite]"
        style={{ transformOrigin: "75px 45px" }}
      />
      {/* Seat */}
      <path d="M 44 28 C 44 28 55 25 64 30 L 66 33" strokeWidth="2" strokeLinecap="round" />
      {/* Headlight beam */}
      <circle
        cx="72"
        cy="12"
        r="2.5"
        fill="none"
        className="group-hover:fill-pink-400 group-hover:stroke-pink-400 transition-all duration-300 opacity-0 group-hover:opacity-100"
      />
      <path
        d="M 74 12 L 88 8 M 74 12 L 88 16"
        className="stroke-pink-400/50 opacity-0 group-hover:opacity-100 transition-all duration-500 stroke-[1]"
      />
    </svg>
  ),
  suvs: (className) => (
    <svg
      viewBox="0 0 100 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* Tough boxy chassis */}
      <path d="M 5 45 H 18 M 34 45 H 64 M 80 45 H 95" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M 5 45 V 36 L 15 32 L 30 32 L 40 18 H 75 L 85 30 L 95 34 V 45"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Spare tire on back */}
      <rect
        x="-1"
        y="25"
        width="6"
        height="12"
        rx="1"
        fill="none"
        strokeWidth="1.5"
        className="translate-x-1"
      />
      {/* Wheels */}
      <circle
        cx="26"
        cy="45"
        r="8"
        fill="none"
        strokeWidth="2"
        className="group-hover:animate-[spin_3s_linear_infinite]"
        style={{ transformOrigin: "26px 45px" }}
      />
      <circle cx="26" cy="45" r="2.5" fill="currentColor" />
      <circle
        cx="72"
        cy="45"
        r="8"
        fill="none"
        strokeWidth="2"
        className="group-hover:animate-[spin_3s_linear_infinite]"
        style={{ transformOrigin: "72px 45px" }}
      />
      <circle cx="72" cy="45" r="2.5" fill="currentColor" />
      {/* High headlights */}
      <path
        d="M 94 33 L 98 35 L 94 37 Z"
        fill="none"
        className="group-hover:fill-blue-400 group-hover:stroke-blue-400 transition-all duration-300 opacity-0 group-hover:opacity-100"
      />
      <path
        d="M 98 35 L 112 28 M 98 35 L 112 42"
        className="stroke-blue-400/50 opacity-0 group-hover:opacity-100 transition-all duration-500 stroke-[1]"
      />
    </svg>
  ),
  luxury: (className) => (
    <svg
      viewBox="0 0 100 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* Outer crown shield */}
      <path
        d="M 50 10 L 80 20 V 38 C 80 48 65 54 50 56 C 35 54 20 48 20 38 V 20 Z"
        strokeWidth="2"
        className="group-hover:stroke-violet-400 transition-all duration-500"
        strokeLinejoin="round"
      />
      {/* Diamond lines inside */}
      <path
        d="M 50 10 L 50 56 M 50 10 L 35 25 L 50 38 L 65 25 Z"
        className="group-hover:stroke-violet-300 transition-all duration-300"
        strokeWidth="1"
      />
      <path
        d="M 20 20 L 35 25 H 65 L 80 20"
        className="group-hover:stroke-violet-300 transition-all duration-300"
        strokeWidth="1"
      />
      {/* Sparkle effects */}
      <circle
        cx="30"
        cy="15"
        r="1.5"
        className="fill-violet-400 animate-ping opacity-0 group-hover:opacity-100 transition-all"
      />
      <circle
        cx="70"
        cy="42"
        r="1.5"
        className="fill-violet-400 animate-ping opacity-0 group-hover:opacity-100 transition-all [animation-delay:0.5s]"
      />
    </svg>
  ),
  upcoming: (className) => (
    <svg
      viewBox="0 0 100 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* Ellipse orbit path */}
      <ellipse
        cx="50"
        cy="30"
        rx="38"
        ry="14"
        strokeWidth="1.5"
        className="stroke-teal-400/50 group-hover:animate-[spin_8s_linear_infinite]"
        style={{ transformOrigin: "50px 30px" }}
      />
      {/* Inner core futuristic capsule */}
      <rect
        x="36"
        y="20"
        width="28"
        height="18"
        rx="9"
        strokeWidth="2"
        className="group-hover:stroke-teal-300 transition-all duration-500 fill-card/80"
      />
      {/* Glass reflection path */}
      <path d="M 41 24 C 41 24 50 21 59 24" className="stroke-teal-300/40" strokeLinecap="round" />
      {/* Little orbit dot */}
      <circle cx="15" cy="30" r="3" className="fill-teal-400 animate-pulse" />
    </svg>
  ),
};

function Categories() {
  return (
    <section className="relative overflow-hidden py-24 bg-muted/10 border-y border-border/80">
      {/* Decorative background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex items-start gap-4">
            {/* High-tech rotating portal logo */}
            <div className="relative h-14 w-14 flex items-center justify-center shrink-0 rounded-xl bg-card border border-border/80 shadow-md">
              {/* Inner glowing pulsing circle */}
              <div className="absolute inset-1 rounded-lg border border-primary/20 bg-primary/5 animate-pulse" />
              {/* Concentric spinning rings */}
              <svg
                viewBox="0 0 100 100"
                className="absolute h-10 w-10 animate-[spin_10s_linear_infinite] text-primary/40"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray="10 8"
                  fill="none"
                />
              </svg>
              <svg
                viewBox="0 0 100 100"
                className="absolute h-7 w-7 animate-[spin_6s_linear_reverse_infinite] text-primary/60"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  fill="none"
                />
              </svg>
              {/* Central high-tech crosshair */}
              <svg viewBox="0 0 100 100" className="absolute h-5 w-5 text-primary">
                <path
                  d="M 50 15 V 85 M 15 50 H 85"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                />
              </svg>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-semibold uppercase tracking-wider mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                Categories
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                Browse by category
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Explore curated categories and filter exactly what fits your drive.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((c, i) => (
            <div
              key={c.id}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: "forwards" }}
            >
              <Link
                to="/vehicles"
                search={{ category: c.id } as never}
                className="group relative block rounded-xl border border-border/80 bg-card/40 backdrop-blur-md p-6 hover:border-foreground/20 hover:bg-muted/40 transition-all duration-300 shadow-sm overflow-hidden"
              >
                {/* Colored neon glowing backdrop */}
                <div
                  className={`absolute -inset-px rounded-xl bg-gradient-to-br ${c.accent} opacity-0 group-hover:opacity-100 transition-all duration-500 blur-[12px] -z-10`}
                />
                {/* Visual shine card overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative">
                  {/* Model count pill */}
                  <div className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full border border-border/60 bg-muted/30 text-[9px] font-semibold text-muted-foreground group-hover:border-foreground/20 group-hover:text-foreground transition-all">
                    {c.count} models
                  </div>

                  {/* Aesthetic Vector SVG Logo */}
                  <div className="h-16 w-16 mb-4 flex items-center justify-center rounded-lg bg-muted/40 border border-border/50 text-muted-foreground group-hover:text-foreground group-hover:border-foreground/10 group-hover:bg-background/80 transition-all duration-300">
                    {CATEGORY_ICONS[c.id]
                      ? CATEGORY_ICONS[c.id]("h-12 w-12 transition-all duration-300")
                      : null}
                  </div>

                  <h3 className="mt-4 font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1 group-hover:text-muted-foreground/80 transition-colors">
                    {c.description}
                  </p>

                  <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-primary/80 group-hover:text-primary transition-colors">
                    <span>Explore</span>
                    <span className="transform translate-x-0 group-hover:translate-x-1.5 transition-transform duration-300">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedComparison() {
  const a = VEHICLES.find((v) => v.id === "e1") || VEHICLES[25];
  const b = VEHICLES.find((v) => v.id === "e2") || VEHICLES[26];
  const rows = [
    ["Price", `₹${a.price.toFixed(2)} Lakh`, `₹${b.price.toFixed(2)} Lakh`],
    ["Range", a.specs.range || a.specs.mileage, b.specs.range || b.specs.mileage],
    ["Power", a.specs.power, b.specs.power],
    ["Top Speed", a.specs.topSpeed, b.specs.topSpeed],
    ["Battery", a.specs.battery || "—", b.specs.battery || "—"],
  ];
  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-6 py-20">
      <SectionHeader
        eyebrow="Side-by-side"
        title="Featured comparison"
        link="/compare"
        linkLabel="Compare your own"
      />
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-border">
          {[a, b].map((v) => (
            <div key={v.id} className="p-6">
              <img
                src={v.image}
                alt={v.name}
                loading="lazy"
                decoding="async"
                className="rounded-lg aspect-[16/10] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-4">
                {v.brand}
              </p>
              <h3 className="text-xl font-semibold mt-1">{v.name}</h3>
            </div>
          ))}
        </div>
        <div className="border-t border-border">
          {rows.map(([label, av, bv]) => {
            const aWins = String(av).length >= String(bv).length;
            return (
              <div
                key={label}
                className="grid grid-cols-[1fr_auto_1fr] items-center text-sm border-t border-border first:border-t-0"
              >
                <div className={`p-4 ${aWins ? "font-medium" : "text-muted-foreground"}`}>{av}</div>
                <div className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground border-x border-border bg-muted/20">
                  {label}
                </div>
                <div
                  className={`p-4 text-right ${!aWins ? "font-medium" : "text-muted-foreground"}`}
                >
                  {bv}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AISection() {
  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-6 py-20 bg-muted/20 border-y border-border">
      <div className="rounded-xl border border-border bg-card p-8 md:p-14">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5" /> AI Recommendation Engine
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight leading-tight">
              Tell us what you need.
              <br />
              We match the perfect vehicle.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md">
              Budget, daily usage, family size, driving style — our AI analyses thousands of
              vehicles and recommends what truly fits your life.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link to="/ai">
                <Sparkles className="h-4 w-4" /> Start AI Assistant
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { label: "Budget", value: "₹25L – ₹40L", icon: TrendingUp },
              { label: "Usage", value: "City + Weekend trips", icon: Gauge },
              { label: "Preference", value: "Electric, 5 seater", icon: Battery },
              { label: "Driving style", value: "Comfort + Performance", icon: ShieldCheck },
            ].map((row, i) => (
              <div
                key={row.label}
                className="flex items-center gap-4 rounded-lg border border-border bg-background p-4 animate-fade-up opacity-0"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
              >
                <div className="h-10 w-10 rounded-md bg-muted text-muted-foreground grid place-items-center">
                  <row.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{row.label}</p>
                  <p className="text-sm font-medium mt-0.5">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LatestNews() {
  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-6 py-20">
      <SectionHeader eyebrow="Newsroom" title="Latest mobility news" link="/news" />
      <div className="grid md:grid-cols-3 gap-5">
        {NEWS.slice(0, 3).map((n, i) => (
          <article
            key={n.id}
            className="group rounded-xl border border-border bg-card overflow-hidden hover:border-foreground/20 transition-all animate-fade-up opacity-0"
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={
                  n.relatedVehicleId
                    ? (VEHICLES.find((v) => v.id === n.relatedVehicleId)?.image ?? n.image)
                    : n.image
                }
                alt={n.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{n.category}</span>
                <span>•</span>
                <span>{n.readTime}</span>
              </div>
              <h3 className="text-lg font-semibold mt-2 leading-snug group-hover:text-primary transition-colors">
                {n.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-3">{n.date}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Community() {
  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-6 py-20 bg-muted/20 border-y border-border">
      <SectionHeader eyebrow="Community" title="Real reviews from real drivers" link="/reviews" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {REVIEWS.map((r, i) => (
          <div
            key={r.id}
            className="rounded-xl border border-border bg-card p-5 animate-fade-up opacity-0"
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star
                  key={k}
                  className={`h-3.5 w-3.5 ${k < r.rating ? "fill-foreground text-foreground" : "text-muted"}`}
                />
              ))}
            </div>
            <h4 className="font-semibold mt-3">{r.title}</h4>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{r.body}</p>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
              <span className="font-medium">{r.user}</span>
              <span className="text-muted-foreground">{r.vehicle}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FuturePlaceholders() {
  const items = [
    { icon: Zap, title: "Charging station finder", desc: "Real-time EV charging maps" },
    { icon: GitCompare, title: "Vehicle marketplace", desc: "Buy & sell directly" },
    { icon: ShieldCheck, title: "Insurance compare", desc: "Best policies in seconds" },
    { icon: Gauge, title: "EMI calculator", desc: "Plan your purchase" },
    { icon: Cpu, title: "AI chatbot", desc: "24/7 assistant" },
    { icon: Sparkles, title: "AR preview", desc: "See cars in your driveway" },
  ];
  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-6 py-20">
      <SectionHeader eyebrow="Roadmap" title="Coming next to TECH360" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.title} className="rounded-xl border border-border bg-card p-6">
            <div className="h-10 w-10 rounded-md bg-muted text-muted-foreground grid place-items-center">
              <it.icon className="h-4 w-4" />
            </div>
            <h4 className="font-semibold mt-4">{it.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{it.desc}</p>
            <span className="inline-block mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
              Soon
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
