"use client";

import { create } from "zustand";
import type { BuildGoal, BuildParts } from "@/lib/types/build";
import type { ProductCategory } from "@/lib/types/product";

const starterParts: BuildParts = {
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
const starterBuildName = "Balanced 5-Inch Freestyle";

type BuildStore = {
  buildName: string;
  goal: BuildGoal;
  budgetUsd: number;
  parts: BuildParts;
  activeCategory: ProductCategory;
  highlightedCategory?: ProductCategory;
  exploded: boolean;
  setGoal: (goal: BuildGoal) => void;
  setBudget: (budgetUsd: number) => void;
  setBuild: (build: {
    buildName?: string;
    goal: BuildGoal;
    budgetUsd?: number;
    parts: BuildParts;
  }) => void;
  setPart: (category: ProductCategory, productId?: string) => void;
  setActiveCategory: (category: ProductCategory) => void;
  setHighlightedCategory: (category?: ProductCategory) => void;
  toggleExploded: () => void;
  resetBuild: () => void;
};

export const useBuildStore = create<BuildStore>((set) => ({
  buildName: starterBuildName,
  goal: "freestyle",
  budgetUsd: 450,
  parts: starterParts,
  activeCategory: "frame",
  exploded: false,
  setGoal: (goal) => set({ goal }),
  setBudget: (budgetUsd) => set({ budgetUsd }),
  setBuild: (build) =>
    set({
      buildName: build.buildName ?? "Shared DroneLab Build",
      goal: build.goal,
      budgetUsd: build.budgetUsd ?? 450,
      parts: build.parts,
      activeCategory: "frame",
      highlightedCategory: undefined,
      exploded: false,
    }),
  setPart: (category, productId) =>
    set((state) => ({
      parts: { ...state.parts, [category]: productId },
      highlightedCategory: category,
    })),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setHighlightedCategory: (highlightedCategory) =>
    set({ highlightedCategory }),
  toggleExploded: () => set((state) => ({ exploded: !state.exploded })),
  resetBuild: () =>
    set({
      buildName: starterBuildName,
      goal: "freestyle",
      budgetUsd: 450,
      parts: starterParts,
      activeCategory: "frame",
      highlightedCategory: undefined,
      exploded: false,
    }),
}));
