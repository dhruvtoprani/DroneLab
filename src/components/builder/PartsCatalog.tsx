"use client";

import {
  BatteryCharging,
  Box,
  Camera,
  CircuitBoard,
  Cpu,
  PackagePlus,
  Radio,
  RotateCw,
  SatelliteDish,
  ScanLine,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  categoryLabels,
  categoryOrder,
  catalog,
  productsByCategory,
} from "@/lib/data/catalog";
import type { BuildParts } from "@/lib/types/build";
import type { Product, ProductCategory } from "@/lib/types/product";
import { cn } from "@/lib/utils";

const categoryIcons: Record<
  ProductCategory,
  React.ComponentType<{ className?: string }>
> = {
  frame: Box,
  motor: RotateCw,
  propeller: ScanLine,
  battery: BatteryCharging,
  esc: Zap,
  flight_controller: Cpu,
  camera: Camera,
  receiver: Radio,
  vtx: CircuitBoard,
  antenna: SatelliteDish,
  payload: PackagePlus,
};

function keySpec(product: Product) {
  switch (product.category) {
    case "frame":
      return `${product.maxPropSizeIn}" max prop · ${product.wheelbaseMm}mm`;
    case "motor":
      return `${product.statorSize} · ${product.kv}KV · ${product.supportedCellMin}-${product.supportedCellMax}S`;
    case "propeller":
      return `${product.diameterIn}x${product.pitch} · ${product.blades} blade`;
    case "battery":
      return `${product.cellCount}S · ${product.capacityMah}mAh · ${product.cRating}C`;
    case "esc":
      return `${product.currentPerChannelA}A/channel · ${product.mountingPattern}`;
    case "flight_controller":
      return `${product.processor} · ${product.mountingPattern}`;
    case "camera":
      return `${product.cameraSize} · ${product.dimensions.widthMm}mm wide`;
    case "receiver":
      return `${product.protocol} · ${product.rangeClass} range`;
    case "vtx":
      return `${product.maxPowerMw}mW · ${product.antennaConnector}`;
    case "antenna":
      return `${product.frequencyGhz}GHz · ${product.polarization} · ${product.connector}`;
    case "payload":
      return `${product.payloadType.replace("_", " ")} · ${product.weightG}g`;
  }
}

type PartsCatalogProps = {
  activeCategory: ProductCategory;
  parts: BuildParts;
  onCategoryChange: (category: ProductCategory) => void;
  onPartChange: (category: ProductCategory, id?: string) => void;
  onHighlight: (category?: ProductCategory) => void;
};

export function PartsCatalog({
  activeCategory,
  parts,
  onCategoryChange,
  onPartChange,
  onHighlight,
}: PartsCatalogProps) {
  const products = productsByCategory(activeCategory);
  const ActiveIcon = categoryIcons[activeCategory];

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-white/8 bg-[#0d1114]/95">
      <div className="border-b border-white/8 px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="tech-label">Parts catalog</p>
            <h2 className="mt-1 text-base font-semibold">Configure your build</h2>
          </div>
          <span className="rounded-full border border-lime-300/20 bg-lime-300/8 px-2 py-1 font-mono text-[10px] text-lime-200">
            {catalog.length} parts
          </span>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {categoryOrder.map((category) => {
            const Icon = categoryIcons[category];
            const selected = Boolean(parts[category]);

            return (
              <button
                key={category}
                type="button"
                title={categoryLabels[category]}
                onClick={() => onCategoryChange(category)}
                className={cn(
                  "relative flex h-9 items-center justify-center rounded-md border transition",
                  activeCategory === category
                    ? "border-lime-300/45 bg-lime-300/12 text-lime-200"
                    : "border-white/7 bg-white/[0.025] text-zinc-500 hover:border-white/15 hover:text-zinc-200",
                )}
              >
                <Icon className="size-3.5" />
                {selected && (
                  <span className="absolute right-1 top-1 size-1 rounded-full bg-lime-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
        <span className="flex size-8 items-center justify-center rounded-md bg-white/5 text-lime-200">
          <ActiveIcon className="size-4" />
        </span>
        <div>
          <p className="text-sm font-medium">{categoryLabels[activeCategory]}</p>
          <p className="text-xs text-zinc-500">
            {products.length} compatible options in catalog
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 scrollbar-thin">
        {activeCategory === "payload" && (
          <button
            type="button"
            onClick={() => onPartChange("payload", undefined)}
            className={cn(
              "w-full rounded-lg border p-3 text-left transition",
              !parts.payload
                ? "border-lime-300/35 bg-lime-300/8"
                : "border-white/8 bg-white/[0.025] hover:border-white/15",
            )}
          >
            <p className="text-sm font-medium">No payload</p>
            <p className="mt-1 text-xs text-zinc-500">Keep the aircraft light.</p>
          </button>
        )}

        {products.map((product) => {
          const selected = parts[activeCategory] === product.id;

          return (
            <article
              key={product.id}
              onMouseEnter={() => onHighlight(activeCategory)}
              onMouseLeave={() => onHighlight(undefined)}
              className={cn(
                "rounded-lg border p-3 transition",
                selected
                  ? "border-lime-300/35 bg-lime-300/[0.07] shadow-[0_0_24px_rgba(190,255,52,0.04)]"
                  : "border-white/8 bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.04]",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-zinc-100">
                      {product.name}
                    </p>
                    {selected && (
                      <span className="rounded bg-lime-300/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-lime-200">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    {keySpec(product)}
                  </p>
                </div>
                <p className="font-mono text-xs text-zinc-300">
                  ${product.priceUsd}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/6 pt-2.5">
                <span className="font-mono text-[10px] text-zinc-500">
                  {product.weightG}g
                </span>
                <Button
                  size="sm"
                  variant={selected ? "secondary" : "default"}
                  className={cn(
                    "h-7 rounded-md px-2.5 text-[11px]",
                    !selected &&
                      "bg-lime-300 text-[#11160d] hover:bg-lime-200",
                  )}
                  onClick={() => onPartChange(activeCategory, product.id)}
                >
                  {selected ? "Selected" : parts[activeCategory] ? "Swap" : "Add"}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </aside>
  );
}
