-- Supabase schema for Stunion MVP

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  phone text not null,
  role text not null default 'parent',
  name text,
  created_at timestamptz default now()
);

create table tutors (
  id text primary key,
  user_id uuid references users(id) on delete set null,
  name text not null,
  headline text,
  bio text,
  education text,
  scores text,
  subjects text[] not null,
  rate integer not null check (rate >= 30000 and rate <= 200000),
  rating numeric(2,1) default 0,
  language text not null check (language in ('korean','english','both')),
  verified boolean not null default false,
  status text not null default 'pending',
  transcript_url text,
  score_url text,
  demo_url text,
  created_at timestamptz default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  tutor_id text references tutors(id) on delete cascade,
  parent_email text not null,
  parent_phone text not null,
  student_name text,
  booking_date timestamptz not null,
  duration_minutes integer not null check (duration_minutes > 0),
  location_preference text not null,
  subject_focus text,
  amount integer not null,
  fee integer not null,
  withholding integer not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

create table disputes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  parent_statement text,
  tutor_statement text,
  status text not null default 'open',
  created_at timestamptz default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  tutor_id text references tutors(id),
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now()
);
