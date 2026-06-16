import type { BuildGoal, BuildParts } from "@/lib/types/build";

export type SerializedBuild = {
  name?: string;
  goal: BuildGoal;
  budgetUsd?: number;
  parts: BuildParts;
};

export function encodeBuildForUrl(build: SerializedBuild) {
  const json = JSON.stringify(build);

  if (typeof window === "undefined") {
    return Buffer.from(json, "utf8").toString("base64url");
  }

  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

export function decodeBuildFromUrl(
  value?: string | null,
): SerializedBuild | undefined {
  if (!value) return undefined;

  try {
    if (typeof window === "undefined") {
      return JSON.parse(
        Buffer.from(value, "base64url").toString("utf8"),
      ) as SerializedBuild;
    }

    const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
    const binary = atob(padded.replaceAll("-", "+").replaceAll("_", "/"));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as SerializedBuild;
  } catch {
    return undefined;
  }
}
