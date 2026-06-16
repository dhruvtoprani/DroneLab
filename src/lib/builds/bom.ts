import { catalog, categoryLabels, categoryOrder } from "@/lib/data/catalog";
import type { BuildParts, BuildStats } from "@/lib/types/build";

export function getBuildProducts(parts: BuildParts) {
  return categoryOrder.flatMap((category) => {
    const product = catalog.find(
      (item) => item.category === category && item.id === parts[category],
    );

    if (!product) return [];

    const quantity = category === "motor" || category === "propeller" ? 4 : 1;
    const chargedQuantity = category === "motor" ? 4 : 1;

    return [{ product, quantity, chargedQuantity }];
  });
}

export function createBomText(
  name: string,
  parts: BuildParts,
  stats: Pick<
    BuildStats,
    | "totalCostUsd"
    | "totalWeightG"
    | "estimatedFlightTimeMin"
    | "thrustToWeightRatio"
    | "recommendedUseCase"
  >,
) {
  const lines = getBuildProducts(parts).map(
    ({ product, quantity, chargedQuantity }) =>
      `${categoryLabels[product.category]}: ${
        quantity > 1 ? `${quantity}x ` : ""
      }${product.name} - $${(product.priceUsd * chargedQuantity).toFixed(0)}`,
  );

  return [
    `DroneLab Build: ${name}`,
    "",
    ...lines,
    "",
    `Total Cost: $${stats.totalCostUsd.toFixed(0)}`,
    `Total Weight: ${stats.totalWeightG.toFixed(0)}g`,
    `Estimated Flight Time: ${stats.estimatedFlightTimeMin.toFixed(1)} min`,
    `Thrust-to-Weight: ${stats.thrustToWeightRatio.toFixed(1)}:1`,
    `Recommended Use: ${stats.recommendedUseCase}`,
  ].join("\n");
}

export function createBomCsv(parts: BuildParts) {
  const header =
    "category,name,brand,quantity,unit_price,total_price,weight_g,total_weight_g";
  const rows = getBuildProducts(parts).map(
    ({ product, quantity, chargedQuantity }) =>
      [
        categoryLabels[product.category],
        `"${product.name}"`,
        `"${product.brand}"`,
        quantity,
        product.priceUsd.toFixed(2),
        (product.priceUsd * chargedQuantity).toFixed(2),
        product.weightG,
        (product.weightG * quantity).toFixed(1),
      ].join(","),
  );

  return [header, ...rows].join("\n");
}
