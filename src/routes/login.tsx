import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: () => (
    <PageShell>
      <section className="container mx-auto max-w-md px-4 py-20">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="mx-auto flex justify-center mb-6">
            <span className="text-xl font-semibold tracking-tight">
              TECH<span className="text-primary">360</span>
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-center mt-2 tracking-tight">Welcome back</h1>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Sign in to save vehicles, comparisons & reviews.
          </p>
          <form className="mt-8 space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Email</Label>
              <Input
                type="email"
                placeholder="you@email.com"
                className="mt-1.5 bg-background border-border"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="mt-1.5 bg-background border-border"
              />
            </div>
            <Button className="w-full mt-2" type="button">
              Sign in
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-8">
            No account?{" "}
            <Link to="/login" className="text-foreground hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  ),
});
