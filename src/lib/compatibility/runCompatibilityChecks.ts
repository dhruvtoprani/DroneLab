import { categoryLabels, categoryOrder, getProduct } from "@/lib/data/catalog";
import type {
  BuildParts,
  BuildStats,
  BuildWarning,
} from "@/lib/types/build";

const requiredCategories = categoryOrder.filter(
  (category) => category !== "payload",
);

export function runCompatibilityChecks(
  parts: BuildParts,
  stats: BuildStats,
  budgetUsd?: number,
): BuildWarning[] {
  const warnings: BuildWarning[] = [];
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
  const vtx = getProduct("vtx", parts.vtx);
  const antenna = getProduct("antenna", parts.antenna);
  const payload = getProduct("payload", parts.payload);

  for (const category of requiredCategories) {
    if (!parts[category]) {
      warnings.push({
        id: `missing_${category}`,
        severity: "info",
        title: `${categoryLabels[category]} not selected`,
        description: `Add a ${categoryLabels[category].toLowerCase()} to complete the build analysis.`,
        affectedParts: [],
        suggestedFix: `Choose a ${categoryLabels[category].toLowerCase()} from the catalog.`,
      });
    }
  }

  if (frame && propeller && propeller.diameterIn > frame.maxPropSizeIn) {
    warnings.push({
      id: "prop_too_large",
      severity: "critical",
      title: "Propellers are too large",
      description: `The selected ${propeller.diameterIn}-inch propellers exceed the ${frame.maxPropSizeIn}-inch maximum supported by this frame.`,
      affectedParts: [frame.id, propeller.id],
      suggestedFix: `Choose a propeller with a diameter of ${frame.maxPropSizeIn} inches or smaller.`,
    });
  }

  if (
    frame &&
    motor &&
    frame.motorMountPattern !== motor.mountPattern
  ) {
    warnings.push({
      id: "motor_mount_mismatch",
      severity: "critical",
      title: "Motor mounting pattern does not fit",
      description: `The frame uses a ${frame.motorMountPattern} motor pattern, but the selected motors use ${motor.mountPattern}.`,
      affectedParts: [frame.id, motor.id],
      suggestedFix: "Choose motors with the frame's mounting pattern.",
    });
  }

  if (
    motor &&
    battery &&
    (battery.cellCount < motor.supportedCellMin ||
      battery.cellCount > motor.supportedCellMax)
  ) {
    warnings.push({
      id: "motor_voltage_mismatch",
      severity: "critical",
      title: "Battery voltage is unsafe for the motors",
      description: `These motors support ${motor.supportedCellMin}S-${motor.supportedCellMax}S batteries, but the selected pack is ${battery.cellCount}S.`,
      affectedParts: [motor.id, battery.id],
      suggestedFix: `Choose a ${motor.supportedCellMin}S-${motor.supportedCellMax}S battery or a motor designed for ${battery.cellCount}S.`,
    });
  }

  if (
    esc &&
    battery &&
    (battery.cellCount < esc.supportedCellMin ||
      battery.cellCount > esc.supportedCellMax)
  ) {
    warnings.push({
      id: "esc_voltage_mismatch",
      severity: "critical",
      title: "ESC does not support this battery",
      description: `The ESC supports ${esc.supportedCellMin}S-${esc.supportedCellMax}S input, but the battery is ${battery.cellCount}S.`,
      affectedParts: [esc.id, battery.id],
      suggestedFix: "Choose an ESC with a compatible voltage range.",
    });
  }

  if (esc && stats.maxCurrentPerMotorA > 0 && stats.escSafetyMarginA < 0) {
    warnings.push({
      id: "esc_current_low",
      severity: "critical",
      title: "ESC current rating is too low",
      description: `Each motor may draw ${stats.maxCurrentPerMotorA.toFixed(1)}A. With safety headroom, the ESC should provide at least ${(stats.maxCurrentPerMotorA * 1.1).toFixed(1)}A per channel.`,
      affectedParts: [esc.id, motor?.id ?? ""].filter(Boolean),
      suggestedFix: "Use a higher-current ESC or a less aggressive motor and propeller combination.",
    });
  }

  if (
    battery &&
    stats.totalMaxCurrentA > 0 &&
    stats.batteryMaxCurrentA < stats.totalMaxCurrentA
  ) {
    warnings.push({
      id: "battery_current_low",
      severity: "critical",
      title: "Battery discharge rating is too low",
      description: `The pack is rated for about ${stats.batteryMaxCurrentA.toFixed(0)}A, while the powertrain may demand ${stats.totalMaxCurrentA.toFixed(0)}A at full throttle.`,
      affectedParts: [battery.id, motor?.id ?? ""].filter(Boolean),
      suggestedFix: "Choose a higher-C battery, a larger-capacity pack, or a lower-current powertrain.",
    });
  }

  if (
    frame &&
    flightController &&
    !frame.supportedStackMounts.includes(flightController.mountingPattern)
  ) {
    warnings.push({
      id: "fc_mount_mismatch",
      severity: "critical",
      title: "Flight controller does not fit the frame",
      description: `The ${flightController.mountingPattern} controller does not match the frame's supported stack patterns.`,
      affectedParts: [frame.id, flightController.id],
      suggestedFix: `Choose a controller using ${frame.supportedStackMounts.join(" or ")} mounting.`,
    });
  }

  if (
    frame &&
    esc &&
    !frame.supportedStackMounts.includes(esc.mountingPattern)
  ) {
    warnings.push({
      id: "esc_mount_mismatch",
      severity: "critical",
      title: "ESC does not fit the frame",
      description: `The ${esc.mountingPattern} ESC does not match the frame's supported stack patterns.`,
      affectedParts: [frame.id, esc.id],
      suggestedFix: `Choose an ESC using ${frame.supportedStackMounts.join(" or ")} mounting.`,
    });
  }

  if (
    frame &&
    camera &&
    !frame.cameraSizeSupport.includes(camera.cameraSize)
  ) {
    warnings.push({
      id: "camera_size_mismatch",
      severity: "warning",
      title: "Camera may not fit the frame cage",
      description: `The frame supports ${frame.cameraSizeSupport.join(" and ")} cameras, but the selected camera is ${camera.cameraSize}.`,
      affectedParts: [frame.id, camera.id],
      suggestedFix: "Choose a supported camera size or verify an adapter is available.",
    });
  }

  if (
    frame &&
    battery &&
    ((frame.batteryMountMaxLengthMm &&
      battery.dimensions.lengthMm > frame.batteryMountMaxLengthMm) ||
      (frame.batteryMountMaxWidthMm &&
        battery.dimensions.widthMm > frame.batteryMountMaxWidthMm))
  ) {
    warnings.push({
      id: "battery_size_mismatch",
      severity: "warning",
      title: "Battery may not fit securely",
      description: "The selected battery exceeds the frame's recommended battery mounting area.",
      affectedParts: [frame.id, battery.id],
      suggestedFix: "Choose a smaller pack or verify the mounting strap and center-of-mass position.",
    });
  }

  if (
    vtx?.antennaConnector &&
    antenna &&
    vtx.antennaConnector !== antenna.connector
  ) {
    warnings.push({
      id: "antenna_connector_mismatch",
      severity: "critical",
      title: "Antenna connector does not match the VTX",
      description: `The VTX uses ${vtx.antennaConnector}, while the antenna uses ${antenna.connector}.`,
      affectedParts: [vtx.id, antenna.id],
      suggestedFix: "Choose a matching antenna connector or an appropriate RF adapter.",
    });
  }

  if (stats.thrustToWeightRatio > 0 && stats.thrustToWeightRatio < 2) {
    warnings.push({
      id: "weak_thrust_ratio",
      severity: "critical",
      title: "Build has too little thrust reserve",
      description: `The estimated thrust-to-weight ratio is ${stats.thrustToWeightRatio.toFixed(1)}:1. A practical quad should stay above 2:1.`,
      affectedParts: [motor?.id ?? "", payload?.id ?? ""].filter(Boolean),
      suggestedFix: "Reduce weight or choose a stronger motor, propeller, and battery combination.",
    });
  }

  if (payload && stats.payloadMarginG < 0) {
    warnings.push({
      id: "payload_too_heavy",
      severity: "critical",
      title: "Payload exceeds the useful thrust reserve",
      description: `The selected payload pushes the build about ${Math.abs(stats.payloadMarginG).toFixed(0)}g beyond the recommended payload limit.`,
      affectedParts: [payload.id, frame?.id ?? ""].filter(Boolean),
      suggestedFix: "Use a lighter payload or a larger, higher-thrust platform.",
    });
  }

  if (budgetUsd && stats.totalCostUsd > budgetUsd) {
    warnings.push({
      id: "over_budget",
      severity: "warning",
      title: "Build exceeds the selected budget",
      description: `The build is $${(stats.totalCostUsd - budgetUsd).toFixed(0)} over the $${budgetUsd.toFixed(0)} target.`,
      affectedParts: [],
      suggestedFix: "Swap one or more parts for lower-cost alternatives.",
    });
  }

  return warnings;
}
