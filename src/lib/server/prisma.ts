import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import type { PoolConfig } from "pg";

let prisma: PrismaClient | undefined;

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPrisma() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) return undefined;

  if (!prisma) {
    const adapter = new PrismaPg(createPoolConfig(connectionString));
    prisma = new PrismaClient({ adapter });
  }

  return prisma;
}

function createPoolConfig(connectionString: string): PoolConfig {
  if (!isSupabasePostgresUrl(connectionString)) {
    return { connectionString };
  }

  try {
    const url = new URL(connectionString);
    url.searchParams.delete("sslmode");

    return {
      connectionString: url.toString(),
      ssl: { rejectUnauthorized: false },
    };
  } catch {
    return {
      connectionString,
      ssl: { rejectUnauthorized: false },
    };
  }
}

function isSupabasePostgresUrl(connectionString: string) {
  return (
    connectionString.includes(".supabase.co") ||
    connectionString.includes(".pooler.supabase.com")
  );
}
