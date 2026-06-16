import type { ProductCategory } from "@/lib/types/product";

export type BuildGoal =
  | "beginner"
  | "freestyle"
  | "racing"
  | "cinematic"
  | "long_range"
  | "payload";

export type BuildParts = Partial<Record<ProductCategory, string>>;

export type BuildWarning = {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  affectedParts: string[];
  suggestedFix?: string;
};

export type BuildSuggestion = {
  id: string;
  title: string;
  description: string;
  recommendedPartId?: string;
  reason: string;
};

export type BuildStats = {
  totalWeightG: number;
  totalCostUsd: number;
  batteryWh: number;
  usableBatteryWh: number;
  totalMaxThrustG: number;
  thrustToWeightRatio: number;
  estimatedAverageCurrentA: number;
  estimatedFlightTimeMin: number;
  maxCurrentPerMotorA: number;
  totalMaxCurrentA: number;
  batteryMaxCurrentA: number;
  escSafetyMarginA: number;
  payloadMarginG: number;
  overallScore: number;
  compatibilityScore: number;
  performanceScore: number;
  efficiencyScore: number;
  costScore: number;
  useCaseFitScore: number;
  recommendedUseCase: string;
};

export type BuildCalculation = {
  stats: BuildStats;
  warnings: BuildWarning[];
  suggestions: BuildSuggestion[];
  status: "valid" | "warning" | "critical";
};

export type DroneBuild = {
  id: string;
  name: string;
  description?: string;
  selectedGoal: BuildGoal;
  budgetUsd?: number;
  parts: BuildParts;
  calculatedStats: BuildStats;
  warnings: BuildWarning[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};
