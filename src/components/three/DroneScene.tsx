"use client";

import { ContactShadows, Grid, OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame } from "@react-three/fiber";
import { AlertTriangle, Cpu, Rotate3D } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { getProduct } from "@/lib/data/catalog";
import type { BuildParts } from "@/lib/types/build";
import type { ProductCategory } from "@/lib/types/product";

type DroneSceneProps = {
  parts: BuildParts;
  exploded: boolean;
  highlightedCategory?: ProductCategory;
  onHighlight: (category?: ProductCategory) => void;
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
) {
  const highlighted = category === highlightedCategory;

  return {
    emissive: highlighted ? COLORS.accent : "#000000",
    emissiveIntensity: highlighted ? 0.34 : 0,
  };
}

function HoverGroup({
  category,
  onHighlight,
  children,
}: {
  category: ProductCategory;
  onHighlight: (category?: ProductCategory) => void;
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

  return (
    <group onPointerEnter={handleEnter} onPointerLeave={handleLeave}>
      {children}
    </group>
  );
}

function Propeller({
  position,
  scale,
  highlightedCategory,
  onHighlight,
}: {
  position: [number, number, number];
  scale: number;
  highlightedCategory?: ProductCategory;
  onHighlight: (category?: ProductCategory) => void;
}) {
  const ref = useRef<Group>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.45;
  });

  return (
    <HoverGroup category="propeller" onHighlight={onHighlight}>
      <group ref={ref} position={position}>
        {[0, Math.PI * 0.67, Math.PI * 1.33].map((rotation) => (
          <mesh key={rotation} rotation={[0, rotation, 0]} castShadow>
            <boxGeometry args={[scale, 0.025, 0.11]} />
            <meshStandardMaterial
              color={COLORS.prop}
              roughness={0.36}
              metalness={0.05}
              transparent
              opacity={0.9}
              {...materialProps("propeller", highlightedCategory)}
            />
          </mesh>
        ))}
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.055, 24]} />
          <meshStandardMaterial color="#15191c" metalness={0.55} roughness={0.3} />
        </mesh>
      </group>
    </HoverGroup>
  );
}

function Motor({
  position,
  highlightedCategory,
  onHighlight,
}: {
  position: [number, number, number];
  highlightedCategory?: ProductCategory;
  onHighlight: (category?: ProductCategory) => void;
}) {
  return (
    <HoverGroup category="motor" onHighlight={onHighlight}>
      <group position={position}>
        <mesh castShadow>
          <cylinderGeometry args={[0.27, 0.29, 0.34, 32]} />
          <meshStandardMaterial
            color={COLORS.motor}
            metalness={0.75}
            roughness={0.25}
            {...materialProps("motor", highlightedCategory)}
          />
        </mesh>
        <mesh position={[0, 0.19, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 32]} />
          <meshStandardMaterial
            color={COLORS.motorTop}
            metalness={0.8}
            roughness={0.18}
          />
        </mesh>
      </group>
    </HoverGroup>
  );
}

function GhostPlaceholder({
  category,
  position,
  size,
}: {
  category: ProductCategory;
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial
        color={COLORS.ghost}
        transparent
        opacity={0.12}
        wireframe
      />
      <HoverGroup category={category} onHighlight={() => undefined}>
        <group />
      </HoverGroup>
    </mesh>
  );
}

function DroneAssembly({
  parts,
  exploded,
  highlightedCategory,
  onHighlight,
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

  return (
    <group rotation={[0, Math.PI / 4, 0]}>
      {parts.frame ? (
        <HoverGroup category="frame" onHighlight={onHighlight}>
          <group position={[0, exploded ? -0.2 : 0, 0]}>
            {[Math.PI / 4, -Math.PI / 4].map((rotation) => (
              <mesh key={rotation} rotation={[0, rotation, 0]} castShadow receiveShadow>
                <boxGeometry args={[4.25, 0.13, 0.24]} />
                <meshStandardMaterial
                  color={COLORS.carbon}
                  roughness={0.62}
                  metalness={0.28}
                  {...materialProps("frame", highlightedCategory)}
                />
              </mesh>
            ))}
            <RoundedBox args={[1.45, 0.16, 1.08]} radius={0.08} castShadow>
              <meshStandardMaterial
                color={COLORS.carbonEdge}
                roughness={0.55}
                metalness={0.32}
                {...materialProps("frame", highlightedCategory)}
              />
            </RoundedBox>
          </group>
        </HoverGroup>
      ) : (
        <GhostPlaceholder category="frame" position={[0, 0, 0]} size={[4, 0.15, 0.24]} />
      )}

      {parts.motor &&
        motorPositions.map((position, index) => (
          <Motor
            key={index}
            position={[position[0], position[1] + explosion * 0.25, position[2]]}
            highlightedCategory={highlightedCategory}
            onHighlight={onHighlight}
          />
        ))}

      {parts.propeller &&
        motorPositions.map((position, index) => (
          <Propeller
            key={index}
            position={[position[0], position[1] + 0.32 + explosion * 0.75, position[2]]}
            scale={1.22 * propScale}
            highlightedCategory={highlightedCategory}
            onHighlight={onHighlight}
          />
        ))}

      {parts.esc ? (
        <HoverGroup category="esc" onHighlight={onHighlight}>
          <group position={[0, 0.25 + explosion * 0.35, 0]}>
            <RoundedBox args={[0.78, 0.08, 0.78]} radius={0.04} castShadow>
              <meshStandardMaterial
                color="#18553f"
                roughness={0.48}
                {...materialProps("esc", highlightedCategory)}
              />
            </RoundedBox>
          </group>
        </HoverGroup>
      ) : (
        <GhostPlaceholder category="esc" position={[0, 0.27, 0]} size={[0.78, 0.08, 0.78]} />
      )}

      {parts.flight_controller ? (
        <HoverGroup category="flight_controller" onHighlight={onHighlight}>
          <group position={[0, 0.43 + explosion * 0.75, 0]}>
            <RoundedBox args={[0.72, 0.08, 0.72]} radius={0.04} castShadow>
              <meshStandardMaterial
                color={COLORS.pcb}
                roughness={0.42}
                {...materialProps("flight_controller", highlightedCategory)}
              />
            </RoundedBox>
            <mesh position={[0, 0.07, 0]}>
              <boxGeometry args={[0.25, 0.05, 0.25]} />
              <meshStandardMaterial color="#242a2f" metalness={0.2} roughness={0.45} />
            </mesh>
          </group>
        </HoverGroup>
      ) : (
        <GhostPlaceholder
          category="flight_controller"
          position={[0, 0.43, 0]}
          size={[0.72, 0.08, 0.72]}
        />
      )}

      {parts.battery ? (
        <HoverGroup category="battery" onHighlight={onHighlight}>
          <group position={[0, 0.86 + explosion * 1.25, 0.08]}>
            <RoundedBox args={[0.86, 0.48, 1.7]} radius={0.1} castShadow>
              <meshStandardMaterial
                color={COLORS.battery}
                roughness={0.56}
                metalness={0.12}
                {...materialProps("battery", highlightedCategory)}
              />
            </RoundedBox>
            <mesh position={[0, 0.01, 0.86]}>
              <boxGeometry args={[0.54, 0.28, 0.03]} />
              <meshStandardMaterial color={COLORS.accent} roughness={0.5} />
            </mesh>
            <mesh position={[0.26, 0.22, -0.7]}>
              <boxGeometry args={[0.12, 0.1, 0.35]} />
              <meshStandardMaterial color="#d95146" roughness={0.45} />
            </mesh>
          </group>
        </HoverGroup>
      ) : (
        <GhostPlaceholder category="battery" position={[0, 0.88, 0]} size={[0.86, 0.48, 1.7]} />
      )}

      {parts.camera ? (
        <HoverGroup category="camera" onHighlight={onHighlight}>
          <group position={[0, 0.3 + explosion * 0.35, -1.06 - explosion * 0.25]}>
            <RoundedBox args={[0.46, 0.43, 0.38]} radius={0.06} castShadow>
              <meshStandardMaterial
                color={COLORS.camera}
                roughness={0.4}
                {...materialProps("camera", highlightedCategory)}
              />
            </RoundedBox>
            <mesh position={[0, 0, -0.24]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.14, 0.19, 0.22, 28]} />
              <meshStandardMaterial color="#090b0d" metalness={0.55} roughness={0.18} />
            </mesh>
          </group>
        </HoverGroup>
      ) : (
        <GhostPlaceholder category="camera" position={[0, 0.3, -1.08]} size={[0.46, 0.43, 0.38]} />
      )}

      {parts.receiver && (
        <HoverGroup category="receiver" onHighlight={onHighlight}>
          <group position={[-0.48, 0.25 + explosion * 0.55, 0.42]}>
            <RoundedBox args={[0.34, 0.06, 0.22]} radius={0.03} castShadow>
              <meshStandardMaterial
                color="#273f5b"
                {...materialProps("receiver", highlightedCategory)}
              />
            </RoundedBox>
          </group>
        </HoverGroup>
      )}

      {parts.vtx && (
        <HoverGroup category="vtx" onHighlight={onHighlight}>
          <group position={[0.48, 0.25 + explosion * 0.55, 0.42]}>
            <RoundedBox args={[0.38, 0.07, 0.28]} radius={0.03} castShadow>
              <meshStandardMaterial
                color="#6c3d27"
                {...materialProps("vtx", highlightedCategory)}
              />
            </RoundedBox>
          </group>
        </HoverGroup>
      )}

      {parts.antenna ? (
        <HoverGroup category="antenna" onHighlight={onHighlight}>
          <group position={[0, 0.34 + explosion * 0.7, 1.08 + explosion * 0.4]} rotation={[0.42, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.85, 16]} />
              <meshStandardMaterial
                color="#4f5963"
                metalness={0.35}
                roughness={0.45}
                {...materialProps("antenna", highlightedCategory)}
              />
            </mesh>
            <mesh position={[0, 0.45, 0]} castShadow>
              <sphereGeometry args={[0.12, 20, 20]} />
              <meshStandardMaterial color="#242a2e" roughness={0.58} />
            </mesh>
          </group>
        </HoverGroup>
      ) : (
        <GhostPlaceholder category="antenna" position={[0, 0.42, 1.12]} size={[0.1, 0.8, 0.1]} />
      )}

      {parts.payload && (
        <HoverGroup category="payload" onHighlight={onHighlight}>
          <group position={[0, 1.42 + explosion * 1.65, -0.3]}>
            <RoundedBox args={[1.05, 0.62, 0.48]} radius={0.09} castShadow>
              <meshStandardMaterial
                color="#2c3339"
                roughness={0.42}
                {...materialProps("payload", highlightedCategory)}
              />
            </RoundedBox>
            <mesh position={[0, 0, -0.29]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.13, 0.17, 0.16, 24]} />
              <meshStandardMaterial color="#07090a" metalness={0.5} roughness={0.2} />
            </mesh>
          </group>
        </HoverGroup>
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
      <ambientLight intensity={0.72} />
      <directionalLight
        position={[4, 7, 3]}
        intensity={3.4}
        color="#f2ffd7"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, 2, -3]} intensity={7} color="#48c8ff" distance={10} />
      <DroneAssembly {...props} />
      <ContactShadows
        position={[0, -0.38, 0]}
        opacity={0.55}
        scale={10}
        blur={2.6}
        far={4}
      />
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
