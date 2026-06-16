import { NextResponse } from "next/server";
import { calculateBuild } from "@/lib/compatibility/calculateBuild";
import { getExampleBuild } from "@/lib/data/exampleBuilds";
import {
  duplicateSavedBuild,
  getBuildPersistenceStatus,
  getSavedBuild,
  updateSavedBuild,
} from "@/lib/server/buildRepository";
import {
  normalizeBuildParts,
  resolveGoal,
  updateBuildInputSchema,
} from "@/lib/builds/savedBuildSchema";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/builds/[id]">,
) {
  const { id } = await context.params;
  const savedBuild = await getSavedBuild(id);

  if (savedBuild) {
    return NextResponse.json({
      build: savedBuild,
      calculation: calculateBuild(
        savedBuild.parts,
        savedBuild.selectedGoal,
        savedBuild.budgetUsd,
      ),
      persistence: getBuildPersistenceStatus(),
    });
  }

  const exampleBuild = getExampleBuild(id);
  if (exampleBuild) {
    return NextResponse.json({
      build: {
        id,
        name: exampleBuild.name,
        selectedGoal: exampleBuild.goal,
        budgetUsd: exampleBuild.budgetUsd,
        parts: exampleBuild.parts,
        isPublic: true,
      },
      calculation: calculateBuild(
        exampleBuild.parts,
        exampleBuild.goal,
        exampleBuild.budgetUsd,
      ),
      persistence: { mode: "seed", durable: true },
    });
  }

  return NextResponse.json({ error: "Build not found" }, { status: 404 });
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/builds/[id]">,
) {
  const { id } = await context.params;
  const parsed = updateBuildInputSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid build update", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const result = await updateSavedBuild(id, {
    name: input.name,
    description: input.description,
    selectedGoal:
      input.goal || input.selectedGoal ? resolveGoal(input) : undefined,
    budgetUsd: input.budgetUsd,
    parts: input.parts ? normalizeBuildParts(input.parts) : undefined,
    isPublic: input.isPublic,
  });

  if (!result) {
    return NextResponse.json({ error: "Build not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function POST(
  _request: Request,
  context: RouteContext<"/api/builds/[id]">,
) {
  const { id } = await context.params;
  const result = await duplicateSavedBuild(id);

  if (!result) {
    return NextResponse.json({ error: "Build not found" }, { status: 404 });
  }

  return NextResponse.json(result, { status: 201 });
}
