import { NextResponse } from "next/server";
import { getCalculatedExampleBuilds } from "@/lib/data/exampleBuilds";

export async function GET() {
  return NextResponse.json({
    builds: getCalculatedExampleBuilds(),
  });
}
