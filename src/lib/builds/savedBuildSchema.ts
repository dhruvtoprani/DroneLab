import { z } from "zod";
import type { BuildGoal, BuildParts } from "@/lib/types/build";

const buildGoalSchema = z.enum([
  "beginner",
  "freestyle",
  "racing",
  "cinematic",
  "long_range",
  "payload",
]);

export const buildPartsInputSchema = z.object({
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
  payload: z.string().nullable().optional(),
  payloadId: z.string().nullable().optional(),
});

export const saveBuildInputSchema = z.object({
  name: z.string().trim().min(1).max(120).default("Untitled DroneLab Build"),
  description: z.string().trim().max(1000).optional(),
  goal: buildGoalSchema.default("freestyle"),
  selectedGoal: buildGoalSchema.optional(),
  budgetUsd: z.number().positive().optional(),
  parts: buildPartsInputSchema,
  isPublic: z.boolean().default(false),
});

export const updateBuildInputSchema = saveBuildInputSchema.partial().extend({
  parts: buildPartsInputSchema.optional(),
});

export type SaveBuildInput = z.infer<typeof saveBuildInputSchema>;
export type UpdateBuildInput = z.infer<typeof updateBuildInputSchema>;

export function normalizeBuildParts(input: z.infer<typeof buildPartsInputSchema>) {
  return {
    frame: input.frame ?? input.frameId,
    motor: input.motor ?? input.motorId,
    propeller: input.propeller ?? input.propellerId,
    battery: input.battery ?? input.batteryId,
    esc: input.esc ?? input.escId,
    flight_controller: input.flight_controller ?? input.flightControllerId,
    camera: input.camera ?? input.cameraId,
    receiver: input.receiver ?? input.receiverId,
    vtx: input.vtx ?? input.vtxId,
    antenna: input.antenna ?? input.antennaId,
    payload: input.payload ?? input.payloadId ?? undefined,
  } satisfies BuildParts;
}

export function resolveGoal(input: {
  goal?: BuildGoal;
  selectedGoal?: BuildGoal;
}) {
  return input.selectedGoal ?? input.goal ?? "freestyle";
}
