import { Link } from "@tanstack/react-router";
import { Star, Zap, Settings, Gauge, Users, ArrowRight } from "lucide-react";
import type { Vehicle } from "@/data/vehicles";
import { Button } from "@/components/ui/button";

export function VehicleCard({
  vehicle,
  index = 0,
  viewMode = "grid",
}: {
  vehicle: Vehicle;
  index?: number;
  viewMode?: "grid" | "list";
}) {
  const v = vehicle;

  if (viewMode === "list") {
    return (
      <div
        className="animate-fade-up opacity-0"
        style={{ animationDelay: `${(index % 8) * 30}ms`, animationFillMode: "forwards" }}
      >
        <div className="group relative flex flex-col sm:flex-row rounded-xl border border-border bg-card overflow-hidden hover:border-foreground/20 transition-all duration-300">
          <div className="relative w-full sm:w-[280px] md:w-[320px] shrink-0 bg-secondary overflow-hidden">
            <Link to="/vehicles/$slug" params={{ slug: v.slug }} className="block h-full">
              <img
                src={v.image}
                alt={v.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover aspect-[16/10] sm:aspect-auto transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              {v.isElectric && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background/90 backdrop-blur-sm text-foreground text-[11px] font-medium border border-border shadow-sm">
                  <Zap className="h-3 w-3 text-primary" /> EV
                </span>
              )}
            </Link>
          </div>

          <div className="p-5 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">
                    {v.brand}
                  </p>
                  <Link to="/vehicles/$slug" params={{ slug: v.slug }}>
                    <h3 className="text-xl font-semibold mt-0.5 group-hover:text-primary transition-colors">
                      {v.name}
                    </h3>
                  </Link>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border">
                  <Star className="h-3 w-3 text-primary" />
                  <span className="text-foreground font-medium">{v.rating}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-1">{v.tagline}</p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                <div>
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Settings className="h-3.5 w-3.5" />
                    <span className="text-[11px] uppercase tracking-wider">Engine</span>
                  </div>
                  <p className="text-sm font-medium">{v.specs.engine || v.specs.battery || "—"}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Zap className="h-3.5 w-3.5" />
                    <span className="text-[11px] uppercase tracking-wider">Power</span>
                  </div>
                  <p className="text-sm font-medium">{v.specs.power}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Gauge className="h-3.5 w-3.5" />
                    <span className="text-[11px] uppercase tracking-wider">
                      {v.isElectric ? "Range" : "Mileage"}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{v.specs.range || v.specs.mileage || "—"}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Users className="h-3.5 w-3.5" />
                    <span className="text-[11px] uppercase tracking-wider">Seating</span>
                  </div>
                  <p className="text-sm font-medium">{v.specs.seating || "5"} Seater</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-2xl font-semibold">₹{v.price.toFixed(2)} Lakh</span>
                <p className="text-xs text-muted-foreground mt-0.5">Avg. Ex-Showroom price</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 sm:flex-none">
                  Get Offers
                </Button>
                <Button asChild className="flex-1 sm:flex-none group/btn">
                  <Link to="/vehicles/$slug" params={{ slug: v.slug }}>
                    View Details{" "}
                    <ArrowRight className="h-4 w-4 ml-1.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="animate-fade-up opacity-0 h-full"
      style={{ animationDelay: `${(index % 8) * 40}ms`, animationFillMode: "forwards" }}
    >
      <Link
        to="/vehicles/$slug"
        params={{ slug: v.slug }}
        className="group relative flex flex-col h-full rounded-xl border border-border bg-card overflow-hidden hover:border-foreground/20 transition-all duration-300 hover:-translate-y-1"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-secondary shrink-0">
          <img
            src={v.image}
            alt={v.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
          {v.isElectric && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background/80 backdrop-blur-sm text-foreground text-[11px] font-medium border border-border">
              <Zap className="h-3 w-3 text-primary" /> EV
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">{v.brand}</p>
              <h3 className="text-base font-semibold mt-0.5 group-hover:text-primary transition-colors">
                {v.name}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 text-primary" />
              <span className="text-foreground font-medium">{v.rating}</span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Starting</p>
              <p className="font-semibold">₹{v.price.toFixed(2)}L</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-0.5">
                {v.isElectric ? "Range" : "Mileage"}
              </p>
              <p className="font-medium">{v.specs.range ?? v.specs.mileage}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
