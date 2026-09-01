-- Land Monetization Platform — MVP schema
-- Run this in the Supabase SQL editor after creating your project.

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  phone text,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists land_registrations (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references profiles(id) on delete cascade,
  survey_number text not null,
  plot_number text,
  latitude double precision not null,
  longitude double precision not null,
  area_sq_ft numeric not null,
  zoning text not null check (zoning in ('NA_URBAN','AGRI_LARGE','COMMERCIAL_INDUSTRIAL')),
  road text not null check (road in ('WIDE','NARROW')),
  location text not null check (location in ('GROWTH_CORRIDOR','REMOTE')),
  size text not null check (size in ('SMALL','MID','LARGE')),
  utilities text not null check (utilities in ('FULL','NONE')),
  title text not null check (title in ('CLEAN','DISPUTED')),
  photos text[] default '{}',
  land_docs text[] default '{}',
  owner_docs text[] default '{}',
  status text not null default 'SUBMITTED' check (status in ('SUBMITTED','UNDER_REVIEW','NEEDS_CORRECTION','VERIFIED','REJECTED')),
  correction_note text,
  created_at timestamptz default now()
);

create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  registration_id uuid references land_registrations(id) on delete cascade,
  name text not null,
  phone text not null,
  message text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table land_registrations enable row level security;
alter table leads enable row level security;

-- Users can read/update their own profile
create policy "profiles_self" on profiles
  for all using (auth.uid() = id);

-- Owners can manage their own registrations; anyone can read VERIFIED listings
create policy "registrations_owner_all" on land_registrations
  for all using (auth.uid() = owner_id);

create policy "registrations_public_read_verified" on land_registrations
  for select using (status = 'VERIFIED');

-- Anyone can submit a lead against a verified listing; only the owner can read leads on their plot
create policy "leads_insert_public" on leads
  for insert with check (true);

create policy "leads_owner_read" on leads
  for select using (
    exists (
      select 1 from land_registrations r
      where r.id = leads.registration_id and r.owner_id = auth.uid()
    )
  );
