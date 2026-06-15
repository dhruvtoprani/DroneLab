import antennasData from "../../../data/seed/antennas.json";
import batteriesData from "../../../data/seed/batteries.json";
import camerasData from "../../../data/seed/cameras.json";
import escsData from "../../../data/seed/escs.json";
import flightControllersData from "../../../data/seed/flight_controllers.json";
import framesData from "../../../data/seed/frames.json";
import motorsData from "../../../data/seed/motors.json";
import payloadsData from "../../../data/seed/payloads.json";
import propellersData from "../../../data/seed/propellers.json";
import receiversData from "../../../data/seed/receivers.json";
import vtxsData from "../../../data/seed/vtxs.json";
import type {
  Product,
  ProductByCategory,
  ProductCategory,
} from "@/lib/types/product";

export const categoryOrder: ProductCategory[] = [
  "frame",
  "motor",
  "propeller",
  "battery",
  "esc",
  "flight_controller",
  "camera",
  "receiver",
  "vtx",
  "antenna",
  "payload",
];

export const categoryLabels: Record<ProductCategory, string> = {
  frame: "Frame",
  motor: "Motors",
  propeller: "Props",
  battery: "Battery",
  esc: "ESC",
  flight_controller: "Flight Controller",
  camera: "Camera",
  receiver: "Receiver",
  vtx: "VTX",
  antenna: "Antenna",
  payload: "Payload",
};

export const catalog: Product[] = [
  ...(framesData as ProductByCategory["frame"][]),
  ...(motorsData as ProductByCategory["motor"][]),
  ...(propellersData as ProductByCategory["propeller"][]),
  ...(batteriesData as ProductByCategory["battery"][]),
  ...(escsData as ProductByCategory["esc"][]),
  ...(flightControllersData as ProductByCategory["flight_controller"][]),
  ...(camerasData as ProductByCategory["camera"][]),
  ...(receiversData as ProductByCategory["receiver"][]),
  ...(vtxsData as ProductByCategory["vtx"][]),
  ...(antennasData as ProductByCategory["antenna"][]),
  ...(payloadsData as ProductByCategory["payload"][]),
];

export function productsByCategory<T extends ProductCategory>(
  category: T,
): ProductByCategory[T][] {
  return catalog.filter(
    (product): product is ProductByCategory[T] => product.category === category,
  );
}

export function getProduct<T extends ProductCategory>(
  category: T,
  id?: string,
): ProductByCategory[T] | undefined {
  if (!id) return undefined;

  return catalog.find(
    (product): product is ProductByCategory[T] =>
      product.category === category && product.id === id,
  );
}
