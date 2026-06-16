import { calculateBuild } from "@/lib/compatibility/calculateBuild";
import {
  encodeBuildForUrl,
  type SerializedBuild,
} from "@/lib/builds/serialization";
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

export function getBuildPersistenceStatus() {
  const databaseConfigured = Boolean(process.env.DATABASE_URL);

  return {
    databaseConfigured,
    mode: databaseConfigured ? "database_unwired" : "share_link",
    durable: false,
    message: databaseConfigured
      ? "DATABASE_URL is configured, but this checkpoint has not enabled the Prisma runtime adapter yet."
      : "DATABASE_URL is not configured. Saved builds use encoded share links until a database is attached.",
  };
}

export async function createSavedBuild(input: BuildRecordInput) {
  const now = new Date().toISOString();
  const calculation = calculateBuild(
    input.parts,
    input.selectedGoal,
    input.budgetUsd,
  );
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

  const sharePath = createSharePath({
    name: build.name,
    goal: build.selectedGoal,
    budgetUsd: build.budgetUsd,
    parts: build.parts,
  });

  return {
    build,
    calculation,
    paths: {
      summary: `/builds/${build.id}`,
      share: sharePath,
    },
    persistence: getBuildPersistenceStatus(),
  };
}

export async function getSavedBuild(id: string) {
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

  return {
    build: updated,
    calculation,
    paths: {
      summary: `/builds/${updated.id}`,
      share: createSharePath({
        name: updated.name,
        goal: updated.selectedGoal,
        budgetUsd: updated.budgetUsd,
        parts: updated.parts,
      }),
    },
    persistence: getBuildPersistenceStatus(),
  };
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
