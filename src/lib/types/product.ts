export type ProductCategory =
  | "frame"
  | "motor"
  | "propeller"
  | "battery"
  | "esc"
  | "flight_controller"
  | "camera"
  | "receiver"
  | "vtx"
  | "antenna"
  | "payload";

export type ProductBase = {
  id: string;
  category: ProductCategory;
  name: string;
  brand: string;
  description?: string;
  priceUsd: number;
  weightG: number;
  imageUrl?: string;
  modelUrl?: string;
  sourceType: "manual" | "manufacturer" | "datasheet" | "user_submitted";
  sourceNote?: string;
  lastUpdated: string;
  tags: string[];
};

export type FrameSpec = ProductBase & {
  category: "frame";
  wheelbaseMm: number;
  maxPropSizeIn: number;
  supportedStackMounts: string[];
  motorMountPattern: string;
  cameraSizeSupport: string[];
  batteryMountMaxLengthMm?: number;
  batteryMountMaxWidthMm?: number;
  recommendedUseCases: string[];
  dimensions: {
    lengthMm: number;
    widthMm: number;
    heightMm: number;
  };
};

export type MotorThrustTest = {
  propellerId: string;
  cellCount: number;
  maxThrustG: number;
  maxCurrentA: number;
  hoverCurrentAEstimate: number;
};

export type MotorSpec = ProductBase & {
  category: "motor";
  kv: number;
  statorSize: string;
  supportedCellMin: number;
  supportedCellMax: number;
  maxCurrentA: number;
  shaftDiameterMm?: number;
  mountPattern: string;
  thrustTests: MotorThrustTest[];
};

export type PropellerSpec = ProductBase & {
  category: "propeller";
  diameterIn: number;
  pitch: number;
  blades: number;
  shaftHoleMm?: number;
  material?: string;
};

export type BatterySpec = ProductBase & {
  category: "battery";
  cellCount: number;
  capacityMah: number;
  cRating: number;
  connector: string;
  dimensions: {
    lengthMm: number;
    widthMm: number;
    heightMm: number;
  };
};

export type EscSpec = ProductBase & {
  category: "esc";
  type: "single" | "four_in_one";
  currentPerChannelA: number;
  burstCurrentA?: number;
  supportedCellMin: number;
  supportedCellMax: number;
  mountingPattern: string;
  firmware?: string;
};

export type FlightControllerSpec = ProductBase & {
  category: "flight_controller";
  mountingPattern: string;
  firmwareTarget?: string;
  gyro?: string;
  processor?: string;
  osd: boolean;
  barometer?: boolean;
  blackbox?: boolean;
  uartCount?: number;
};

export type CameraSpec = ProductBase & {
  category: "camera";
  cameraSize: "nano" | "micro" | "mini" | "full";
  aspectRatio?: "4:3" | "16:9" | "switchable";
  dimensions: {
    widthMm: number;
    heightMm: number;
    depthMm: number;
  };
};

export type ReceiverSpec = ProductBase & {
  category: "receiver";
  protocol: string;
  rangeClass: "short" | "medium" | "long";
  voltageMin: number;
  voltageMax: number;
};

export type VtxSpec = ProductBase & {
  category: "vtx";
  maxPowerMw: number;
  inputVoltageMin: number;
  inputVoltageMax: number;
  mountingPattern?: string;
  antennaConnector?: string;
};

export type AntennaSpec = ProductBase & {
  category: "antenna";
  connector: string;
  polarization: "LHCP" | "RHCP" | "linear";
  frequencyGhz: number;
};

export type PayloadSpec = ProductBase & {
  category: "payload";
  payloadType: "action_camera" | "sensor" | "custom_weight";
  dimensions?: {
    lengthMm: number;
    widthMm: number;
    heightMm: number;
  };
};

export type Product =
  | FrameSpec
  | MotorSpec
  | PropellerSpec
  | BatterySpec
  | EscSpec
  | FlightControllerSpec
  | CameraSpec
  | ReceiverSpec
  | VtxSpec
  | AntennaSpec
  | PayloadSpec;

export type ProductByCategory = {
  frame: FrameSpec;
  motor: MotorSpec;
  propeller: PropellerSpec;
  battery: BatterySpec;
  esc: EscSpec;
  flight_controller: FlightControllerSpec;
  camera: CameraSpec;
  receiver: ReceiverSpec;
  vtx: VtxSpec;
  antenna: AntennaSpec;
  payload: PayloadSpec;
};
