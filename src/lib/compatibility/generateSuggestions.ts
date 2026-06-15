import { productsByCategory } from "@/lib/data/catalog";
import type {
  BuildParts,
  BuildSuggestion,
  BuildWarning,
} from "@/lib/types/build";

export function generateSuggestions(
  parts: BuildParts,
  warnings: BuildWarning[],
): BuildSuggestion[] {
  const suggestions: BuildSuggestion[] = [];

  if (warnings.some((warning) => warning.id === "esc_current_low")) {
    const selectedEscId = parts.esc;
    const strongerEsc = productsByCategory("esc")
      .filter((esc) => esc.id !== selectedEscId)
      .sort((a, b) => b.currentPerChannelA - a.currentPerChannelA)[0];

    suggestions.push({
      id: "upgrade_esc",
      title: "Increase ESC headroom",
      description: strongerEsc
        ? `Try the ${strongerEsc.name} for more current margin.`
        : "Choose an ESC with a higher continuous current rating.",
      recommendedPartId: strongerEsc?.id,
      reason: "More current headroom reduces the chance of overheating or failure during throttle spikes.",
    });
  }

  if (warnings.some((warning) => warning.id === "prop_too_large")) {
    suggestions.push({
      id: "smaller_propeller",
      title: "Use a smaller propeller",
      description: "Match propeller diameter to the frame's stated maximum size.",
      reason: "Oversized propellers can strike the frame or each other.",
    });
  }

  if (warnings.some((warning) => warning.id === "over_budget")) {
    suggestions.push({
      id: "reduce_cost",
      title: "Target the highest-cost component",
      description: "The motor set, video system, and payload usually offer the largest savings.",
      reason: "Replacing one expensive subsystem is clearer than compromising every component.",
    });
  }

  if (suggestions.length === 0 && warnings.length > 0) {
    const highestPriorityWarning =
      warnings.find((warning) => warning.severity === "critical") ??
      warnings.find((warning) => warning.severity === "warning") ??
      warnings[0];

    suggestions.push({
      id: `resolve_${highestPriorityWarning.id}`,
      title: "Resolve the compatibility issue",
      description:
        highestPriorityWarning.suggestedFix ??
        "Change one of the affected parts and re-run the build checks.",
      reason: highestPriorityWarning.description,
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      id: "healthy_build",
      title: "Build is ready for refinement",
      description: "Compatibility checks pass. Tune battery size or prop pitch to explore the performance tradeoff.",
      reason: "Small powertrain changes are the fastest way to compare flight time and responsiveness.",
    });
  }

  return suggestions.slice(0, 3);
}
