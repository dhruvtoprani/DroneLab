import { ArrowLeft, Box, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { catalog, categoryLabels } from "@/lib/data/catalog";
import { exampleBuilds } from "@/lib/data/exampleBuilds";
import { formatCurrency } from "@/lib/formatting";
import { cn } from "@/lib/utils";

type PartPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return catalog.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: PartPageProps) {
  const { id } = await params;
  const product = catalog.find((item) => item.id === id);

  return {
    title: `${product?.name ?? "Part"} | DroneLab`,
  };
}

export default async function PartPage({ params }: PartPageProps) {
  const { id } = await params;
  const product = catalog.find((item) => item.id === id);

  if (!product) notFound();

  const usedIn = exampleBuilds.filter((build) =>
    Object.values(build.parts).includes(product.id),
  );

  return (
    <div className="min-h-screen bg-[#090c0e] text-zinc-100">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg border border-lime-300/25 bg-lime-300/10 text-lime-200">
            <Box className="size-4" />
          </span>
          <div>
            <p className="font-semibold tracking-tight">DroneLab</p>
            <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-zinc-600">
              Part intelligence
            </p>
          </div>
        </Link>
        <Link
          href="/explore"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "border-white/10 bg-white/[0.025]",
          )}
        >
          <ArrowLeft className="size-3.5" />
          Explore
        </Link>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-20 pt-10 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-white/8 bg-white/[0.025] p-6 lg:p-8">
            <span className="rounded-full border border-lime-300/20 bg-lime-300/8 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-lime-200">
              {categoryLabels[product.category]}
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight lg:text-5xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-zinc-500">{product.brand}</p>
            {product.description && (
              <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-400">
                {product.description}
              </p>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <InfoCard label="Price" value={formatCurrency(product.priceUsd)} />
              <InfoCard label="Weight" value={`${product.weightG}g`} />
              <InfoCard
                label="Confidence"
                value={product.specConfidence ?? "estimated"}
              />
            </div>

            <div className="mt-8 rounded-xl border border-white/8 bg-black/20 p-5">
              <p className="tech-label">Normalized specs</p>
              <pre className="mt-4 max-h-[520px] overflow-auto rounded-lg bg-black/30 p-4 text-xs leading-5 text-zinc-400">
                {JSON.stringify(product, null, 2)}
              </pre>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
              <p className="tech-label">Source status</p>
              <dl className="mt-3 space-y-3 text-sm">
                <Row label="Source type" value={product.sourceType} />
                <Row label="Last updated" value={product.lastUpdated} />
                <Row label="Price mode" value={product.priceConfidence ?? "manual"} />
                <Row label="Model mode" value={product.modelMode ?? "generated"} />
                <Row label="Model license" value={product.modelLicense ?? "fallback"} />
                <Row
                  label="Model verified"
                  value={product.modelVerified ? "yes" : "not yet"}
                />
              </dl>
              {product.sourceUrl && (
                <a
                  href={product.sourceUrl}
                  className="mt-4 inline-flex items-center gap-2 text-xs text-lime-200"
                >
                  Open source <ExternalLink className="size-3" />
                </a>
              )}
            </div>

            <div className="rounded-xl border border-sky-300/15 bg-sky-300/[0.035] p-4">
              <p className="tech-label">Community model readiness</p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                DroneLab can attach curated GLB assets when the source, license,
                scale, and snap-point alignment are verified. Generated geometry
                remains the fallback for every part.
              </p>
              <Link
                href="/builder"
                className="mt-4 inline-flex text-xs font-medium text-sky-200 hover:text-sky-100"
              >
                Test generated fallback in builder
              </Link>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
              <p className="tech-label">Used in builds</p>
              <div className="mt-3 space-y-2">
                {usedIn.length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    No curated example build uses this part yet.
                  </p>
                ) : (
                  usedIn.map((build) => (
                    <Link
                      key={build.id}
                      href={`/builds/${build.id}`}
                      className="block rounded-lg border border-white/8 p-3 text-sm transition hover:border-lime-300/20 hover:bg-lime-300/[0.035]"
                    >
                      {build.name}
                    </Link>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-4">
      <p className="tech-label">{label}</p>
      <p className="mt-2 font-mono text-lg text-zinc-50">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="font-mono text-xs text-zinc-200">{value}</dd>
    </div>
  );
}
