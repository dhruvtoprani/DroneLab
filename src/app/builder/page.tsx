import type { Metadata } from "next";
import { Suspense } from "react";
import { BuilderApp } from "@/components/builder/BuilderApp";

export const metadata: Metadata = {
  title: "Builder | DroneLab",
  description: "Assemble and validate an FPV quadcopter in 3D.",
};

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090c0e]" />}>
      <BuilderApp />
    </Suspense>
  );
}
