import { getProduct } from "@/lib/data/catalog";
import type { BuildGoal, BuildParts, BuildStats } from "@/lib/types/build";

const FLIGHT_STYLE_MULTIPLIER: Record<BuildGoal, number> = {
  beginner: 1.1,
  cinematic: 1.2,
  freestyle: 1.5,
  racing: 1.8,
  long_range: 1,
  payload: 1.4,
};

export function calculateBuildStats(
  parts: BuildParts,
  goal: BuildGoal,
  budgetUsd?: number,
): BuildStats {
  const frame = getProduct("frame", parts.frame);
  const motor = getProduct("motor", parts.motor);
  const propeller = getProduct("propeller", parts.propeller);
  const battery = getProduct("battery", parts.battery);
  const esc = getProduct("esc", parts.esc);
  const flightController = getProduct(
    "flight_controller",
    parts.flight_controller,
  );
  const camera = getProduct("camera", parts.camera);
  const receiver = getProduct("receiver", parts.receiver);
  const vtx = getProduct("vtx", parts.vtx);
  const antenna = getProduct("antenna", parts.antenna);
  const payload = getProduct("payload", parts.payload);

  const totalWeightG =
    (frame?.weightG ?? 0) +
    4 * (motor?.weightG ?? 0) +
    4 * (propeller?.weightG ?? 0) +
    (battery?.weightG ?? 0) +
    (esc?.weightG ?? 0) +
    (flightController?.weightG ?? 0) +
    (camera?.weightG ?? 0) +
    (receiver?.weightG ?? 0) +
    (vtx?.weightG ?? 0) +
    (antenna?.weightG ?? 0) +
    (payload?.weightG ?? 0) +
    20 +
    15;

  const totalCostUsd =
    (frame?.priceUsd ?? 0) +
    4 * (motor?.priceUsd ?? 0) +
    (propeller?.priceUsd ?? 0) +
    (battery?.priceUsd ?? 0) +
    (esc?.priceUsd ?? 0) +
    (flightController?.priceUsd ?? 0) +
    (camera?.priceUsd ?? 0) +
    (receiver?.priceUsd ?? 0) +
    (vtx?.priceUsd ?? 0) +
    (antenna?.priceUsd ?? 0) +
    (payload?.priceUsd ?? 0);

  const nominalVoltage = (battery?.cellCount ?? 0) * 3.7;
  const capacityAh = (battery?.capacityMah ?? 0) / 1000;
  const batteryWh = nominalVoltage * capacityAh;
  const usableBatteryWh = batteryWh * 0.8;
  const batteryMaxCurrentA = capacityAh * (battery?.cRating ?? 0);

  const exactTest = motor?.thrustTests.find(
    (test) =>
      test.propellerId === propeller?.id &&
      test.cellCount === battery?.cellCount,
  );
  const voltageScale = battery ? battery.cellCount / 6 : 0;
  const propScale = propeller ? propeller.diameterIn / 5 : 0;
  const fallbackMaxThrustG =
    motor && propeller && battery
      ? Math.max(0, motor.kv * 0.38 * voltageScale * propScale)
      : 0;
  const maxThrustPerMotorG = exactTest?.maxThrustG ?? fallbackMaxThrustG;
  const maxCurrentPerMotorA =
    exactTest?.maxCurrentA ?? (motor?.maxCurrentA ?? 0) * 0.9;
  const hoverCurrentPerMotorA =
    exactTest?.hoverCurrentAEstimate ??
    (maxCurrentPerMotorA > 0 ? maxCurrentPerMotorA * 0.065 : 0);

  const totalMaxThrustG = maxThrustPerMotorG * 4;
  const thrustToWeightRatio =
    totalWeightG > 0 ? totalMaxThrustG / totalWeightG : 0;
  const estimatedAverageCurrentA =
    4 * hoverCurrentPerMotorA * FLIGHT_STYLE_MULTIPLIER[goal];
  const estimatedFlightTimeMin =
    estimatedAverageCurrentA > 0
      ? (capacityAh * 0.8 * 60) / estimatedAverageCurrentA
      : 0;
  const totalMaxCurrentA = maxCurrentPerMotorA * 4;
  const escSafetyMarginA =
    (esc?.currentPerChannelA ?? 0) - maxCurrentPerMotorA * 1.1;
  const payloadMarginG =
    totalMaxThrustG > 0 ? totalMaxThrustG / 2.5 - totalWeightG : 0;

  const costScore =
    !budgetUsd || totalCostUsd <= budgetUsd
      ? 100
      : totalCostUsd <= budgetUsd * 1.1
        ? 75
        : totalCostUsd <= budgetUsd * 1.25
          ? 50
          : 25;

  return {
    totalWeightG,
    totalCostUsd,
    batteryWh,
    usableBatteryWh,
    totalMaxThrustG,
    thrustToWeightRatio,
    estimatedAverageCurrentA,
    estimatedFlightTimeMin,
    maxCurrentPerMotorA,
    totalMaxCurrentA,
    batteryMaxCurrentA,
    escSafetyMarginA,
    payloadMarginG,
    overallScore: 0,
    compatibilityScore: 0,
    performanceScore: 0,
    efficiencyScore: 0,
    costScore,
    useCaseFitScore: 0,
    recommendedUseCase: "Unclassified",
  };
}
