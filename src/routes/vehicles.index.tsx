import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { VehicleCard } from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VEHICLES, type VehicleCategory } from "@/data/vehicles";
import { Filter, LayoutGrid, List, Search, X } from "lucide-react";

type SearchParams = {
  category?: string;
  q?: string;
  brand?: string;
  bodyType?: string;
  fuel?: string;
  maxPrice?: number;
};

export const Route = createFileRoute("/vehicles/")({
  component: Vehicles,
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    category: typeof s.category === "string" ? s.category : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
    brand: typeof s.brand === "string" ? s.brand : undefined,
    bodyType: typeof s.bodyType === "string" ? s.bodyType : undefined,
    fuel: typeof s.fuel === "string" ? s.fuel : undefined,
    maxPrice: typeof s.maxPrice === "number" ? s.maxPrice : !isNaN(Number(s.maxPrice)) ? Number(s.maxPrice) : undefined,
  }),
  head: () => ({ meta: [{ title: "Find Vehicles — TECH360" }] }),
});

const CATEGORY_MAP: Record<string, VehicleCategory | undefined> = {
  cars: "car",
  evs: "ev",
  bikes: "bike",
  scooters: "scooter",
};

// Generate unique options for filters
const BRANDS = Array.from(new Set(VEHICLES.map(v => v.brand))).sort();
const BODY_TYPES = Array.from(new Set(VEHICLES.map(v => v.bodyType))).sort();
const FUEL_TYPES = Array.from(new Set(VEHICLES.map(v => v.isElectric ? 'Electric' : v.specs.fuel).filter(Boolean))).sort();
const BUDGET_RANGES = [
  { label: "Under ₹10 Lakh", max: 10 },
  { label: "Under ₹20 Lakh", max: 20 },
  { label: "Under ₹50 Lakh", max: 50 },
  { label: "Under ₹100 Lakh", max: 100 },
];

function Vehicles() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: "/vehicles/" });
  
  const [query, setQuery] = useState(searchParams.q ?? "");
  
  // Make "list" the default view (CarWale style)
  const [view, setView] = useState<"grid" | "list">("list");

  const updateSearch = (newParams: Partial<SearchParams>) => {
    navigate({
      search: (prev: SearchParams) => {
        const next = { ...prev, ...newParams };
        // Clean up undefined/empty string params
        Object.keys(next).forEach((key) => {
          if (next[key as keyof SearchParams] === undefined || next[key as keyof SearchParams] === "") {
            delete next[key as keyof SearchParams];
          }
        });
        return next;
      },
    });
  };

  const clearFilters = () => {
    setQuery("");
    navigate({ search: {} as SearchParams });
  };

  const filtered = useMemo(() => {
    const cat = searchParams.category ? CATEGORY_MAP[searchParams.category] : undefined;
    return VEHICLES.filter((v) => {
      if (cat && v.category !== cat) return false;
      if (searchParams.brand && v.brand.toLowerCase() !== searchParams.brand.toLowerCase()) return false;
      if (searchParams.bodyType && v.bodyType.toLowerCase() !== searchParams.bodyType.toLowerCase()) return false;
      if (searchParams.maxPrice && v.price > searchParams.maxPrice) return false;
      if (searchParams.fuel) {
         const vFuel = v.isElectric ? "Electric" : v.specs.fuel;
         if (vFuel?.toLowerCase() !== searchParams.fuel.toLowerCase()) return false;
      }
      if (query && !`${v.name} ${v.brand}`.toLowerCase().includes(query.toLowerCase())) return false;
      
      return true;
    });
  }, [searchParams, query]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Browse"
        title="Find your right vehicle"
        description="Filter by budget, brand, body type and more."
      />
      <section className="container mx-auto max-w-7xl px-4 md:px-6 py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          
          {/* Enhanced Sidebar Filters */}
          <aside className="space-y-6 sticky top-24">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Filter className="h-4 w-4" /> Filters
                </div>
                {Object.keys(searchParams).length > 0 && (
                   <button onClick={clearFilters} className="text-xs text-primary hover:underline">Clear all</button>
                )}
              </div>
              
              <div className="p-5 space-y-6 divide-y divide-border">
                {/* Search */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-3">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Brand or model"
                      className="pl-9 bg-background border-border"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="pt-6">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-3">Budget</label>
                  <div className="space-y-2">
                    {BUDGET_RANGES.map((b) => (
                      <label key={b.max} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${searchParams.maxPrice === b.max ? 'border-primary' : 'border-border group-hover:border-primary/50'}`}>
                           {searchParams.maxPrice === b.max && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <span className={`text-sm ${searchParams.maxPrice === b.max ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{b.label}</span>
                        <input
                           type="radio"
                           className="hidden"
                           checked={searchParams.maxPrice === b.max}
                           onChange={() => updateSearch({ maxPrice: searchParams.maxPrice === b.max ? undefined : b.max })}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand */}
                <div className="pt-6">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-3">Brand</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {BRANDS.map((brand) => (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${searchParams.brand?.toLowerCase() === brand.toLowerCase() ? 'bg-primary border-primary text-primary-foreground' : 'border-border group-hover:border-primary/50'}`}>
                           {searchParams.brand?.toLowerCase() === brand.toLowerCase() && <Check className="h-3 w-3" />}
                        </div>
                        <span className={`text-sm ${searchParams.brand?.toLowerCase() === brand.toLowerCase() ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{brand}</span>
                        <input
                           type="checkbox"
                           className="hidden"
                           checked={searchParams.brand?.toLowerCase() === brand.toLowerCase()}
                           onChange={() => updateSearch({ brand: searchParams.brand?.toLowerCase() === brand.toLowerCase() ? undefined : brand.toLowerCase() })}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Body Type */}
                <div className="pt-6">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-3">Body Type</label>
                  <div className="flex flex-wrap gap-2">
                    {BODY_TYPES.map((type) => {
                       const isActive = searchParams.bodyType?.toLowerCase() === type.toLowerCase();
                       return (
                         <button
                           key={type}
                           onClick={() => updateSearch({ bodyType: isActive ? undefined : type.toLowerCase() })}
                           className={`px-3 py-1.5 rounded-md text-xs transition-colors border ${isActive ? 'bg-primary/10 border-primary/30 text-primary font-medium' : 'bg-background border-border text-muted-foreground hover:border-foreground/20'}`}
                         >
                           {type}
                         </button>
                       );
                    })}
                  </div>
                </div>

                {/* Fuel Type */}
                <div className="pt-6">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-3">Fuel Type</label>
                  <div className="flex flex-wrap gap-2">
                    {FUEL_TYPES.map((type) => {
                       const isActive = searchParams.fuel?.toLowerCase() === type?.toLowerCase();
                       return (
                         <button
                           key={type}
                           onClick={() => updateSearch({ fuel: isActive ? undefined : type?.toLowerCase() })}
                           className={`px-3 py-1.5 rounded-md text-xs transition-colors border ${isActive ? 'bg-primary/10 border-primary/30 text-primary font-medium' : 'bg-background border-border text-muted-foreground hover:border-foreground/20'}`}
                         >
                           {type}
                         </button>
                       );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </aside>

          {/* Results Area */}
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <h2 className="text-xl font-semibold">{filtered.length} vehicles found</h2>
              <div className="flex gap-1 rounded-md border border-border bg-card p-1">
                <button
                  onClick={() => setView("grid")}
                  className={`p-1.5 rounded transition-colors ${view === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  title="Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-1.5 rounded transition-colors ${view === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {Object.keys(searchParams).length > 0 && (
               <div className="flex flex-wrap gap-2 mb-6">
                  {Object.entries(searchParams).map(([k, v]) => {
                     if (!v) return null;
                     return (
                        <span key={k} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border text-xs text-foreground">
                           {k}: {v}
                           <button onClick={() => updateSearch({ [k]: undefined })} className="hover:text-destructive">
                              <X className="h-3 w-3" />
                           </button>
                        </span>
                     )
                  })}
               </div>
            )}

            <div
              className={view === "grid" ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-5" : "flex flex-col gap-5"}
            >
              {filtered.map((v, i) => (
                <VehicleCard key={v.id} vehicle={v} index={i} viewMode={view} />
              ))}
            </div>
            
            {filtered.length === 0 && (
              <div className="text-center py-24 rounded-xl border border-dashed border-border bg-card text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-3 opacity-50 text-muted-foreground" />
                <p className="font-medium text-foreground">No vehicles match your criteria</p>
                <p className="text-sm mt-1 mb-4">Try adjusting your filters or search term.</p>
                <Button variant="outline" onClick={clearFilters} className="text-primary">
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

// Ensure Check is available for checkboxes
function Check(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
