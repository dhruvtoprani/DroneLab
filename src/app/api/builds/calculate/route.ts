import { NextResponse } from "next/server";
import { z } from "zod";
import {
  buildPartsInputSchema,
  normalizeBuildParts,
} from "@/lib/builds/savedBuildSchema";
import { calculateBuild } from "@/lib/compatibility/calculateBuild";

const requestSchema = z.object({
  goal: z
    .enum([
      "beginner",
      "freestyle",
      "racing",
      "cinematic",
      "long_range",
      "payload",
    ])
    .default("freestyle"),
  budgetUsd: z.number().positive().optional(),
  parts: buildPartsInputSchema,
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid build input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const parts = normalizeBuildParts(parsed.data.parts);

  return NextResponse.json(
    calculateBuild(parts, parsed.data.goal, parsed.data.budgetUsd),
  );
}
