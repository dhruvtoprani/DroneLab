import { NextResponse } from "next/server";
import { createSavedBuild } from "@/lib/server/buildRepository";
import {
  normalizeBuildParts,
  resolveGoal,
  saveBuildInputSchema,
} from "@/lib/builds/savedBuildSchema";

export async function POST(request: Request) {
  const parsed = saveBuildInputSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid build input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const result = await createSavedBuild({
    name: input.name,
    description: input.description,
    selectedGoal: resolveGoal(input),
    budgetUsd: input.budgetUsd,
    parts: normalizeBuildParts(input.parts),
    isPublic: input.isPublic,
  });

  return NextResponse.json(result, { status: 201 });
}
