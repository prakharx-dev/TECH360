import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { REVIEWS } from "@/data/vehicles";
import { Star } from "lucide-react";

export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [{ title: "Reviews — TECH360" }] }),
  component: () => (
    <PageShell>
      <PageHeader
        eyebrow="Community"
        title="Reviews & Ratings"
        description="Real owners. Honest opinions. Expert verdicts."
      />
      <section className="container mx-auto max-w-7xl px-4 md:px-6 py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...REVIEWS, ...REVIEWS, ...REVIEWS].map((r, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6">
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star
                  key={k}
                  className={`h-4 w-4 ${k < r.rating ? "fill-foreground text-foreground" : "text-muted"}`}
                />
              ))}
            </div>
            <h4 className="text-lg font-semibold">{r.title}</h4>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.body}</p>
            <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs">
              <span className="font-medium text-foreground">{r.user}</span>
              <span className="text-muted-foreground">{r.vehicle}</span>
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  ),
});
