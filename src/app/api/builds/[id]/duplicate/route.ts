import { NextResponse } from "next/server";
import { duplicateSavedBuild } from "@/lib/server/buildRepository";

export async function POST(
  _request: Request,
  context: RouteContext<"/api/builds/[id]/duplicate">,
) {
  const { id } = await context.params;
  const result = await duplicateSavedBuild(id);

  if (!result) {
    return NextResponse.json({ error: "Build not found" }, { status: 404 });
  }

  return NextResponse.json(result, { status: 201 });
}
