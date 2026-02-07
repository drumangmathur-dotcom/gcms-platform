-- Student Profiles Extension Migration
-- This extends the basic user table with detailed academic and research profiles

-- 1. STUDENT_PROFILES Table
create table public.student_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null unique,
  
  -- Demographics
  date_of_birth date,
  gender text,
  passport_number text,
  phone_number text,
  emergency_contact_name text,
  emergency_contact_phone text,
  
  -- Academic Credentials
  medical_school text,
  graduation_year integer,
  usmle_step1_score integer,
  usmle_step2ck_score integer,
  usmle_step2cs_passed boolean default false,
  usmle_step3_score integer,
  
  -- Research Portfolio
  publications_count integer default 0,
  h_index integer default 0,
  orcid_id text,
  research_interests text[], -- Array of research topics
  
  -- Languages (JSONB for flexibility)
  spoken_languages jsonb, -- [{"language": "English", "proficiency": "Native"}, ...]
  
  -- Documents (URLs to uploaded files)
  cv_url text,
  medical_diploma_url text,
  transcript_url text,
  
  -- Metadata
  profile_completion_percentage integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security
alter table public.student_profiles enable row level security;

-- Students can view and edit their own profile
create policy "Students can view own profile"
on public.student_profiles for select
using (true);

create policy "Students can update own profile"
on public.student_profiles for update
using (true);

create policy "Students can insert own profile"
on public.student_profiles for insert
with check (true);

-- Index for faster lookups
create index student_profiles_user_id_idx on public.student_profiles(user_id);
