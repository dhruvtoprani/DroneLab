import { getProduct } from "@/lib/data/catalog";
import type { BuildParts, BuildStats } from "@/lib/types/build";

export function classifyUseCase(
  stats: BuildStats,
  parts: BuildParts,
): string {
  const frame = getProduct("frame", parts.frame);
  const payload = getProduct("payload", parts.payload);

  if (
    payload &&
    stats.payloadMarginG > 100 &&
    stats.thrustToWeightRatio >= 2.5
  ) {
    return "Payload";
  }

  if (
    frame?.recommendedUseCases.includes("long_range") &&
    stats.estimatedFlightTimeMin >= 8
  ) {
    return "Long-range";
  }

  if (stats.thrustToWeightRatio >= 5 && stats.totalWeightG < 600) {
    return "Racing";
  }

  if (
    payload?.payloadType === "action_camera" &&
    stats.estimatedFlightTimeMin >= 4.5
  ) {
    return "Cinematic";
  }

  if (stats.thrustToWeightRatio >= 3) {
    return "Freestyle";
  }

  if (stats.thrustToWeightRatio >= 2) {
    return "Beginner";
  }

  return "Needs revision";
}
