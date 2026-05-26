import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { VehicleCard } from "@/components/VehicleCard";
import { Input } from "@/components/ui/input";
import { VEHICLES } from "@/data/vehicles";
import { Search as SearchIcon } from "lucide-react";

export const Route = createFileRoute("/search")({
  component: Search,
  head: () => ({ meta: [{ title: "Search — TECH360" }] }),
});

function Search() {
  const [q, setQ] = useState("");
  const results = q
    ? VEHICLES.filter((v) =>
        `${v.name} ${v.brand} ${v.bodyType}`.toLowerCase().includes(q.toLowerCase()),
      )
    : VEHICLES;
  return (
    <PageShell>
      <PageHeader
        eyebrow="Smart search"
        title="Search vehicles"
        description='Try "Best EV under 30 lakhs" or "SUV with best mileage".'
      />
      <section className="container mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="relative max-w-2xl mx-auto">
          <SearchIcon className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search anything…"
            className="pl-11 h-12 bg-card border-border text-base"
          />
        </div>
        <p className="text-sm text-muted-foreground my-8 text-center uppercase tracking-widest">{results.length} results</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} index={i} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
