import exampleBuildsData from "../../../data/seed/example_builds.json";
import { calculateBuild } from "@/lib/compatibility/calculateBuild";
import type { BuildGoal, BuildParts } from "@/lib/types/build";

export type ExampleBuild = {
  id: string;
  name: string;
  goal: BuildGoal;
  budgetUsd: number;
  parts: BuildParts;
};

export const exampleBuilds = exampleBuildsData as ExampleBuild[];

export function getExampleBuild(id: string) {
  return exampleBuilds.find((build) => build.id === id);
}

export function getCalculatedExampleBuilds() {
  return exampleBuilds.map((build) => ({
    ...build,
    calculation: calculateBuild(build.parts, build.goal, build.budgetUsd),
  }));
}
