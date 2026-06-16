import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuildSummary } from "@/components/builds/BuildSummary";
import { calculateBuild } from "@/lib/compatibility/calculateBuild";
import { exampleBuilds, getExampleBuild } from "@/lib/data/exampleBuilds";
import { decodeBuildFromUrl } from "@/lib/builds/serialization";

type BuildPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ build?: string }>;
};

export function generateStaticParams() {
  return exampleBuilds.map((build) => ({ id: build.id }));
}

export async function generateMetadata({
  params,
}: BuildPageProps): Promise<Metadata> {
  const { id } = await params;
  const build = getExampleBuild(id);

  return {
    title: `${build?.name ?? "Shared Build"} | DroneLab`,
  };
}

export default async function BuildPage({ params, searchParams }: BuildPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const sharedBuild = decodeBuildFromUrl(query.build);
  const exampleBuild = getExampleBuild(id);
  const build = sharedBuild ?? exampleBuild;

  if (!build) notFound();

  const calculation = calculateBuild(
    build.parts,
    build.goal,
    build.budgetUsd,
  );

  return (
    <BuildSummary
      id={id}
      name={build.name ?? "Shared DroneLab Build"}
      goal={build.goal}
      budgetUsd={build.budgetUsd}
      parts={build.parts}
      calculation={calculation}
    />
  );
}
