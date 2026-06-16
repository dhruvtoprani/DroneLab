import { describe, expect, it } from "vitest";
import { createSavedBuild, getSavedBuild } from "@/lib/server/buildRepository";
import { normalizeBuildParts } from "@/lib/builds/savedBuildSchema";

describe("saved build normalization", () => {
  it("accepts both API-style ids and internal category keys", () => {
    const parts = normalizeBuildParts({
      frameId: "frame_5in_carbon_freestyle",
      motor: "motor_2207_1750kv",
      propellerId: "prop_5x43x3",
      batteryId: "battery_6s_1300mah_100c",
      esc: "esc_45a_4in1_30x30",
      flightControllerId: "fc_f7_30x30",
      cameraId: "camera_micro_fpv",
      receiverId: "receiver_elrs_24_nano",
      vtxId: "vtx_800mw_20x20",
      antennaId: "antenna_58_lhcp_stubby",
      payloadId: null,
    });

    expect(parts.frame).toBe("frame_5in_carbon_freestyle");
    expect(parts.motor).toBe("motor_2207_1750kv");
    expect(parts.flight_controller).toBe("fc_f7_30x30");
    expect(parts.payload).toBeUndefined();
  });
});

describe("build repository fallback", () => {
  it("creates a retrievable build with share and summary paths", async () => {
    const result = await createSavedBuild({
      name: "Repository Test Build",
      selectedGoal: "freestyle",
      budgetUsd: 450,
      parts: {
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
      },
    });

    expect(result.build.name).toBe("Repository Test Build");
    expect(result.paths.summary).toBe(`/builds/${result.build.id}`);
    expect(result.paths.share).toContain("/builds/shared?build=");
    expect(result.persistence.durable).toBe(false);

    await expect(getSavedBuild(result.build.id)).resolves.toMatchObject({
      id: result.build.id,
      name: "Repository Test Build",
    });
  });
});
