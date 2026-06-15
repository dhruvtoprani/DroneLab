import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateBuild } from "@/lib/compatibility/calculateBuild";
import type { BuildParts } from "@/lib/types/build";

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
  parts: z.object({
    frame: z.string().optional(),
    frameId: z.string().optional(),
    motor: z.string().optional(),
    motorId: z.string().optional(),
    propeller: z.string().optional(),
    propellerId: z.string().optional(),
    battery: z.string().optional(),
    batteryId: z.string().optional(),
    esc: z.string().optional(),
    escId: z.string().optional(),
    flight_controller: z.string().optional(),
    flightControllerId: z.string().optional(),
    camera: z.string().optional(),
    cameraId: z.string().optional(),
    receiver: z.string().optional(),
    receiverId: z.string().optional(),
    vtx: z.string().optional(),
    vtxId: z.string().optional(),
    antenna: z.string().optional(),
    antennaId: z.string().optional(),
    payload: z.string().optional(),
    payloadId: z.string().nullable().optional(),
  }),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid build input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const input = parsed.data.parts;
  const parts: BuildParts = {
    frame: input.frame ?? input.frameId,
    motor: input.motor ?? input.motorId,
    propeller: input.propeller ?? input.propellerId,
    battery: input.battery ?? input.batteryId,
    esc: input.esc ?? input.escId,
    flight_controller:
      input.flight_controller ?? input.flightControllerId,
    camera: input.camera ?? input.cameraId,
    receiver: input.receiver ?? input.receiverId,
    vtx: input.vtx ?? input.vtxId,
    antenna: input.antenna ?? input.antennaId,
    payload: input.payload ?? input.payloadId ?? undefined,
  };

  return NextResponse.json(
    calculateBuild(parts, parsed.data.goal, parsed.data.budgetUsd),
  );
}
