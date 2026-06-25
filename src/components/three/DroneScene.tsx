"use client";

import {
  ContactShadows,
  Grid,
  Html,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame } from "@react-three/fiber";
import { AlertTriangle, Cpu, Rotate3D } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Vector3, type Group } from "three";
import { getProduct } from "@/lib/data/catalog";
import type { BuildParts } from "@/lib/types/build";
import type { ProductCategory } from "@/lib/types/product";
import { cn } from "@/lib/utils";

type DroneSceneProps = {
  parts: BuildParts;
  exploded: boolean;
  highlightedCategory?: ProductCategory;
  selectedCategory?: ProductCategory;
  onHighlight: (category?: ProductCategory) => void;
  onSelectCategory: (category: ProductCategory) => void;
};

const COLORS = {
  carbon: "#171b1f",
  carbonEdge: "#343b42",
  motor: "#686f78",
  motorTop: "#a7b0ba",
  prop: "#c9ff49",
  pcb: "#1d6b4f",
  battery: "#373f47",
  camera: "#161a1e",
  accent: "#b9ff35",
  ghost: "#6b7783",
  scanner: "#66d9ff",
};

type WebGlStatus = "checking" | "supported" | "unsupported";

function isWebGlAvailable() {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");

    return Boolean(window.WebGLRenderingContext && context);
  } catch {
    return false;
  }
}

function SceneFallback({ status }: { status: WebGlStatus }) {
  const checking = status === "checking";

  return (
    <div className="flex h-full min-h-[520px] items-center justify-center bg-[radial-gradient(circle_at_top,#182027_0%,#090c0e_58%)] p-6">
      <div className="max-w-md rounded-2xl border border-white/10 bg-black/35 p-6 text-center shadow-2xl backdrop-blur-md">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-lime-300/20 bg-lime-300/10 text-lime-200">
          {checking ? <Rotate3D className="size-5 animate-spin" /> : <AlertTriangle className="size-5" />}
        </div>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-lime-200">
          3D viewport
        </p>
        <h2 className="mt-2 text-xl font-semibold text-zinc-50">
          {checking ? "Checking graphics support" : "WebGL is not available"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {checking
            ? "DroneLab is preparing the generated assembly view."
            : "Your browser or device blocked hardware-accelerated 3D. You can still select parts, review compatibility, calculate performance, and export the bill of materials."}
        </p>
        {!checking && (
          <div className="mt-5 rounded-xl border border-white/8 bg-white/[0.025] p-4 text-left">
            <div className="flex gap-3">
              <Cpu className="mt-0.5 size-4 shrink-0 text-zinc-500" />
              <div>
                <p className="text-sm font-medium text-zinc-200">Try this first</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Enable hardware acceleration, update the browser, or reopen
                  DroneLab in Chrome, Edge, Safari, or Firefox on a device with
                  WebGL support.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function materialProps(
  category: ProductCategory,
  highlightedCategory?: ProductCategory,
  selectedCategory?: ProductCategory,
  baseOpacity = 1,
) {
  const highlighted = category === highlightedCategory;
  const selected = category === selectedCategory;
  const dimmed = Boolean(
    selectedCategory && !selected && !highlighted,
  );

  return {
    emissive: highlighted || selected ? COLORS.accent : "#000000",
    emissiveIntensity: highlighted ? 0.42 : selected ? 0.25 : 0,
    transparent: dimmed || baseOpacity < 1,
    opacity: dimmed ? Math.min(baseOpacity, 0.24) : baseOpacity,
  };
}

function HoverGroup({
  category,
  onHighlight,
  onSelectCategory,
  children,
}: {
  category: ProductCategory;
  onHighlight: (category?: ProductCategory) => void;
  onSelectCategory: (category: ProductCategory) => void;
  children: React.ReactNode;
}) {
  const handleEnter = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = "pointer";
    onHighlight(category);
  };

  const handleLeave = () => {
    document.body.style.cursor = "default";
    onHighlight(undefined);
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelectCategory(category);
  };

  return (
    <group
      onClick={handleClick}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
    >
      {children}
    </group>
  );
}

function AnimatedGroup({
  position,
  speed = 7.5,
  children,
}: {
  position: [number, number, number];
  speed?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<Group>(null);
  const [initialPosition] = useState(position);
  const target = useRef(new Vector3(...position));

  useEffect(() => {
    target.current.set(...position);
  }, [position]);

  useFrame((_, delta) => {
    if (!ref.current) return;

    const step = 1 - Math.exp(-speed * delta);
    ref.current.position.lerp(target.current, step);
  });

  return (
    <group ref={ref} position={initialPosition}>
      {children}
    </group>
  );
}

function PartCallout({
  label,
  category,
  position,
  highlightedCategory,
  selectedCategory,
  missing = false,
}: {
  label: string;
  category: ProductCategory;
  position: [number, number, number];
  highlightedCategory?: ProductCategory;
  selectedCategory?: ProductCategory;
  missing?: boolean;
}) {
  const active = highlightedCategory === category || selectedCategory === category;
  const dimmed = Boolean(selectedCategory && selectedCategory !== category);

  return (
    <AnimatedGroup position={position}>
      <Html
        center
        distanceFactor={6.8}
        zIndexRange={[20, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          className={cn(
            "whitespace-nowrap rounded-full border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] shadow-xl backdrop-blur-md transition",
            active
              ? "border-lime-300/55 bg-lime-300/15 text-lime-100"
              : missing
                ? "border-sky-300/25 bg-sky-300/10 text-sky-100"
                : "border-white/12 bg-black/45 text-zinc-300",
            dimmed && "opacity-25",
          )}
        >
          {selectedCategory === category ? "Focused " : missing ? "Add " : ""}
          {label}
        </div>
      </Html>
    </AnimatedGroup>
  );
}

function SnapRing({
  position,
  radius = 0.36,
  active = false,
  color = COLORS.accent,
}: {
  position: [number, number, number];
  radius?: number;
  active?: boolean;
  color?: string;
}) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <torusGeometry args={[radius, active ? 0.012 : 0.007, 8, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.58 : 0.22}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[radius * 0.72, 0.004, 8, 48]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.34 : 0.12} />
      </mesh>
    </group>
  );
}

function ScrewHead({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[0.055, 0.055, 0.025, 18]} />
      <meshStandardMaterial color="#78828c" metalness={0.7} roughness={0.26} />
    </mesh>
  );
}

function Standoff({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[0.035, 0.035, 0.42, 14]} />
      <meshStandardMaterial color="#7b8790" metalness={0.78} roughness={0.24} />
    </mesh>
  );
}

function LandingPad() {
  return (
    <group position={[0, -0.395, 0]}>
      {[1.55, 2.45, 3.35].map((radius, index) => (
        <mesh key={radius} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, index === 1 ? 0.008 : 0.005, 8, 96]} />
          <meshBasicMaterial
            color={index === 1 ? COLORS.accent : COLORS.scanner}
            transparent
            opacity={index === 1 ? 0.16 : 0.1}
          />
        </mesh>
      ))}
      {Array.from({ length: 8 }).map((_, index) => (
        <mesh
          key={index}
          rotation={[0, (Math.PI / 4) * index, 0]}
          position={[0, 0.002, 0]}
        >
          <boxGeometry args={[0.018, 0.004, 3.65]} />
          <meshBasicMaterial color={COLORS.scanner} transparent opacity={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function GhostCylinder({
  category,
  position,
  radius,
  height,
  onHighlight,
  onSelectCategory,
}: {
  category: ProductCategory;
  position: [number, number, number];
  radius: number;
  height: number;
  onHighlight: (category?: ProductCategory) => void;
  onSelectCategory: (category: ProductCategory) => void;
}) {
  return (
    <HoverGroup
      category={category}
      onHighlight={onHighlight}
      onSelectCategory={onSelectCategory}
    >
      <AnimatedGroup position={position}>
        <mesh>
          <cylinderGeometry args={[radius, radius, height, 24]} />
          <meshBasicMaterial
            color={COLORS.ghost}
            transparent
            opacity={0.16}
            wireframe
          />
        </mesh>
      </AnimatedGroup>
    </HoverGroup>
  );
}

function Propeller({
  position,
  scale,
  highlightedCategory,
  selectedCategory,
  onHighlight,
  onSelectCategory,
}: {
  position: [number, number, number];
  scale: number;
  highlightedCategory?: ProductCategory;
  selectedCategory?: ProductCategory;
  onHighlight: (category?: ProductCategory) => void;
  onSelectCategory: (category: ProductCategory) => void;
}) {
  const ref = useRef<Group>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 1.1;
  });
  const active = highlightedCategory === "propeller" || selectedCategory === "propeller";
  const dimmed = Boolean(selectedCategory && selectedCategory !== "propeller");

  return (
    <HoverGroup
      category="propeller"
      onHighlight={onHighlight}
      onSelectCategory={onSelectCategory}
    >
      <AnimatedGroup position={position}>
      <group ref={ref}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[scale * 0.56, 56]} />
          <meshBasicMaterial
            color={COLORS.prop}
            transparent
            opacity={dimmed ? 0.035 : active ? 0.14 : 0.07}
            depthWrite={false}
          />
        </mesh>
        {[0, Math.PI * 0.67, Math.PI * 1.33].map((rotation) => (
          <mesh key={rotation} rotation={[0, rotation, 0]} castShadow>
            <boxGeometry args={[scale, 0.025, 0.11]} />
            <meshStandardMaterial
            color={COLORS.prop}
            roughness={0.36}
            metalness={0.05}
              {...materialProps("propeller", highlightedCategory, selectedCategory, 0.9)}
            />
          </mesh>
        ))}
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.055, 24]} />
          <meshStandardMaterial color="#15191c" metalness={0.55} roughness={0.3} />
        </mesh>
      </group>
      </AnimatedGroup>
    </HoverGroup>
  );
}

function Motor({
  position,
  highlightedCategory,
  selectedCategory,
  onHighlight,
  onSelectCategory,
}: {
  position: [number, number, number];
  highlightedCategory?: ProductCategory;
  selectedCategory?: ProductCategory;
  onHighlight: (category?: ProductCategory) => void;
  onSelectCategory: (category: ProductCategory) => void;
}) {
  return (
    <HoverGroup
      category="motor"
      onHighlight={onHighlight}
      onSelectCategory={onSelectCategory}
    >
      <AnimatedGroup position={position}>
        <mesh castShadow>
          <cylinderGeometry args={[0.27, 0.29, 0.34, 32]} />
          <meshStandardMaterial
            color={COLORS.motor}
            metalness={0.75}
            roughness={0.25}
            {...materialProps("motor", highlightedCategory, selectedCategory)}
          />
        </mesh>
        <mesh position={[0, 0.19, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 32]} />
          <meshStandardMaterial
            color={COLORS.motorTop}
            metalness={0.8}
            roughness={0.18}
            {...materialProps("motor", highlightedCategory, selectedCategory)}
          />
        </mesh>
      </AnimatedGroup>
    </HoverGroup>
  );
}

function GhostPlaceholder({
  category,
  position,
  size,
  onHighlight,
  onSelectCategory,
}: {
  category: ProductCategory;
  position: [number, number, number];
  size: [number, number, number];
  onHighlight: (category?: ProductCategory) => void;
  onSelectCategory: (category: ProductCategory) => void;
}) {
  return (
    <HoverGroup
      category={category}
      onHighlight={onHighlight}
      onSelectCategory={onSelectCategory}
    >
      <AnimatedGroup position={position}>
        <mesh>
          <boxGeometry args={size} />
          <meshBasicMaterial
            color={COLORS.ghost}
            transparent
            opacity={0.14}
            wireframe
          />
        </mesh>
      </AnimatedGroup>
    </HoverGroup>
  );
}

function DroneAssembly({
  parts,
  exploded,
  highlightedCategory,
  selectedCategory,
  onHighlight,
  onSelectCategory,
}: DroneSceneProps) {
  const frame = getProduct("frame", parts.frame);
  const propeller = getProduct("propeller", parts.propeller);
  const armSpread = frame?.maxPropSizeIn && frame.maxPropSizeIn > 6 ? 1.85 : 1.48;
  const propScale = propeller?.diameterIn
    ? Math.max(0.78, propeller.diameterIn / 5)
    : 1;
  const motorPositions: [number, number, number][] = [
    [-armSpread, 0.17, -armSpread],
    [armSpread, 0.17, -armSpread],
    [-armSpread, 0.17, armSpread],
    [armSpread, 0.17, armSpread],
  ];
  const explosion = exploded ? 0.9 : 0;
  const stackStandoffs: [number, number, number][] = [
    [-0.38, 0.32, -0.38],
    [0.38, 0.32, -0.38],
    [-0.38, 0.32, 0.38],
    [0.38, 0.32, 0.38],
  ];

  return (
    <group rotation={[0, Math.PI / 4, 0]}>
      {motorPositions.map((position, index) => (
        <SnapRing
          key={`snap-${index}`}
          position={[position[0], 0.02, position[2]]}
          active={
            highlightedCategory === "motor" ||
            highlightedCategory === "propeller" ||
            selectedCategory === "motor" ||
            selectedCategory === "propeller"
          }
        />
      ))}

      {parts.frame ? (
        <HoverGroup
          category="frame"
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        >
          <AnimatedGroup position={[0, exploded ? -0.2 : 0, 0]}>
            {[Math.PI / 4, -Math.PI / 4].map((rotation) => (
              <mesh key={rotation} rotation={[0, rotation, 0]} castShadow receiveShadow>
                <boxGeometry args={[4.25, 0.13, 0.24]} />
                <meshStandardMaterial
                  color={COLORS.carbon}
                  roughness={0.62}
                  metalness={0.28}
                  {...materialProps("frame", highlightedCategory, selectedCategory)}
                />
              </mesh>
            ))}
            <RoundedBox
              args={[1.45, 0.13, 1.08]}
              radius={0.08}
              position={[0, 0.04, 0]}
              castShadow
            >
              <meshStandardMaterial
                color={COLORS.carbonEdge}
                roughness={0.55}
                metalness={0.32}
                {...materialProps("frame", highlightedCategory, selectedCategory)}
              />
            </RoundedBox>
            <RoundedBox
              args={[1.08, 0.08, 0.82]}
              radius={0.06}
              position={[0, -0.08, 0]}
              castShadow
            >
              <meshStandardMaterial
                color={COLORS.carbon}
                roughness={0.64}
                metalness={0.24}
                {...materialProps("frame", highlightedCategory, selectedCategory)}
              />
            </RoundedBox>
            {[
              [-0.52, 0.13, -0.38],
              [0.52, 0.13, -0.38],
              [-0.52, 0.13, 0.38],
              [0.52, 0.13, 0.38],
            ].map((position) => (
              <ScrewHead key={position.join(":")} position={position as [number, number, number]} />
            ))}
          </AnimatedGroup>
        </HoverGroup>
      ) : (
        <GhostPlaceholder
          category="frame"
          position={[0, 0, 0]}
          size={[4, 0.15, 0.24]}
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        />
      )}

      {parts.motor &&
        motorPositions.map((position, index) => (
          <Motor
            key={index}
            position={[position[0], position[1] + explosion * 0.25, position[2]]}
            highlightedCategory={highlightedCategory}
            selectedCategory={selectedCategory}
            onHighlight={onHighlight}
            onSelectCategory={onSelectCategory}
          />
        ))}
      {!parts.motor &&
        motorPositions.map((position, index) => (
          <GhostCylinder
            key={`motor-ghost-${index}`}
            category="motor"
            position={[position[0], position[1] + 0.05, position[2]]}
            radius={0.28}
            height={0.32}
            onHighlight={onHighlight}
            onSelectCategory={onSelectCategory}
          />
        ))}

      {parts.propeller &&
        motorPositions.map((position, index) => (
          <Propeller
            key={index}
            position={[position[0], position[1] + 0.32 + explosion * 0.75, position[2]]}
            scale={1.22 * propScale}
            highlightedCategory={highlightedCategory}
            selectedCategory={selectedCategory}
            onHighlight={onHighlight}
            onSelectCategory={onSelectCategory}
          />
        ))}
      {!parts.propeller &&
        motorPositions.map((position, index) => (
          <SnapRing
            key={`prop-ghost-${index}`}
            position={[position[0], position[1] + 0.34, position[2]]}
            radius={0.54}
            active={
              highlightedCategory === "propeller" ||
              selectedCategory === "propeller"
            }
            color={COLORS.ghost}
          />
        ))}

      {parts.frame &&
        stackStandoffs.map((position) => (
          <Standoff key={position.join(":")} position={position} />
        ))}

      {parts.esc ? (
        <HoverGroup
          category="esc"
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        >
          <AnimatedGroup position={[0, 0.25 + explosion * 0.35, 0]}>
            <RoundedBox args={[0.78, 0.08, 0.78]} radius={0.04} castShadow>
              <meshStandardMaterial
                color="#18553f"
                roughness={0.48}
                {...materialProps("esc", highlightedCategory, selectedCategory)}
              />
            </RoundedBox>
          </AnimatedGroup>
        </HoverGroup>
      ) : (
        <GhostPlaceholder
          category="esc"
          position={[0, 0.27, 0]}
          size={[0.78, 0.08, 0.78]}
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        />
      )}

      {parts.flight_controller ? (
        <HoverGroup
          category="flight_controller"
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        >
          <AnimatedGroup position={[0, 0.43 + explosion * 0.75, 0]}>
            <RoundedBox args={[0.72, 0.08, 0.72]} radius={0.04} castShadow>
              <meshStandardMaterial
                color={COLORS.pcb}
                roughness={0.42}
                {...materialProps(
                  "flight_controller",
                  highlightedCategory,
                  selectedCategory,
                )}
              />
            </RoundedBox>
            <mesh position={[0, 0.07, 0]}>
              <boxGeometry args={[0.25, 0.05, 0.25]} />
              <meshStandardMaterial
                color="#242a2f"
                metalness={0.2}
                roughness={0.45}
                {...materialProps(
                  "flight_controller",
                  highlightedCategory,
                  selectedCategory,
                )}
              />
            </mesh>
          </AnimatedGroup>
        </HoverGroup>
      ) : (
        <GhostPlaceholder
          category="flight_controller"
          position={[0, 0.43, 0]}
          size={[0.72, 0.08, 0.72]}
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        />
      )}

      {parts.battery ? (
        <HoverGroup
          category="battery"
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        >
          <AnimatedGroup position={[0, 0.86 + explosion * 1.25, 0.08]}>
            <RoundedBox args={[0.86, 0.48, 1.7]} radius={0.1} castShadow>
              <meshStandardMaterial
                color={COLORS.battery}
                roughness={0.56}
                metalness={0.12}
                {...materialProps("battery", highlightedCategory, selectedCategory)}
              />
            </RoundedBox>
            <mesh position={[0, 0.01, 0.86]}>
              <boxGeometry args={[0.54, 0.28, 0.03]} />
              <meshStandardMaterial
                color={COLORS.accent}
                roughness={0.5}
                {...materialProps("battery", highlightedCategory, selectedCategory)}
              />
            </mesh>
            <mesh position={[0.26, 0.22, -0.7]}>
              <boxGeometry args={[0.12, 0.1, 0.35]} />
              <meshStandardMaterial
                color="#d95146"
                roughness={0.45}
                {...materialProps("battery", highlightedCategory, selectedCategory)}
              />
            </mesh>
          </AnimatedGroup>
        </HoverGroup>
      ) : (
        <GhostPlaceholder
          category="battery"
          position={[0, 0.88, 0]}
          size={[0.86, 0.48, 1.7]}
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        />
      )}

      {parts.camera ? (
        <HoverGroup
          category="camera"
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        >
          <AnimatedGroup position={[0, 0.3 + explosion * 0.35, -1.06 - explosion * 0.25]}>
            <RoundedBox args={[0.46, 0.43, 0.38]} radius={0.06} castShadow>
              <meshStandardMaterial
                color={COLORS.camera}
                roughness={0.4}
                {...materialProps("camera", highlightedCategory, selectedCategory)}
              />
            </RoundedBox>
            <mesh position={[0, 0, -0.24]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.14, 0.19, 0.22, 28]} />
              <meshStandardMaterial
                color="#090b0d"
                metalness={0.55}
                roughness={0.18}
                {...materialProps("camera", highlightedCategory, selectedCategory)}
              />
            </mesh>
          </AnimatedGroup>
        </HoverGroup>
      ) : (
        <GhostPlaceholder
          category="camera"
          position={[0, 0.3, -1.08]}
          size={[0.46, 0.43, 0.38]}
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        />
      )}

      {parts.receiver && (
        <HoverGroup
          category="receiver"
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        >
          <AnimatedGroup position={[-0.48, 0.25 + explosion * 0.55, 0.42]}>
            <RoundedBox args={[0.34, 0.06, 0.22]} radius={0.03} castShadow>
              <meshStandardMaterial
                color="#273f5b"
                {...materialProps("receiver", highlightedCategory, selectedCategory)}
              />
            </RoundedBox>
          </AnimatedGroup>
        </HoverGroup>
      )}
      {!parts.receiver && (
        <GhostPlaceholder
          category="receiver"
          position={[-0.48, 0.25, 0.42]}
          size={[0.34, 0.06, 0.22]}
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        />
      )}

      {parts.vtx && (
        <HoverGroup
          category="vtx"
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        >
          <AnimatedGroup position={[0.48, 0.25 + explosion * 0.55, 0.42]}>
            <RoundedBox args={[0.38, 0.07, 0.28]} radius={0.03} castShadow>
              <meshStandardMaterial
                color="#6c3d27"
                {...materialProps("vtx", highlightedCategory, selectedCategory)}
              />
            </RoundedBox>
          </AnimatedGroup>
        </HoverGroup>
      )}
      {!parts.vtx && (
        <GhostPlaceholder
          category="vtx"
          position={[0.48, 0.25, 0.42]}
          size={[0.38, 0.07, 0.28]}
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        />
      )}

      {parts.antenna ? (
        <HoverGroup
          category="antenna"
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        >
          <AnimatedGroup position={[0, 0.34 + explosion * 0.7, 1.08 + explosion * 0.4]}>
          <group rotation={[0.42, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.85, 16]} />
              <meshStandardMaterial
                color="#4f5963"
                metalness={0.35}
                roughness={0.45}
                {...materialProps("antenna", highlightedCategory, selectedCategory)}
              />
            </mesh>
            <mesh position={[0, 0.45, 0]} castShadow>
              <sphereGeometry args={[0.12, 20, 20]} />
              <meshStandardMaterial
                color="#242a2e"
                roughness={0.58}
                {...materialProps("antenna", highlightedCategory, selectedCategory)}
              />
            </mesh>
          </group>
          </AnimatedGroup>
        </HoverGroup>
      ) : (
        <GhostPlaceholder
          category="antenna"
          position={[0, 0.42, 1.12]}
          size={[0.1, 0.8, 0.1]}
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        />
      )}

      {parts.payload && (
        <HoverGroup
          category="payload"
          onHighlight={onHighlight}
          onSelectCategory={onSelectCategory}
        >
          <AnimatedGroup position={[0, 1.42 + explosion * 1.65, -0.3]}>
            <RoundedBox args={[1.05, 0.62, 0.48]} radius={0.09} castShadow>
              <meshStandardMaterial
                color="#2c3339"
                roughness={0.42}
                {...materialProps("payload", highlightedCategory, selectedCategory)}
              />
            </RoundedBox>
            <mesh position={[0, 0, -0.29]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.13, 0.17, 0.16, 24]} />
              <meshStandardMaterial
                color="#07090a"
                metalness={0.5}
                roughness={0.2}
                {...materialProps("payload", highlightedCategory, selectedCategory)}
              />
            </mesh>
          </AnimatedGroup>
        </HoverGroup>
      )}
      <PartCallout
        category="frame"
        label="Frame"
        position={[0, 0.34, -1.62]}
        highlightedCategory={highlightedCategory}
        selectedCategory={selectedCategory}
        missing={!parts.frame}
      />
      <PartCallout
        category="motor"
        label="Motors"
        position={[1.95, 0.72, -1.2]}
        highlightedCategory={highlightedCategory}
        selectedCategory={selectedCategory}
        missing={!parts.motor}
      />
      <PartCallout
        category="propeller"
        label="Props"
        position={[-1.9, 0.82, -1.2]}
        highlightedCategory={highlightedCategory}
        selectedCategory={selectedCategory}
        missing={!parts.propeller}
      />
      <PartCallout
        category="battery"
        label="Battery"
        position={[0.85, 1.54 + explosion * 0.75, 0.18]}
        highlightedCategory={highlightedCategory}
        selectedCategory={selectedCategory}
        missing={!parts.battery}
      />
      <PartCallout
        category="flight_controller"
        label="FC stack"
        position={[-1.12, 0.76 + explosion * 0.5, 0.76]}
        highlightedCategory={highlightedCategory}
        selectedCategory={selectedCategory}
        missing={!parts.flight_controller}
      />
      <PartCallout
        category="camera"
        label="Camera"
        position={[-0.55, 0.82, -1.48]}
        highlightedCategory={highlightedCategory}
        selectedCategory={selectedCategory}
        missing={!parts.camera}
      />
      <PartCallout
        category="antenna"
        label="Antenna"
        position={[0.25, 0.96 + explosion * 0.4, 1.52]}
        highlightedCategory={highlightedCategory}
        selectedCategory={selectedCategory}
        missing={!parts.antenna}
      />
      {parts.payload && (
        <PartCallout
          category="payload"
          label="Payload"
          position={[0, 1.94 + explosion * 1.1, -0.38]}
          highlightedCategory={highlightedCategory}
          selectedCategory={selectedCategory}
        />
      )}
    </group>
  );
}

export function DroneScene(props: DroneSceneProps) {
  const [webGlStatus, setWebGlStatus] = useState<WebGlStatus>("checking");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setWebGlStatus(isWebGlAvailable() ? "supported" : "unsupported");
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (webGlStatus !== "supported") {
    return <SceneFallback status={webGlStatus} />;
  }

  return (
    <Canvas
      camera={{ position: [5.8, 4.6, 6.6], fov: 34 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true }}
      shadows
      onPointerMissed={() => props.onHighlight(undefined)}
    >
      <color attach="background" args={["#090c0e"]} />
      <fog attach="fog" args={["#090c0e", 8, 15]} />
      <ambientLight intensity={0.58} />
      <directionalLight
        position={[4, 7, 3]}
        intensity={3.8}
        color="#f2ffd7"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, 2, -3]} intensity={8} color="#48c8ff" distance={10} />
      <pointLight position={[3.5, 1.2, 4]} intensity={4.2} color="#b9ff35" distance={8} />
      <spotLight
        position={[0, 5.6, 0]}
        angle={0.42}
        penumbra={0.65}
        intensity={14}
        color="#dfffb7"
        castShadow
      />
      <DroneAssembly {...props} />
      <ContactShadows
        position={[0, -0.38, 0]}
        opacity={0.55}
        scale={10}
        blur={2.6}
        far={4}
      />
      <LandingPad />
      <Grid
        position={[0, -0.4, 0]}
        args={[14, 14]}
        cellSize={0.45}
        cellThickness={0.5}
        cellColor="#233037"
        sectionSize={2.25}
        sectionThickness={0.8}
        sectionColor="#32424a"
        fadeDistance={9}
        fadeStrength={1.3}
        infiniteGrid
      />
      <OrbitControls
        makeDefault
        enableDamping
        minDistance={4}
        maxDistance={11}
        maxPolarAngle={Math.PI / 2.04}
        target={[0, 0.35, 0]}
      />
    </Canvas>
  );
}
