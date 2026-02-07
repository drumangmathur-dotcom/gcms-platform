-- 2. HOUSING SYSTEM
-- Add city to users for City Managers
alter table public.users add column if not exists city text;

create table public.housing_units (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text,
  city text not null, -- 'New Delhi', 'Kochi', 'Mumbai'
  capacity integer default 1,
  price_per_month integer default 500,
  images text[], -- Array of image URLs
  amenities text[], -- ['WiFi', 'AC', 'Kitchen']
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.housing_bookings (
  id uuid primary key default uuid_generate_v4(),
  unit_id uuid references public.housing_units(id) on delete set null,
  user_id uuid references public.users(id) on delete cascade not null,
  application_id uuid references public.applications(id) on delete set null, -- Link to specific rotation
  check_in date not null,
  check_out date not null,
  status text default 'confirmed', -- 'confirmed', 'cancelled', 'completed'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.housing_units enable row level security;
alter table public.housing_bookings enable row level security;

-- Everyone can view units
create policy "Public units are viewable by everyone." on public.housing_units for select using (true);

-- Only admins can insert/update units (using service role, so implicit)

-- Users can view their own bookings
create policy "Users can view own bookings." on public.housing_bookings for select using (auth.uid() = user_id);

-- Admins can view all bookings (implicit with service role or add policy)
