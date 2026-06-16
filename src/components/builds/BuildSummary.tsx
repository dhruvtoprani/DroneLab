import { AlertTriangle, ArrowRight, Box, Copy, Download, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { createBomCsv, createBomText, getBuildProducts } from "@/lib/builds/bom";
import { encodeBuildForUrl } from "@/lib/builds/serialization";
import { categoryLabels } from "@/lib/data/catalog";
import { formatCurrency, formatNumber } from "@/lib/formatting";
import type { BuildCalculation, BuildGoal, BuildParts } from "@/lib/types/build";
import { cn } from "@/lib/utils";

type BuildSummaryProps = {
  id: string;
  name: string;
  goal: BuildGoal;
  budgetUsd?: number;
  parts: BuildParts;
  calculation: BuildCalculation;
};

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
      <p className="tech-label">{label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold text-zinc-50">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{detail}</p>
    </div>
  );
}

export function BuildSummary({
  id,
  name,
  goal,
  budgetUsd,
  parts,
  calculation,
}: BuildSummaryProps) {
  const encodedBuild = encodeBuildForUrl({ name, goal, budgetUsd, parts });
  const builderHref = `/builder?build=${encodedBuild}`;
  const bomText = createBomText(name, parts, calculation.stats);
  const csv = createBomCsv(parts);

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
              Build summary
            </p>
          </div>
        </Link>
        <Link
          href={builderHref}
          className={cn(
            buttonVariants({ size: "sm" }),
            "bg-lime-300 text-[#11160d] hover:bg-lime-200",
          )}
        >
          Duplicate in builder
          <ArrowRight className="size-3.5" />
        </Link>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section>
            <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-lime-300/[0.08] via-white/[0.025] to-transparent p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-lime-300/20 bg-lime-300/8 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-lime-200">
                  {goal.replace("_", " ")}
                </span>
                <span className="rounded-full border border-white/8 bg-black/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  {id}
                </span>
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-50 lg:text-5xl">
                {name}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
                Public engineering report with cost, weight, performance,
                compatibility, and export-ready parts list.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label="Cost"
                  value={formatCurrency(calculation.stats.totalCostUsd)}
                  detail={budgetUsd ? `${formatCurrency(budgetUsd)} target` : "No budget set"}
                />
                <StatCard
                  label="Weight"
                  value={`${formatNumber(calculation.stats.totalWeightG)}g`}
                  detail="Estimated all-up weight"
                />
                <StatCard
                  label="Flight"
                  value={`${calculation.stats.estimatedFlightTimeMin.toFixed(1)}m`}
                  detail="80% usable battery"
                />
                <StatCard
                  label="Thrust"
                  value={`${calculation.stats.thrustToWeightRatio.toFixed(1)}:1`}
                  detail={calculation.stats.recommendedUseCase}
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.025]">
              <div className="border-b border-white/8 p-5">
                <p className="tech-label">Bill of materials</p>
                <h2 className="mt-1 text-lg font-semibold">Selected parts</h2>
              </div>
              <div className="divide-y divide-white/7">
                {getBuildProducts(parts).map(({ product, quantity, chargedQuantity }) => (
                  <Link
                    key={product.id}
                    href={`/parts/${product.id}`}
                    className="grid gap-3 p-4 transition hover:bg-white/[0.025] sm:grid-cols-[140px_1fr_92px_80px]"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                      {categoryLabels[product.category]}
                    </p>
                    <div>
                      <p className="text-sm font-medium text-zinc-100">
                        {quantity > 1 ? `${quantity}x ` : ""}
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">{product.brand}</p>
                    </div>
                    <p className="font-mono text-sm text-zinc-300">
                      {formatCurrency(product.priceUsd * chargedQuantity)}
                    </p>
                    <p className="font-mono text-xs text-zinc-500">
                      {(product.weightG * quantity).toFixed(1)}g
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div
              className={cn(
                "rounded-xl border p-4",
                calculation.status === "critical"
                  ? "border-red-400/20 bg-red-400/[0.045]"
                  : calculation.status === "warning"
                    ? "border-amber-300/20 bg-amber-300/[0.045]"
                    : "border-lime-300/20 bg-lime-300/[0.045]",
              )}
            >
              <div className="flex items-center gap-2">
                {calculation.status === "valid" ? (
                  <ShieldCheck className="size-4 text-lime-200" />
                ) : (
                  <AlertTriangle className="size-4 text-amber-200" />
                )}
                <p className="text-sm font-medium capitalize">
                  {calculation.status === "valid"
                    ? "Build valid"
                    : `${calculation.status} issues`}
                </p>
                <span className="ml-auto font-mono text-lg font-semibold">
                  {calculation.stats.overallScore}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
              <p className="tech-label">Compatibility report</p>
              <div className="mt-3 space-y-3">
                {calculation.warnings.length === 0 ? (
                  <p className="text-sm leading-6 text-zinc-400">
                    All required fit, voltage, current, payload, and budget
                    checks pass for this catalog snapshot.
                  </p>
                ) : (
                  calculation.warnings.map((warning) => (
                    <div key={warning.id} className="rounded-lg border border-white/8 p-3">
                      <p className="text-sm font-medium">{warning.title}</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        {warning.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
              <p className="tech-label">Export</p>
              <div className="mt-3 space-y-2">
                <a
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full border-white/10 bg-white/[0.025]",
                  )}
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(bomText)}`}
                  download={`${id}-bom.txt`}
                >
                  <Copy className="size-3.5" />
                  Download text BOM
                </a>
                <a
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full border-white/10 bg-white/[0.025]",
                  )}
                  href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
                  download={`${id}-bom.csv`}
                >
                  <Download className="size-3.5" />
                  Download CSV
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
