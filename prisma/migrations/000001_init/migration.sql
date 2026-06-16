create table if not exists products (
  id text primary key,
  category text not null,
  name text not null,
  brand text not null,
  description text,
  price_usd numeric,
  weight_g numeric,
  image_url text,
  model_url text,
  source_type text,
  source_note text,
  source_url text,
  last_updated timestamptz not null,
  tags text[] not null default '{}',
  specs jsonb not null
);

create table if not exists builds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  description text,
  selected_goal text,
  budget_usd numeric,
  parts jsonb not null,
  calculated_stats jsonb,
  warnings jsonb,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists model_assets (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references products(id),
  asset_type text not null,
  url text not null,
  format text,
  created_at timestamptz not null default now()
);

create table if not exists price_sources (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references products(id),
  vendor_name text not null,
  vendor_url text,
  price_usd numeric,
  in_stock boolean,
  last_checked timestamptz
);

create index if not exists products_category_idx on products(category);
create index if not exists products_specs_gin_idx on products using gin(specs);
create index if not exists builds_public_idx on builds(is_public);
create index if not exists builds_goal_idx on builds(selected_goal);
