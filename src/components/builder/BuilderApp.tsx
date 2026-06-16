"use client";

import {
  Box,
  ChevronDown,
  Download,
  FileJson,
  Layers3,
  RotateCcw,
  Save,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BuildStatsPanel } from "@/components/builder/BuildStatsPanel";
import { PartsCatalog } from "@/components/builder/PartsCatalog";
import { DroneScene } from "@/components/three/DroneScene";
import { Button } from "@/components/ui/button";
import { createBomCsv, createBomText } from "@/lib/builds/bom";
import {
  decodeBuildFromUrl,
  encodeBuildForUrl,
} from "@/lib/builds/serialization";
import { calculateBuild } from "@/lib/compatibility/calculateBuild";
import type { BuildGoal } from "@/lib/types/build";
import { cn } from "@/lib/utils";
import { useBuildStore } from "@/store/useBuildStore";

const goals: { value: BuildGoal; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "freestyle", label: "Freestyle" },
  { value: "racing", label: "Racing" },
  { value: "cinematic", label: "Cinematic" },
  { value: "long_range", label: "Long-range" },
  { value: "payload", label: "Payload" },
];

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="min-w-0 flex-1 px-2.5 py-3 2xl:px-4">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-600">
        {label}
      </p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="font-mono text-base font-semibold text-zinc-100 2xl:text-lg">
          {value}
        </p>
        <p className="hidden truncate text-[10px] text-zinc-600 2xl:block">
          {detail}
        </p>
      </div>
    </div>
  );
}

export function BuilderApp() {
  const store = useBuildStore();
  const setBuild = store.setBuild;
  const searchParams = useSearchParams();
  const loadedBuildParam = useRef<string | undefined>(undefined);
  const [feedback, setFeedback] = useState<string>();
  const [saving, setSaving] = useState(false);
  const calculation = useMemo(
    () => calculateBuild(store.parts, store.goal, store.budgetUsd),
    [store.parts, store.goal, store.budgetUsd],
  );
  const { stats } = calculation;

  useEffect(() => {
    const encodedBuild = searchParams.get("build");
    if (!encodedBuild || loadedBuildParam.current === encodedBuild) return;

    const decoded = decodeBuildFromUrl(encodedBuild);
    if (!decoded) return;

    loadedBuildParam.current = encodedBuild;
    setBuild({
      buildName: decoded.name,
      goal: decoded.goal,
      budgetUsd: decoded.budgetUsd,
      parts: decoded.parts,
    });
  }, [searchParams, setBuild]);

  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(undefined), 2200);
  };
  const getSerializableBuild = () => ({
    name: store.buildName,
    goal: store.goal,
    budgetUsd: store.budgetUsd,
    parts: store.parts,
  });
  const createFallbackSharePath = () =>
    `/builds/shared?build=${encodeBuildForUrl(getSerializableBuild())}`;
  const saveBuildLocally = () => {
    localStorage.setItem(
      "dronelab:build",
      JSON.stringify({
        name: store.buildName,
        goal: store.goal,
        budgetUsd: store.budgetUsd,
        parts: store.parts,
        ...calculation,
        updatedAt: new Date().toISOString(),
      }),
    );
  };
  const saveBuild = async () => {
    if (saving) return;

    setSaving(true);
    saveBuildLocally();

    try {
      const response = await fetch("/api/builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: store.buildName,
          goal: store.goal,
          budgetUsd: store.budgetUsd,
          parts: store.parts,
          isPublic: false,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Build save failed");
      }

      const preferredPath =
        result.persistence?.durable === true
          ? result.paths?.summary
          : result.paths?.share;
      const path = preferredPath ?? createFallbackSharePath();

      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      showFeedback(
        result.persistence?.durable === true
          ? "Saved. Link copied"
          : "Share link copied",
      );
    } catch {
      await navigator.clipboard.writeText(
        `${window.location.origin}${createFallbackSharePath()}`,
      );
      showFeedback("Saved locally. Share link copied");
    } finally {
      setSaving(false);
    }
  };
  const copyBom = async () => {
    await navigator.clipboard.writeText(
      createBomText(store.buildName, store.parts, stats),
    );
    showFeedback("BOM copied");
  };
  const copyShareLink = async () => {
    const encodedBuild = encodeBuildForUrl({
      ...getSerializableBuild(),
    });
    await navigator.clipboard.writeText(
      `${window.location.origin}/builds/shared?build=${encodedBuild}`,
    );
    showFeedback("Share link copied");
  };
  const downloadJson = () => {
    downloadFile(
      "dronelab-build.json",
      JSON.stringify(
        {
          name: store.buildName,
          goal: store.goal,
          budgetUsd: store.budgetUsd,
          parts: store.parts,
          calculation,
          exportedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
      "application/json;charset=utf-8",
    );
    showFeedback("JSON downloaded");
  };
  const downloadCsv = () => {
    downloadFile(
      "dronelab-bom.csv",
      createBomCsv(store.parts),
      "text/csv;charset=utf-8",
    );
    showFeedback("CSV downloaded");
  };
  const openSummaryHref = `/builds/shared?build=${encodeBuildForUrl({
    ...getSerializableBuild(),
  })}`;

  return (
    <div className="flex min-h-screen flex-col bg-[#090c0e] text-zinc-100 lg:h-screen lg:overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/8 bg-[#0b0f12] px-4 lg:px-5">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg border border-lime-300/25 bg-lime-300/10 text-lime-200">
              <Box className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight">DroneLab</p>
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-zinc-600">
                FPV engineering studio
              </p>
            </div>
          </Link>
          <div className="mx-2 hidden h-6 w-px bg-white/8 sm:block" />
          <button
            type="button"
            className="hidden items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100 sm:flex"
          >
            {store.buildName}
            <ChevronDown className="size-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="hidden text-zinc-400 hover:text-zinc-100 md:flex"
            onClick={store.resetBuild}
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-zinc-400"
            aria-label="Download bill of materials as CSV"
            onClick={downloadCsv}
          >
            <Download className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-zinc-400"
            aria-label="Download build JSON"
            onClick={downloadJson}
          >
            <FileJson className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-zinc-400"
            aria-label="Copy share link"
            onClick={copyShareLink}
          >
            <Share2 className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden text-zinc-400 hover:text-zinc-100 xl:flex"
            onClick={copyBom}
          >
            Copy BOM
          </Button>
          <Link
            href={openSummaryHref}
            className="hidden rounded-md px-2.5 py-1.5 text-[0.8rem] text-zinc-400 transition hover:bg-white/5 hover:text-zinc-100 lg:inline-flex"
          >
            Summary
          </Link>
          <Button
            size="sm"
            className="bg-lime-300 text-[#11160d] hover:bg-lime-200"
            onClick={saveBuild}
            disabled={saving}
          >
            <Save className="size-3.5" />
            {saving ? "Saving..." : "Save build"}
          </Button>
          {feedback && (
            <span className="absolute right-4 top-14 z-50 rounded-md border border-lime-300/20 bg-[#11170f] px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-lime-200 shadow-xl">
              {feedback}
            </span>
          )}
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[260px_minmax(420px,1fr)_300px] 2xl:grid-cols-[310px_minmax(520px,1fr)_340px]">
        <div className="min-h-0 max-h-[620px] lg:max-h-none">
          <PartsCatalog
            activeCategory={store.activeCategory}
            parts={store.parts}
            onCategoryChange={store.setActiveCategory}
            onPartChange={store.setPart}
            onHighlight={store.setHighlightedCategory}
          />
        </div>

        <main className="relative min-h-[520px] overflow-hidden border-y border-white/8 lg:border-y-0">
          <div className="pointer-events-none absolute left-5 top-5 z-10">
            <p className="tech-label">Assembly viewport</p>
            <p className="mt-1 text-xs text-zinc-500">
              Drag to orbit · Scroll to zoom · Hover to inspect
            </p>
          </div>

          <div className="absolute right-4 top-4 z-10 flex gap-2">
            <button
              type="button"
              onClick={store.toggleExploded}
              className={cn(
                "flex h-9 items-center gap-2 rounded-md border px-3 text-xs backdrop-blur-md transition",
                store.exploded
                  ? "border-lime-300/35 bg-lime-300/12 text-lime-200"
                  : "border-white/10 bg-black/30 text-zinc-400 hover:border-white/20 hover:text-zinc-100",
              )}
            >
              <Layers3 className="size-3.5" />
              Exploded view
            </button>
          </div>

          <div className="h-full min-h-[520px]">
            <DroneScene
              parts={store.parts}
              exploded={store.exploded}
              highlightedCategory={store.highlightedCategory}
              onHighlight={store.setHighlightedCategory}
            />
          </div>

          {store.highlightedCategory && (
            <div className="pointer-events-none absolute bottom-24 left-1/2 z-10 -translate-x-1/2 rounded-full border border-lime-300/20 bg-black/55 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-lime-200 backdrop-blur-md">
              Inspecting {store.highlightedCategory.replace("_", " ")}
            </div>
          )}

          <div className="absolute inset-x-3 bottom-3 z-10 flex divide-x divide-white/8 overflow-hidden rounded-lg border border-white/9 bg-[#0c1114]/90 shadow-2xl backdrop-blur-xl">
            <Metric
              label="Total cost"
              value={`$${stats.totalCostUsd.toFixed(0)}`}
              detail={`$${Math.max(0, store.budgetUsd - stats.totalCostUsd).toFixed(0)} remaining`}
            />
            <Metric
              label="All-up weight"
              value={`${stats.totalWeightG.toFixed(0)}g`}
              detail="incl. hardware"
            />
            <Metric
              label="Flight time"
              value={`${stats.estimatedFlightTimeMin.toFixed(1)}m`}
              detail="estimated"
            />
            <Metric
              label="Thrust / weight"
              value={`${stats.thrustToWeightRatio.toFixed(1)}:1`}
              detail={stats.recommendedUseCase}
            />
          </div>
        </main>

        <div className="min-h-0 max-h-[720px] lg:max-h-none">
          <BuildStatsPanel calculation={calculation} />
        </div>
      </div>

      <footer className="flex min-h-12 shrink-0 flex-wrap items-center gap-3 border-t border-white/8 bg-[#0b0f12] px-4 py-2">
        <span className="tech-label">Mission profile</span>
        <div className="flex flex-wrap gap-1">
          {goals.map((goal) => (
            <button
              key={goal.value}
              type="button"
              onClick={() => store.setGoal(goal.value)}
              className={cn(
                "rounded px-2.5 py-1 text-[11px] transition",
                store.goal === goal.value
                  ? "bg-lime-300/12 text-lime-200"
                  : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200",
              )}
            >
              {goal.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="font-mono text-[10px] text-zinc-600">BUDGET</span>
          <label className="rounded border border-white/8 bg-white/[0.025] px-2 py-1 font-mono text-xs text-zinc-300">
            $
            <input
              type="number"
              value={store.budgetUsd}
              onChange={(event) => store.setBudget(Number(event.target.value))}
              className="ml-1 w-14 bg-transparent outline-none"
              aria-label="Build budget in US dollars"
            />
          </label>
        </div>
      </footer>
    </div>
  );
}
