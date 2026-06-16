import { calculateBuild } from "@/lib/compatibility/calculateBuild";
import { productsByCategory } from "@/lib/data/catalog";
import type { BuildCalculation, BuildGoal, BuildParts } from "@/lib/types/build";

export type BuildRecommendation = {
  id: "best_match" | "budget_pick" | "performance_pick";
  label: string;
  name: string;
  reason: string;
  goal: BuildGoal;
  budgetUsd?: number;
  parts: BuildParts;
  calculation: BuildCalculation;
};

type Candidate = {
  parts: BuildParts;
  calculation: BuildCalculation;
};

function scoreCandidate(candidate: Candidate, budgetUsd?: number) {
  const { stats, warnings } = candidate.calculation;
  const budgetPenalty =
    budgetUsd && stats.totalCostUsd > budgetUsd
      ? Math.min(30, ((stats.totalCostUsd - budgetUsd) / budgetUsd) * 100)
      : 0;
  const warningPenalty = warnings.length * 3;

  return stats.overallScore - budgetPenalty - warningPenalty;
}

export function recommendBuilds({
  goal,
  budgetUsd,
  includePayload,
}: {
  goal: BuildGoal;
  budgetUsd?: number;
  includePayload?: boolean;
}): BuildRecommendation[] {
  const candidates: Candidate[] = [];
  const payloadOptions =
    includePayload || goal === "payload" || goal === "cinematic"
      ? [undefined, ...productsByCategory("payload").map((product) => product.id)]
      : [undefined];

  for (const frame of productsByCategory("frame")) {
    for (const motor of productsByCategory("motor")) {
      for (const propeller of productsByCategory("propeller")) {
        for (const battery of productsByCategory("battery")) {
          for (const esc of productsByCategory("esc")) {
            for (const flightController of productsByCategory("flight_controller")) {
              for (const camera of productsByCategory("camera")) {
                for (const receiver of productsByCategory("receiver")) {
                  for (const vtx of productsByCategory("vtx")) {
                    for (const antenna of productsByCategory("antenna")) {
                      for (const payload of payloadOptions) {
                        const parts: BuildParts = {
                          frame: frame.id,
                          motor: motor.id,
                          propeller: propeller.id,
                          battery: battery.id,
                          esc: esc.id,
                          flight_controller: flightController.id,
                          camera: camera.id,
                          receiver: receiver.id,
                          vtx: vtx.id,
                          antenna: antenna.id,
                          payload,
                        };
                        const calculation = calculateBuild(parts, goal, budgetUsd);

                        if (calculation.status !== "critical") {
                          candidates.push({ parts, calculation });
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  const sorted = [...candidates].sort(
    (a, b) => scoreCandidate(b, budgetUsd) - scoreCandidate(a, budgetUsd),
  );
  const best = sorted[0];
  const budget =
    [...candidates]
      .filter(
        (candidate) =>
          !budgetUsd || candidate.calculation.stats.totalCostUsd <= budgetUsd,
      )
      .sort((a, b) => {
        const scoreDelta =
          b.calculation.stats.overallScore - a.calculation.stats.overallScore;
        if (Math.abs(scoreDelta) > 6) return scoreDelta;
        return a.calculation.stats.totalCostUsd - b.calculation.stats.totalCostUsd;
      })[0] ?? best;
  const performance =
    [...candidates].sort(
      (a, b) =>
        b.calculation.stats.thrustToWeightRatio -
        a.calculation.stats.thrustToWeightRatio,
    )[0] ?? best;

  const picks = [
    {
      id: "best_match" as const,
      label: "Best Match",
      name: "Balanced Mission Build",
      reason:
        "Highest combined score after compatibility, performance, efficiency, budget, and use-case fit.",
      candidate: best,
    },
    {
      id: "budget_pick" as const,
      label: "Budget Pick",
      name: "Cost-Controlled Build",
      reason:
        "Keeps the build close to budget while preserving a healthy compatibility score.",
      candidate: budget,
    },
    {
      id: "performance_pick" as const,
      label: "Performance Pick",
      name: "High-Thrust Build",
      reason: "Prioritizes thrust reserve for aggressive handling or payload margin.",
      candidate: performance,
    },
  ];

  return picks.flatMap(({ candidate, ...pick }) =>
    candidate
      ? [
          {
            ...pick,
            goal,
            budgetUsd,
            parts: candidate.parts,
            calculation: candidate.calculation,
          },
        ]
      : [],
  );
}
