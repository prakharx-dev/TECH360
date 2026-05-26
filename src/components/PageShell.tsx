import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pt-24 md:pt-28">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-border">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-14 md:py-20">
        {eyebrow && (
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-3xl">{title}</h1>
        {description && (
          <p className="mt-3 text-muted-foreground max-w-2xl text-base md:text-lg">{description}</p>
        )}
      </div>
    </section>
  );
}
