-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS Table
create type user_role as enum ('student_inbound', 'student_outbound', 'admin', 'hospital_coord', 'city_manager');

create table public.users (
  id uuid primary key default uuid_generate_v4(),
  clerk_id text unique not null,
  role user_role not null default 'student_inbound',
  full_name text not null,
  email text not null,
  citizenship text not null, -- ISO Country Code
  medical_license_number text, -- Nullable for students
  home_institution text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. HOSPITALS Table
create table public.hospitals (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  location_city text not null,
  location_coordinates jsonb, -- { lat: number, long: number }
  bank_account_id text, -- Stripe Connect ID
  facility_fee_share numeric(5,2) default 20.00, -- Percentage
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PROGRAMS Table
create type program_type as enum ('observership', 'fellowship', 'hands_on');

create table public.programs (
  id uuid primary key default uuid_generate_v4(),
  hospital_id uuid references public.hospitals(id) on delete cascade not null,
  title text not null,
  type program_type not null,
  duration_weeks integer not null,
  price_usd numeric(10,2) not null,
  requires_nmc_registration boolean default false,
  housing_included boolean default true,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. APPLICATIONS Table
create type application_status as enum ('draft', 'submitted', 'approved', 'paid', 'active', 'completed');
create type nmc_status as enum ('pending', 'submitted_to_govt', 'approved');

create table public.applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  program_id uuid references public.programs(id) on delete restrict not null,
  status application_status default 'draft',
  travel_start_date date,
  travel_end_date date,
  nmc_doc_status nmc_status default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. HOUSING_UNITS Table
create table public.housing_units (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text not null,
  capacity integer not null default 1,
  city text not null,
  images text[], -- Array of image URLs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. BOOKINGS Table
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid references public.applications(id) on delete cascade not null,
  housing_unit_id uuid references public.housing_units(id) on delete restrict not null,
  check_in_date date not null,
  check_out_date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. LOGBOOK_ENTRIES Table
create type verification_status as enum ('verified_by_gps', 'flagged', 'signed_off');

create table public.logbook_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  date_logged timestamp with time zone default timezone('utc'::text, now()) not null,
  patient_mrn text, -- Hashed/Anonymized
  diagnosis_code text, -- ICD-10
  procedure_type text,
  gps_lat double precision,
  gps_long double precision,
  verification_status verification_status default 'flagged',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Template
alter table public.users enable row level security;
alter table public.applications enable row level security;
alter table public.logbook_entries enable row level security;

-- Users can see their own profile
create policy "Users can view own profile"
on public.users for select
using (auth.uid()::text = clerk_id); 
-- Note: This assumes some sync between Clerk ID and Supabase Auth or custom claim handling. 
-- In a real Supabase Auth scenario, it would be auth.uid() = id. 
-- For this architecture, we might treat `users` as a public profile table 
-- but we'll restrict it for now.

-- Students can see their own applications
create policy "Students can view own applications"
on public.applications for select
using (
  auth.uid() in (
    select id from public.users where id = applications.user_id
    -- This logic depends on how we handle auth. For now, this is a placeholder.
  )
);
