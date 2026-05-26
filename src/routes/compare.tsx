import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader } from "@/components/PageShell";
import { VEHICLES } from "@/data/vehicles";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Cpu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/compare")({
  component: Compare,
  head: () => ({ meta: [{ title: "Compare Vehicles — TECH360" }] }),
});

function Compare() {
  const [ids, setIds] = useState<string[]>([VEHICLES[0].id, VEHICLES[5].id]);
  const picked = ids.map((id) => VEHICLES.find((v) => v.id === id)!).filter(Boolean);
  const rows: [string, (k: (typeof VEHICLES)[0]) => string][] = [
    ["Price", (v) => `₹${v.price}L`],
    ["Brand", (v) => v.brand],
    ["Body", (v) => v.bodyType],
    ["Range/Mileage", (v) => v.specs.range ?? v.specs.mileage ?? "—"],
    ["Power", (v) => v.specs.power],
    ["Torque", (v) => v.specs.torque],
    ["Top Speed", (v) => v.specs.topSpeed],
    ["Battery", (v) => v.specs.battery ?? "—"],
    ["Charging", (v) => v.specs.chargingTime ?? "—"],
    ["Seating", (v) => String(v.specs.seating ?? "—")],
    ["Rating", (v) => `${v.rating}★`],
  ];

  const addSlot = () =>
    ids.length < 4 && setIds([...ids, VEHICLES.find((v) => !ids.includes(v.id))!.id]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Side-by-side"
        title="Compare Vehicles"
        description="Compare up to 4 vehicles. Best values are highlighted."
      />
      <section className="container mx-auto max-w-7xl px-4 md:px-6 py-12">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div
            className="grid border-b border-border bg-muted/20"
            style={{ gridTemplateColumns: `200px repeat(${picked.length}, minmax(0,1fr))` }}
          >
            <div className="p-5 text-xs uppercase tracking-widest text-muted-foreground">
              Vehicle
            </div>
            {picked.map((v, i) => (
              <div key={v.id} className="p-5 border-l border-border relative bg-card">
                <button
                  onClick={() => setIds(ids.filter((_, k) => k !== i))}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <img
                  src={v.image}
                  alt={v.name}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] rounded-lg object-cover w-full border border-border transition-transform duration-700 hover:scale-[1.03]"
                />
                <Select
                  value={v.id}
                  onValueChange={(val) => {
                    const next = [...ids];
                    next[i] = val;
                    setIds(next);
                  }}
                >
                  <SelectTrigger className="mt-3 bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLES.map((x) => (
                      <SelectItem key={x.id} value={x.id}>
                        {x.brand} {x.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          {rows.map(([label, getter]) => {
            const values = picked.map(getter);
            const maxLen = Math.max(...values.map((v) => v.length));
            return (
              <div
                key={label}
                className="grid border-b border-border last:border-0 text-sm"
                style={{ gridTemplateColumns: `200px repeat(${picked.length}, minmax(0,1fr))` }}
              >
                <div className="p-4 text-xs uppercase tracking-widest text-muted-foreground bg-muted/20">
                  {label}
                </div>
                {values.map((val, i) => (
                  <div
                    key={i}
                    className={`p-4 border-l border-border bg-card ${val.length === maxLen && picked.length > 1 ? "font-medium" : "text-muted-foreground"}`}
                  >
                    {val}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        {ids.length < 4 && (
          <Button variant="outline" className="mt-4" onClick={addSlot}>
            + Add another vehicle
          </Button>
        )}
        <div className="mt-8 rounded-xl border border-border bg-card p-6 flex gap-4 items-start">
          <div className="h-10 w-10 rounded-md bg-muted text-muted-foreground grid place-items-center shrink-0">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold">AI Comparison Verdict</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {picked[0]?.name} leads on{" "}
              {picked[0]?.isElectric ? "efficiency and software" : "performance"}, while{" "}
              {picked[1]?.name} offers better{" "}
              {picked[1]?.price < (picked[0]?.price ?? 0) ? "value" : "premium experience"}. For
              everyday use we recommend{" "}
              {picked[0]?.price < (picked[1]?.price ?? 0) ? picked[0]?.name : picked[1]?.name}.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
