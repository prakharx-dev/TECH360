import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { VehicleCard } from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { getVehicleBySlug, VEHICLES } from "@/data/vehicles";
import {
  Star,
  Heart,
  GitCompare,
  ArrowLeft,
  Zap,
  Check,
  Battery,
  Gauge,
  Users,
  ChevronRight,
  Settings,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/vehicles/$slug")({
  component: Detail,
  head: ({ params }) => ({ meta: [{ title: `${params.slug} — TECH360` }] }),
});

function Detail() {
  const { slug } = useParams({ from: "/vehicles/$slug" });
  const v = getVehicleBySlug(slug);

  if (!v)
    return (
      <PageShell>
        <div className="container mx-auto px-6 py-32 text-center">
          Vehicle not found.{" "}
          <Link to="/vehicles" className="text-primary hover:underline">
            Browse all
          </Link>
        </div>
      </PageShell>
    );

  const [activeImage, setActiveImage] = useState(v.images?.[0] || v.image);

  const similar = VEHICLES.filter((x) => x.id !== v.id && x.category === v.category).slice(0, 3);

  // Mock variants for the CarWale look
  const variants = [
    { name: "Standard Range / Base", price: v.price * 0.9, range: v.specs.range || "15 kmpl" },
    {
      name: v.name + " Excite",
      price: v.price,
      range: v.specs.range || "14 kmpl",
      isPopular: true,
    },
    {
      name: "Long Range / Top",
      price: v.price * 1.15,
      range: v.specs.range ? parseInt(v.specs.range) * 1.2 + " km" : "12 kmpl",
    },
  ];

  return (
    <PageShell>
      <div className="bg-muted/20 border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 py-6">
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to vehicles
          </Link>
        </div>
      </div>

      <section className="container mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10">
          {/* Media Section */}
          <div className="space-y-4">
            <div className="group rounded-xl overflow-hidden border border-border bg-card shadow-sm aspect-[16/10]">
              <img
                src={activeImage}
                alt={v.name}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="grid grid-cols-5 gap-2.5">
              {v.images.map((src, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(src)}
                  className={`aspect-[4/3] overflow-hidden rounded-lg border cursor-pointer transition-all duration-300 ${
                    activeImage === src
                      ? "border-primary ring-2 ring-primary/20 bg-background"
                      : "border-border bg-card hover:border-foreground/20"
                  }`}
                >
                  <img
                    src={src}
                    alt={`${v.name} view ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className={`h-full w-full object-cover transition-opacity duration-300 ${
                      activeImage === src ? "opacity-100" : "opacity-70 hover:opacity-100"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Key Info Section */}
          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{v.brand}</p>
              <div className="flex items-center gap-1 text-sm font-medium">
                <Star className="h-4 w-4 fill-foreground text-foreground" /> {v.rating}{" "}
                <span className="text-muted-foreground font-normal">({v.reviews} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold mt-2 tracking-tight">{v.name}</h1>
            <p className="text-muted-foreground mt-3 leading-relaxed">{v.tagline}</p>

            <div className="mt-8">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Price</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold">₹{v.price.toFixed(2)} Lakh</span>
                <span className="text-sm text-muted-foreground">Avg. Ex-Showroom price</span>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:underline mt-1 inline-block"
              >
                View On-Road Price in your city
              </button>
            </div>

            {/* CarWale Style Key Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Engine/Battery</p>
                  <p className="font-medium text-sm mt-0.5">{v.specs.engine || v.specs.battery}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                <Zap className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Power</p>
                  <p className="font-medium text-sm mt-0.5">{v.specs.power}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                <Gauge className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {v.isElectric ? "Range" : "Mileage"}
                  </p>
                  <p className="font-medium text-sm mt-0.5">{v.specs.range || v.specs.mileage}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Seating Capacity</p>
                  <p className="font-medium text-sm mt-0.5">{v.specs.seating || "5"} Seater</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button className="flex-1 h-12">Get Best Offers</Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 border-border hover:bg-muted shrink-0"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 border-border hover:bg-muted shrink-0"
                asChild
              >
                <Link to="/compare">
                  <GitCompare className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Variants Section */}
      <section className="bg-card border-y border-border py-16">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-8">Available Variants</h2>
          <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
            {variants.map((variant, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors"
              >
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    {variant.name}
                    {variant.isPopular && (
                      <span className="text-[10px] uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-sm">
                        Popular
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    ₹{variant.price.toFixed(2)} Lakh · {variant.range}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Explore
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stacked Specs / Features (Replaces Tabs) */}
      <section className="container mx-auto max-w-4xl px-4 md:px-6 py-16 space-y-16">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-8">Detailed Specifications</h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {Object.entries(v.specs).map(
              ([k, val]) =>
                val && (
                  <div
                    key={k}
                    className="grid grid-cols-2 px-6 py-4 text-sm hover:bg-muted/20 transition-colors"
                  >
                    <span className="text-muted-foreground capitalize">
                      {k.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="font-medium text-right md:text-left">{String(val)}</span>
                  </div>
                ),
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-6">Key Features</h2>
            <ul className="space-y-3">
              {v.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border text-sm"
                >
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="font-medium">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-6">Safety Equipment</h2>
            <ul className="space-y-3">
              {v.safety.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border text-sm"
                >
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="font-medium">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Pros & Cons</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary/10 text-primary grid place-items-center text-xs">
                  +
                </span>{" "}
                Things We Like
              </h4>
              <ul className="space-y-3 text-sm">
                {v.pros.map((p) => (
                  <li key={p} className="text-muted-foreground flex gap-2">
                    <span className="text-primary">•</span> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-destructive/10 text-destructive grid place-items-center text-xs">
                  -
                </span>{" "}
                Things To Improve
              </h4>
              <ul className="space-y-3 text-sm">
                {v.cons.map((p) => (
                  <li key={p} className="text-muted-foreground flex gap-2">
                    <span className="text-destructive">•</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/20 border-t border-border py-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Similar {v.category === "bike" || v.category === "scooter" ? "Bikes" : "Cars"}
            </h2>
            <Link
              to="/vehicles"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {similar.map((s, i) => (
              <VehicleCard key={s.id} vehicle={s} index={i} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
