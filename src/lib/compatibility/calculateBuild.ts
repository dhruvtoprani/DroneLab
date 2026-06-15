import { calculateBuildStats } from "@/lib/compatibility/calculateBuildStats";
import { classifyUseCase } from "@/lib/compatibility/classifyUseCase";
import { generateSuggestions } from "@/lib/compatibility/generateSuggestions";
import { runCompatibilityChecks } from "@/lib/compatibility/runCompatibilityChecks";
import { scoreBuild } from "@/lib/compatibility/scoreBuild";
import type {
  BuildCalculation,
  BuildGoal,
  BuildParts,
} from "@/lib/types/build";

export function calculateBuild(
  parts: BuildParts,
  goal: BuildGoal,
  budgetUsd?: number,
): BuildCalculation {
  const rawStats = calculateBuildStats(parts, goal, budgetUsd);
  const warnings = runCompatibilityChecks(parts, rawStats, budgetUsd);
  const scoredStats = scoreBuild(rawStats, warnings, goal);
  const recommendedUseCase = classifyUseCase(scoredStats, parts);
  const stats = { ...scoredStats, recommendedUseCase };
  const suggestions = generateSuggestions(parts, warnings);
  const status = warnings.some((warning) => warning.severity === "critical")
    ? "critical"
    : warnings.some((warning) => warning.severity === "warning")
      ? "warning"
      : "valid";

  return { stats, warnings, suggestions, status };
}
