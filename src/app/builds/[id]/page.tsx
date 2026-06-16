import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuildSummary } from "@/components/builds/BuildSummary";
import { decodeBuildFromUrl } from "@/lib/builds/serialization";
import { calculateBuild } from "@/lib/compatibility/calculateBuild";
import { exampleBuilds, getExampleBuild } from "@/lib/data/exampleBuilds";
import { getSavedBuild } from "@/lib/server/buildRepository";

type BuildPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ build?: string }>;
};

export function generateStaticParams() {
  return exampleBuilds.map((build) => ({ id: build.id }));
}

export async function generateMetadata({
  params,
  searchParams,
}: BuildPageProps): Promise<Metadata> {
  const { id } = await params;
  const query = await searchParams;
  const sharedBuild = decodeBuildFromUrl(query.build);
  const exampleBuild = getExampleBuild(id);
  const savedBuild = sharedBuild ? undefined : await getSavedBuild(id);
  const title =
    sharedBuild?.name ?? exampleBuild?.name ?? savedBuild?.name ?? "Shared Build";

  return {
    title: `${title} | DroneLab`,
  };
}

export default async function BuildPage({ params, searchParams }: BuildPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const sharedBuild = decodeBuildFromUrl(query.build);

  if (sharedBuild) {
    const calculation = calculateBuild(
      sharedBuild.parts,
      sharedBuild.goal,
      sharedBuild.budgetUsd,
    );

    return (
      <BuildSummary
        id={id}
        name={sharedBuild.name ?? "Shared DroneLab Build"}
        goal={sharedBuild.goal}
        budgetUsd={sharedBuild.budgetUsd}
        parts={sharedBuild.parts}
        calculation={calculation}
      />
    );
  }

  const exampleBuild = getExampleBuild(id);
  if (exampleBuild) {
    const calculation = calculateBuild(
      exampleBuild.parts,
      exampleBuild.goal,
      exampleBuild.budgetUsd,
    );

    return (
      <BuildSummary
        id={id}
        name={exampleBuild.name}
        goal={exampleBuild.goal}
        budgetUsd={exampleBuild.budgetUsd}
        parts={exampleBuild.parts}
        calculation={calculation}
      />
    );
  }

  const savedBuild = await getSavedBuild(id);
  if (!savedBuild) notFound();

  const calculation = calculateBuild(
    savedBuild.parts,
    savedBuild.selectedGoal,
    savedBuild.budgetUsd,
  );

  return (
    <BuildSummary
      id={id}
      name={savedBuild.name}
      goal={savedBuild.selectedGoal}
      budgetUsd={savedBuild.budgetUsd}
      parts={savedBuild.parts}
      calculation={calculation}
    />
  );
}
