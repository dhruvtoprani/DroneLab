import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { recommendBuilds } from "@/lib/recommendations/recommendBuilds";

const querySchema = z.object({
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
  budgetUsd: z.coerce.number().positive().optional(),
  includePayload: z.coerce.boolean().optional(),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    goal: request.nextUrl.searchParams.get("goal") ?? undefined,
    budgetUsd: request.nextUrl.searchParams.get("budgetUsd") ?? undefined,
    includePayload: request.nextUrl.searchParams.get("includePayload") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid recommendation query", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  return NextResponse.json({
    recommendations: recommendBuilds(parsed.data),
  });
}
