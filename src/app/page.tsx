import {
  ArrowRight,
  Box,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Cpu,
  Gauge,
  Layers3,
  ShieldCheck,
  Sparkles,
  Weight,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Layers3,
    title: "3D assembly",
    description: "See every selected component placed on a generated quadcopter.",
  },
  {
    icon: ShieldCheck,
    title: "Compatibility checks",
    description: "Catch voltage, current, mounting, fit, and payload problems early.",
  },
  {
    icon: Clock3,
    title: "Flight estimates",
    description: "Compare flight time as battery and powertrain choices change.",
  },
  {
    icon: Gauge,
    title: "Thrust-to-weight",
    description: "Understand whether a build is stable, aggressive, or underpowered.",
  },
  {
    icon: CircleDollarSign,
    title: "Price and BOM",
    description: "Track the full build cost and prepare a clean parts list.",
  },
  {
    icon: Cpu,
    title: "Explainable engineering",
    description: "Every result comes from visible specs and transparent formulas.",
  },
];

const exampleBuilds = [
  {
    title: "Starter 5-Inch",
    useCase: "Beginner",
    cost: "$326",
    weight: "548g",
    time: "6.1 min",
    accent: "from-sky-300/20",
  },
  {
    title: "Balanced Freestyle",
    useCase: "Freestyle",
    cost: "$420",
    weight: "574g",
    time: "5.0 min",
    accent: "from-lime-300/20",
  },
  {
    title: "Lightweight Racer",
    useCase: "Racing",
    cost: "$357",
    weight: "482g",
    time: "3.7 min",
    accent: "from-amber-300/20",
  },
];

function DroneBlueprint() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      <div className="absolute inset-[11%] rounded-full border border-white/7" />
      <div className="absolute inset-[22%] rounded-full border border-dashed border-lime-300/15" />
      <div className="absolute left-1/2 top-1/2 h-[1px] w-[78%] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-r from-transparent via-zinc-500 to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-[1px] w-[78%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-gradient-to-r from-transparent via-zinc-500 to-transparent" />

      {[
        "left-[13%] top-[13%]",
        "right-[13%] top-[13%]",
        "bottom-[13%] left-[13%]",
        "bottom-[13%] right-[13%]",
      ].map((position) => (
        <div
          key={position}
          className={`absolute ${position} size-[27%] rounded-full border border-lime-300/20 bg-lime-300/[0.025] shadow-[0_0_60px_rgba(193,255,58,0.04)]`}
        >
          <div className="absolute left-1/2 top-1/2 h-[12%] w-[95%] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-full bg-lime-300/75 shadow-[0_0_22px_rgba(193,255,58,0.25)]" />
          <div className="absolute left-1/2 top-1/2 size-[24%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-400 bg-zinc-700 shadow-xl" />
        </div>
      ))}

      <div className="absolute left-1/2 top-1/2 h-[27%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-[#171d21] shadow-2xl">
        <div className="absolute inset-[12%] rounded-xl border border-white/8 bg-[#0e1316]" />
        <div className="absolute left-1/2 top-[17%] h-[24%] w-[58%] -translate-x-1/2 rounded-md border border-lime-300/20 bg-lime-300/8" />
        <div className="absolute bottom-[13%] left-1/2 h-[30%] w-[18%] -translate-x-1/2 rounded-md border border-white/10 bg-zinc-800" />
      </div>

      <div className="absolute left-[4%] top-[48%] flex items-center gap-2">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-sky-300/50" />
        <span className="rounded border border-sky-300/20 bg-sky-300/5 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-sky-200">
          2207 motor
        </span>
      </div>
      <div className="absolute right-[2%] top-[29%] flex items-center gap-2">
        <span className="rounded border border-lime-300/20 bg-lime-300/5 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-lime-200">
          5-inch prop
        </span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-lime-300/50" />
      </div>
      <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 rounded-full border border-white/8 bg-black/25 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500 backdrop-blur">
        Parametric assembly preview
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#090c0e] text-zinc-100">
      <header className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg border border-lime-300/25 bg-lime-300/10 text-lime-200">
            <Box className="size-4" />
          </span>
          <div>
            <p className="font-semibold tracking-tight">DroneLab</p>
            <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-zinc-600">
              Build · validate · fly
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 text-xs text-zinc-500 md:flex">
          <a href="#features" className="transition hover:text-zinc-100">
            Features
          </a>
          <a href="#builds" className="transition hover:text-zinc-100">
            Example builds
          </a>
          <span className="text-zinc-700">Engineering notes</span>
        </nav>
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

      <main>
        <section className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-10 px-5 pb-20 pt-10 lg:grid-cols-[1fr_0.95fr] lg:px-8 lg:pt-4">
          <div className="absolute left-1/2 top-0 -z-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-lime-300/[0.035] blur-[150px]" />
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.025] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-400">
              <Sparkles className="size-3 text-lime-200" />
              3D FPV engineering workspace
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-50 sm:text-6xl lg:text-7xl">
              Build your drone
              <span className="block text-zinc-500">before you buy it.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
              Assemble FPV parts in 3D, catch compatibility problems, estimate
              flight performance, and leave with a complete bill of materials.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/builder"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 bg-lime-300 px-6 text-[#11160d] hover:bg-lime-200",
                )}
              >
                Start building
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="#builds"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 border-white/10 bg-white/[0.025] px-6 text-zinc-200 hover:bg-white/[0.06]",
                )}
              >
                Explore example builds
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-zinc-500">
              {[
                "No account required",
                "Transparent calculations",
                "Curated starter catalog",
              ].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-lime-300/70" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <DroneBlueprint />
            <div className="absolute left-0 top-[11%] rounded-lg border border-white/8 bg-[#11171a]/85 p-3 shadow-xl backdrop-blur-md">
              <p className="tech-label">Build health</p>
              <div className="mt-1 flex items-center gap-2">
                <ShieldCheck className="size-4 text-lime-200" />
                <span className="font-mono text-sm text-zinc-100">92 / 100</span>
              </div>
            </div>
            <div className="absolute bottom-[12%] right-0 rounded-lg border border-white/8 bg-[#11171a]/85 p-3 shadow-xl backdrop-blur-md">
              <p className="tech-label">Live estimate</p>
              <div className="mt-1 flex items-center gap-4">
                <span className="font-mono text-sm text-zinc-100">5.0 min</span>
                <span className="font-mono text-sm text-lime-200">4.8:1</span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="border-y border-white/7 bg-white/[0.015] px-5 py-24 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="tech-label text-lime-300/70">One connected workflow</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Visual enough for beginners.
                <span className="block text-zinc-500">Technical enough to trust.</span>
              </h2>
            </div>
            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/8 bg-white/8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="bg-[#0c1013] p-6">
                    <span className="flex size-9 items-center justify-center rounded-lg border border-white/8 bg-white/[0.035] text-lime-200">
                      <Icon className="size-4" />
                    </span>
                    <h3 className="mt-5 text-sm font-medium">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="builds" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="tech-label text-sky-300/70">Curated starting points</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Start from a proven direction.
              </h2>
            </div>
            <Link
              href="/builder"
              className="flex items-center gap-2 text-xs text-zinc-400 transition hover:text-zinc-100"
            >
              Compare in builder <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {exampleBuilds.map((build) => (
              <Link
                key={build.title}
                href="/builder"
                className={`group relative overflow-hidden rounded-xl border border-white/8 bg-gradient-to-br ${build.accent} via-[#0d1215] to-[#0d1215] p-5 transition hover:-translate-y-0.5 hover:border-white/15`}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded border border-white/8 bg-black/15 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                    {build.useCase}
                  </span>
                  <ArrowRight className="size-4 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-zinc-300" />
                </div>
                <div className="my-8 flex items-center justify-center">
                  <div className="relative size-28 rotate-45">
                    <div className="absolute left-1/2 top-1/2 h-2 w-full -translate-x-1/2 -translate-y-1/2 rounded bg-zinc-700" />
                    <div className="absolute left-1/2 top-1/2 h-full w-2 -translate-x-1/2 -translate-y-1/2 rounded bg-zinc-700" />
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className="absolute size-8 rounded-full border border-lime-300/25"
                        style={{
                          left: index % 2 === 0 ? 0 : "auto",
                          right: index % 2 === 1 ? 0 : "auto",
                          top: index < 2 ? 0 : "auto",
                          bottom: index >= 2 ? 0 : "auto",
                        }}
                      />
                    ))}
                    <div className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 rounded bg-zinc-800" />
                  </div>
                </div>
                <h3 className="text-base font-medium">{build.title}</h3>
                <div className="mt-4 grid grid-cols-3 divide-x divide-white/7 border-t border-white/7 pt-4">
                  <div>
                    <p className="tech-label">Cost</p>
                    <p className="mt-1 font-mono text-xs">{build.cost}</p>
                  </div>
                  <div className="pl-3">
                    <p className="tech-label">Weight</p>
                    <p className="mt-1 font-mono text-xs">{build.weight}</p>
                  </div>
                  <div className="pl-3">
                    <p className="tech-label">Flight</p>
                    <p className="mt-1 font-mono text-xs">{build.time}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-white/7 px-5 py-20 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <span className="flex size-11 items-center justify-center rounded-xl border border-lime-300/20 bg-lime-300/8 text-lime-200">
              <Weight className="size-5" />
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
              Make the expensive mistakes on screen.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
              DroneLab estimates are approximate and intended for planning and
              education. Always verify manufacturer specifications and safety
              guidance before purchasing or flying.
            </p>
            <Link
              href="/builder"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 h-12 bg-lime-300 px-6 text-[#11160d] hover:bg-lime-200",
              )}
            >
              Build a 5-inch quad
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/7 px-5 py-8 text-xs text-zinc-600 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row">
          <p>© 2026 DroneLab. Planning and educational estimates only.</p>
          <div className="flex gap-5">
            <span>GitHub</span>
            <span>About</span>
            <span>Disclaimer</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
