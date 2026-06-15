import { NextRequest, NextResponse } from "next/server";
import { catalog } from "@/lib/data/catalog";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const category = params.get("category");
  const search = params.get("search")?.toLowerCase();
  const tag = params.get("tag")?.toLowerCase();
  const goal = params.get("goal")?.toLowerCase();

  const products = catalog.filter((product) => {
    if (category && product.category !== category) return false;
    if (
      search &&
      !`${product.name} ${product.brand} ${product.description ?? ""}`
        .toLowerCase()
        .includes(search)
    ) {
      return false;
    }
    if (tag && !product.tags.some((item) => item.toLowerCase() === tag)) {
      return false;
    }
    if (
      goal &&
      product.category === "frame" &&
      !product.recommendedUseCases.includes(goal)
    ) {
      return false;
    }

    return true;
  });

  return NextResponse.json({ products, count: products.length });
}
