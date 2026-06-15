import type {
  BuildGoal,
  BuildStats,
  BuildWarning,
} from "@/lib/types/build";

export function scoreBuild(
  stats: BuildStats,
  warnings: BuildWarning[],
  goal: BuildGoal,
): BuildStats {
  const compatibilityScore = Math.max(
    0,
    100 -
      warnings.reduce((penalty, warning) => {
        if (warning.severity === "critical") return penalty + 35;
        if (warning.severity === "warning") return penalty + 15;
        return penalty + 5;
      }, 0),
  );

  const ratio = stats.thrustToWeightRatio;
  let performanceScore =
    ratio < 2 ? 30 : ratio < 3 ? 65 : ratio < 5 ? 85 : 95;

  if (goal === "beginner" && ratio > 5) performanceScore -= 15;
  if (goal === "racing" && ratio >= 5) performanceScore = 100;
  if (goal === "cinematic" && ratio >= 3 && ratio <= 5) performanceScore = 92;

  const flightTime = stats.estimatedFlightTimeMin;
  const efficiencyScore =
    flightTime < 3 ? 30 : flightTime < 5 ? 60 : flightTime < 8 ? 80 : 90;

  const targetRatio: Record<BuildGoal, [number, number]> = {
    beginner: [2, 3.5],
    freestyle: [3, 5],
    racing: [5, 10],
    cinematic: [2.5, 4.5],
    long_range: [2, 4],
    payload: [2.5, 5],
  };
  const [minRatio, maxRatio] = targetRatio[goal];
  const ratioFitsGoal = ratio >= minRatio && ratio <= maxRatio;
  const timeFitsGoal =
    goal === "long_range"
      ? flightTime >= 8
      : goal === "cinematic"
        ? flightTime >= 5
        : true;
  const useCaseFitScore = ratioFitsGoal && timeFitsGoal ? 95 : 65;

  const overallScore =
    compatibilityScore * 0.4 +
    performanceScore * 0.25 +
    efficiencyScore * 0.15 +
    stats.costScore * 0.1 +
    useCaseFitScore * 0.1;

  return {
    ...stats,
    compatibilityScore,
    performanceScore,
    efficiencyScore,
    useCaseFitScore,
    overallScore: Math.round(overallScore),
  };
}
