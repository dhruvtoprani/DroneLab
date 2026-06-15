"use client";

import {
  AlertTriangle,
  Check,
  ChevronRight,
  CircleAlert,
  Gauge,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import type { BuildCalculation } from "@/lib/types/build";
import { cn } from "@/lib/utils";

function StatRow({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div>
        <p className="text-xs text-zinc-400">{label}</p>
        {detail && <p className="mt-0.5 text-[10px] text-zinc-600">{detail}</p>}
      </div>
      <p className="font-mono text-sm font-medium text-zinc-100">{value}</p>
    </div>
  );
}

export function BuildStatsPanel({
  calculation,
}: {
  calculation: BuildCalculation;
}) {
  const { stats, warnings, suggestions, status } = calculation;
  const statusConfig = {
    valid: {
      label: "Build valid",
      className: "border-lime-300/25 bg-lime-300/8 text-lime-200",
      icon: ShieldCheck,
    },
    warning: {
      label: "Review needed",
      className: "border-amber-300/25 bg-amber-300/8 text-amber-200",
      icon: AlertTriangle,
    },
    critical: {
      label: "Build invalid",
      className: "border-red-400/25 bg-red-400/8 text-red-300",
      icon: CircleAlert,
    },
  }[status];
  const StatusIcon = statusConfig.icon;

  return (
    <aside className="h-full min-h-0 overflow-y-auto border-l border-white/8 bg-[#0d1114]/95 scrollbar-thin">
      <div className="border-b border-white/8 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="tech-label">Build health</p>
            <h2 className="mt-1 text-base font-semibold">Engineering report</h2>
          </div>
          <div
            className="relative flex size-16 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(#c8ff48 ${stats.overallScore * 3.6}deg, #20272c 0deg)`,
            }}
          >
            <div className="flex size-12 flex-col items-center justify-center rounded-full bg-[#0d1114]">
              <span className="font-mono text-lg font-semibold text-zinc-50">
                {stats.overallScore}
              </span>
              <span className="font-mono text-[8px] uppercase text-zinc-600">
                score
              </span>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "mt-4 flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium",
            statusConfig.className,
          )}
        >
          <StatusIcon className="size-4" />
          {statusConfig.label}
          <span className="ml-auto font-mono text-[10px] opacity-70">
            {stats.recommendedUseCase}
          </span>
        </div>
      </div>

      <div className="border-b border-white/8 p-4">
        <div className="mb-1 flex items-center gap-2">
          <Gauge className="size-3.5 text-lime-200" />
          <p className="tech-label">Performance</p>
        </div>
        <div className="divide-y divide-white/6">
          <StatRow
            label="Total max thrust"
            value={`${stats.totalMaxThrustG.toFixed(0)} g`}
            detail="Four motors combined"
          />
          <StatRow
            label="Thrust-to-weight"
            value={`${stats.thrustToWeightRatio.toFixed(1)} : 1`}
            detail="3-5 is a strong freestyle range"
          />
          <StatRow
            label="Estimated flight time"
            value={`${stats.estimatedFlightTimeMin.toFixed(1)} min`}
            detail="80% usable battery capacity"
          />
          <StatRow
            label="Payload margin"
            value={`${stats.payloadMarginG.toFixed(0)} g`}
            detail="At a conservative 2.5:1 ratio"
          />
        </div>
      </div>

      <div className="border-b border-white/8 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="tech-label">Compatibility</p>
          <span className="font-mono text-[10px] text-zinc-500">
            {warnings.length} {warnings.length === 1 ? "issue" : "issues"}
          </span>
        </div>
        <div className="space-y-2">
          {warnings.length === 0 && (
            <div className="flex items-start gap-2.5 rounded-lg border border-lime-300/15 bg-lime-300/[0.045] p-3">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-lime-300/15 text-lime-200">
                <Check className="size-3" />
              </span>
              <div>
                <p className="text-xs font-medium text-lime-100">All core checks pass</p>
                <p className="mt-1 text-[11px] leading-4 text-zinc-500">
                  Voltage, current, mounting, fit, and payload checks are within the configured limits.
                </p>
              </div>
            </div>
          )}

          {warnings.slice(0, 5).map((warning) => (
            <div
              key={warning.id}
              className={cn(
                "rounded-lg border p-3",
                warning.severity === "critical"
                  ? "border-red-400/18 bg-red-400/[0.045]"
                  : warning.severity === "warning"
                    ? "border-amber-300/18 bg-amber-300/[0.045]"
                    : "border-sky-300/15 bg-sky-300/[0.035]",
              )}
            >
              <div className="flex items-start gap-2.5">
                <CircleAlert
                  className={cn(
                    "mt-0.5 size-3.5 shrink-0",
                    warning.severity === "critical"
                      ? "text-red-300"
                      : warning.severity === "warning"
                        ? "text-amber-200"
                        : "text-sky-200",
                  )}
                />
                <div>
                  <p className="text-xs font-medium text-zinc-200">
                    {warning.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-zinc-500">
                    {warning.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Lightbulb className="size-3.5 text-sky-300" />
          <p className="tech-label">Suggestions</p>
        </div>
        {suggestions.map((suggestion) => (
          <button
            type="button"
            key={suggestion.id}
            className="group flex w-full items-center gap-3 rounded-lg border border-white/7 bg-white/[0.025] p-3 text-left transition hover:border-sky-300/20 hover:bg-sky-300/[0.035]"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-zinc-200">{suggestion.title}</p>
              <p className="mt-1 text-[11px] leading-4 text-zinc-500">
                {suggestion.description}
              </p>
            </div>
            <ChevronRight className="size-3.5 shrink-0 text-zinc-600 transition group-hover:text-sky-300" />
          </button>
        ))}
      </div>
    </aside>
  );
}
