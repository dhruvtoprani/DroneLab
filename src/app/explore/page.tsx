import { ArrowRight, Box, Sparkles } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { encodeBuildForUrl } from "@/lib/builds/serialization";
import { getCalculatedExampleBuilds } from "@/lib/data/exampleBuilds";
import { formatCurrency, formatNumber } from "@/lib/formatting";
import { recommendBuilds } from "@/lib/recommendations/recommendBuilds";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Explore Builds | DroneLab",
  description: "Browse curated and recommended FPV drone builds.",
};

export default function ExplorePage() {
  const examples = getCalculatedExampleBuilds();
  const recommendations = recommendBuilds({
    goal: "freestyle",
    budgetUsd: 450,
  });

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
              Explore builds
            </p>
          </div>
        </Link>
        <Link
          href="/builder"
          className={cn(
            buttonVariants({ size: "sm" }),
            "bg-lime-300 text-[#11160d] hover:bg-lime-200",
          )}
        >
          Open builder
          <ArrowRight className="size-3.5" />
        </Link>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-20 pt-10 lg:px-8">
        <section className="max-w-3xl">
          <p className="tech-label text-lime-300/70">Curated and generated</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight lg:text-6xl">
            Start from a build that already makes sense.
          </h1>
          <p className="mt-5 text-sm leading-6 text-zinc-400">
            DroneLab combines hand-authored examples with a brute-force
            recommendation engine that filters invalid combinations before
            ranking cost, fit, performance, and efficiency.
          </p>
        </section>

        <section className="mt-12">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="size-4 text-lime-200" />
            <h2 className="text-lg font-semibold">Recommended for freestyle under $450</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {recommendations.map((recommendation) => {
              const href = `/builder?build=${encodeBuildForUrl({
                name: recommendation.name,
                goal: recommendation.goal,
                budgetUsd: recommendation.budgetUsd,
                parts: recommendation.parts,
              })}`;

              return (
                <Link
                  key={recommendation.id}
                  href={href}
                  className="group rounded-xl border border-white/8 bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-lime-300/20 hover:bg-lime-300/[0.035]"
                >
                  <span className="rounded-full border border-lime-300/20 bg-lime-300/8 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-lime-200">
                    {recommendation.label}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{recommendation.name}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-500">
                    {recommendation.reason}
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/7 pt-4">
                    <Metric label="Cost" value={formatCurrency(recommendation.calculation.stats.totalCostUsd)} />
                    <Metric label="Flight" value={`${recommendation.calculation.stats.estimatedFlightTimeMin.toFixed(1)}m`} />
                    <Metric label="Score" value={`${recommendation.calculation.stats.overallScore}`} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-lg font-semibold">Curated example builds</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {examples.map((build) => (
              <Link
                key={build.id}
                href={`/builds/${build.id}`}
                className="group rounded-xl border border-white/8 bg-gradient-to-br from-white/[0.045] to-transparent p-5 transition hover:border-white/15"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="rounded-full border border-white/8 bg-black/20 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                      {build.goal.replace("_", " ")}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold">{build.name}</h3>
                  </div>
                  <ArrowRight className="size-4 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-zinc-300" />
                </div>
                <div className="mt-7 grid grid-cols-4 gap-3 border-t border-white/7 pt-4">
                  <Metric label="Cost" value={formatCurrency(build.calculation.stats.totalCostUsd)} />
                  <Metric label="Weight" value={`${formatNumber(build.calculation.stats.totalWeightG)}g`} />
                  <Metric label="Flight" value={`${build.calculation.stats.estimatedFlightTimeMin.toFixed(1)}m`} />
                  <Metric label="T/W" value={`${build.calculation.stats.thrustToWeightRatio.toFixed(1)}:1`} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="tech-label">{label}</p>
      <p className="mt-1 font-mono text-sm text-zinc-100">{value}</p>
    </div>
  );
}
