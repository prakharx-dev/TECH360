import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { VehicleCard } from "@/components/VehicleCard";
import { VEHICLES } from "@/data/vehicles";

export const Route = createFileRoute("/evs")({
  component: () => {
    const list = VEHICLES.filter((v) => v.category === "ev");
    return (
      <PageShell>
        <PageHeader
          eyebrow="Zero emissions"
          title="Electric Vehicles"
          description="The most advanced EV ecosystem — batteries, range, charging, sustainability."
        />
        <section className="container mx-auto max-w-7xl px-4 md:px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((v, i) => (
              <VehicleCard key={v.id} vehicle={v} index={i} />
            ))}
          </div>
        </section>
      </PageShell>
    );
  },
});
