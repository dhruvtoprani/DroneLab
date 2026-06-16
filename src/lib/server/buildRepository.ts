import type { Build as BuildRow, Prisma } from "@prisma/client";
import { calculateBuild } from "@/lib/compatibility/calculateBuild";
import {
  encodeBuildForUrl,
  type SerializedBuild,
} from "@/lib/builds/serialization";
import { getPrisma, hasDatabaseUrl } from "@/lib/server/prisma";
import type {
  BuildGoal,
  BuildParts,
  DroneBuild,
} from "@/lib/types/build";

type StoredBuildMap = Map<string, DroneBuild>;

type BuildRecordInput = {
  name: string;
  description?: string;
  selectedGoal: BuildGoal;
  budgetUsd?: number;
  parts: BuildParts;
  isPublic?: boolean;
};

type BuildUpdateInput = Partial<BuildRecordInput>;

const globalForBuilds = globalThis as typeof globalThis & {
  __dronelabBuilds?: StoredBuildMap;
};

function getMemoryStore() {
  if (!globalForBuilds.__dronelabBuilds) {
    globalForBuilds.__dronelabBuilds = new Map();
  }

  return globalForBuilds.__dronelabBuilds;
}

function createBuildId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `build_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function createSharePath(build: SerializedBuild) {
  return `/builds/shared?build=${encodeBuildForUrl(build)}`;
}

function toInputJson(value: unknown) {
  return value as Prisma.InputJsonValue;
}

function buildToResponse(
  build: DroneBuild,
  calculation = calculateBuild(build.parts, build.selectedGoal, build.budgetUsd),
) {
  return {
    build,
    calculation,
    paths: {
      summary: `/builds/${build.id}`,
      share: createSharePath({
        name: build.name,
        goal: build.selectedGoal,
        budgetUsd: build.budgetUsd,
        parts: build.parts,
      }),
    },
    persistence: getBuildPersistenceStatus(),
  };
}

function mapBuildRow(row: BuildRow): DroneBuild {
  const parts = row.parts as BuildParts;
  const calculation = calculateBuild(
    parts,
    (row.selectedGoal ?? "freestyle") as BuildGoal,
    row.budgetUsd === null ? undefined : Number(row.budgetUsd),
  );

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    selectedGoal: (row.selectedGoal ?? "freestyle") as BuildGoal,
    budgetUsd: row.budgetUsd === null ? undefined : Number(row.budgetUsd),
    parts,
    calculatedStats:
      row.calculatedStats === null
        ? calculation.stats
        : (row.calculatedStats as DroneBuild["calculatedStats"]),
    warnings:
      row.warnings === null
        ? calculation.warnings
        : (row.warnings as DroneBuild["warnings"]),
    isPublic: row.isPublic,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function getBuildPersistenceStatus() {
  const databaseConfigured = hasDatabaseUrl();

  return {
    databaseConfigured,
    mode: databaseConfigured ? "database" : "share_link",
    durable: databaseConfigured,
    message: databaseConfigured
      ? "Saved builds are persisted in Postgres through Prisma."
      : "DATABASE_URL is not configured. Saved builds use encoded share links until a database is attached.",
  };
}

export async function createSavedBuild(input: BuildRecordInput) {
  const calculation = calculateBuild(
    input.parts,
    input.selectedGoal,
    input.budgetUsd,
  );

  const prisma = getPrisma();
  if (prisma) {
    const row = await prisma.build.create({
      data: {
        name: input.name,
        description: input.description,
        selectedGoal: input.selectedGoal,
        budgetUsd: input.budgetUsd,
        parts: toInputJson(input.parts),
        calculatedStats: toInputJson(calculation.stats),
        warnings: toInputJson(calculation.warnings),
        isPublic: input.isPublic ?? false,
      },
    });

    return buildToResponse(mapBuildRow(row), calculation);
  }

  const now = new Date().toISOString();
  const build: DroneBuild = {
    id: createBuildId(),
    name: input.name,
    description: input.description,
    selectedGoal: input.selectedGoal,
    budgetUsd: input.budgetUsd,
    parts: input.parts,
    calculatedStats: calculation.stats,
    warnings: calculation.warnings,
    isPublic: input.isPublic ?? false,
    createdAt: now,
    updatedAt: now,
  };

  getMemoryStore().set(build.id, build);

  return buildToResponse(build, calculation);
}

export async function getSavedBuild(id: string) {
  const prisma = getPrisma();
  if (prisma) {
    const row = await prisma.build.findUnique({ where: { id } });
    return row ? mapBuildRow(row) : undefined;
  }

  return getMemoryStore().get(id);
}

export async function updateSavedBuild(id: string, input: BuildUpdateInput) {
  const existing = await getSavedBuild(id);
  if (!existing) return undefined;

  const selectedGoal = input.selectedGoal ?? existing.selectedGoal;
  const budgetUsd =
    "budgetUsd" in input ? input.budgetUsd : existing.budgetUsd;
  const parts = input.parts ?? existing.parts;
  const calculation = calculateBuild(parts, selectedGoal, budgetUsd);

  const prisma = getPrisma();
  if (prisma) {
    const row = await prisma.build.update({
      where: { id },
      data: {
        name: input.name ?? existing.name,
        description:
          "description" in input ? input.description : existing.description,
        selectedGoal,
        budgetUsd,
        parts: toInputJson(parts),
        calculatedStats: toInputJson(calculation.stats),
        warnings: toInputJson(calculation.warnings),
        isPublic: input.isPublic ?? existing.isPublic,
      },
    });

    return buildToResponse(mapBuildRow(row), calculation);
  }

  const updated: DroneBuild = {
    ...existing,
    name: input.name ?? existing.name,
    description:
      "description" in input ? input.description : existing.description,
    selectedGoal,
    budgetUsd,
    parts,
    calculatedStats: calculation.stats,
    warnings: calculation.warnings,
    isPublic: input.isPublic ?? existing.isPublic,
    updatedAt: new Date().toISOString(),
  };

  getMemoryStore().set(id, updated);

  return buildToResponse(updated, calculation);
}

export async function duplicateSavedBuild(id: string) {
  const existing = await getSavedBuild(id);
  if (!existing) return undefined;

  return createSavedBuild({
    name: `${existing.name} Copy`,
    description: existing.description,
    selectedGoal: existing.selectedGoal,
    budgetUsd: existing.budgetUsd,
    parts: existing.parts,
    isPublic: false,
  });
}
