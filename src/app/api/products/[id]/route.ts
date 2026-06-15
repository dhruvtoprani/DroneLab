import { NextResponse } from "next/server";
import { catalog } from "@/lib/data/catalog";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/products/[id]">,
) {
  const { id } = await context.params;
  const product = catalog.find((item) => item.id === id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
