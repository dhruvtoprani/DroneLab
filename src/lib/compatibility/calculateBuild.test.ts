import { describe, expect, it } from "vitest";
import { calculateBuild } from "@/lib/compatibility/calculateBuild";
import { recommendBuilds } from "@/lib/recommendations/recommendBuilds";
import type { BuildParts } from "@/lib/types/build";

const balancedFreestyle: BuildParts = {
  frame: "frame_5in_carbon_freestyle",
  motor: "motor_2207_1750kv",
  propeller: "prop_5x43x3",
  battery: "battery_6s_1300mah_100c",
  esc: "esc_45a_4in1_30x30",
  flight_controller: "fc_f7_30x30",
  camera: "camera_micro_fpv",
  receiver: "receiver_elrs_24_nano",
  vtx: "vtx_800mw_20x20",
  antenna: "antenna_58_lhcp_stubby",
};

describe("calculateBuild", () => {
  it("calculates the balanced freestyle build as valid", () => {
    const result = calculateBuild(balancedFreestyle, "freestyle", 450);

    expect(result.status).toBe("valid");
    expect(result.warnings).toHaveLength(0);
    expect(result.stats.recommendedUseCase).toBe("Freestyle");
    expect(result.stats.totalWeightG).toBeCloseTo(573.5, 1);
    expect(result.stats.totalCostUsd).toBeCloseTo(411.5, 1);
    expect(result.stats.thrustToWeightRatio).toBeGreaterThan(4);
    expect(result.stats.estimatedFlightTimeMin).toBeGreaterThan(4);
  });

  it("flags a motor mount mismatch as critical", () => {
    const result = calculateBuild(
      {
        ...balancedFreestyle,
        frame: "frame_7in_long_range",
      },
      "freestyle",
      450,
    );

    expect(result.status).toBe("critical");
    expect(
      result.warnings.some((warning) => warning.id === "motor_mount_mismatch"),
    ).toBe(true);
    expect(result.suggestions[0].title).toContain("Resolve");
  });

  it("flags an over-budget build without blocking compatibility", () => {
    const result = calculateBuild(balancedFreestyle, "freestyle", 250);

    expect(result.status).toBe("warning");
    expect(result.warnings.some((warning) => warning.id === "over_budget")).toBe(
      true,
    );
  });
});

describe("recommendBuilds", () => {
  it("returns three non-critical recommendations", () => {
    const recommendations = recommendBuilds({
      goal: "freestyle",
      budgetUsd: 450,
    });

    expect(recommendations).toHaveLength(3);
    expect(
      recommendations.every((item) => item.calculation.status !== "critical"),
    ).toBe(true);
    expect(recommendations[0].id).toBe("best_match");
  });
});
