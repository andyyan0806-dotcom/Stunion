-- Stunion MVP schema v0.3
-- Run in Supabase SQL editor (Dashboard → SQL Editor → New Query)
--
-- Storage buckets to create manually in Supabase Dashboard → Storage:
--   'photos'      (public)      — tutor profile photos
--   'credentials' (not public)  — transcripts and test score files

create table if not exists users (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  phone      text not null,
  role       text not null default 'parent' check (role in ('parent','tutor','admin')),
  name       text,
  status     text not null default 'active' check (status in ('active','suspended')),
  created_at timestamptz default now()
);

create table if not exists tutors (
  id                  text primary key,
  user_id             uuid references users(id) on delete set null,
  name                text not null,
  bio                 text check (char_length(bio) <= 500),
  education           text,
  scores              text,
  subjects            text[] not null check (array_length(subjects,1) between 1 and 5),
  rate                integer not null check (rate >= 30000 and rate <= 200000),
  rating              numeric(2,1) default 0,
  review_count        integer not null default 0,
  language            text not null check (language in ('korean','english','both')),
  verified            boolean not null default false,
  status              text not null default 'pending'
                        check (status in ('pending','under_review','verified','active','suspended','rejected')),
  intro_call_enabled  boolean not null default false,
  photo_url           text,
  transcript_url      text,
  score_url           text,
  created_at          timestamptz default now()
);

create table if not exists promo_codes (
  code                    text primary key,
  tutor_id                text references tutors(id) on delete cascade,
  free_sessions_remaining integer not null default 5 check (free_sessions_remaining >= 0),
  created_at              timestamptz default now(),
  expires_at              timestamptz
);

create table if not exists bookings (
  id                  uuid primary key default gen_random_uuid(),
  tutor_id            text references tutors(id) on delete cascade,
  parent_email        text not null,
  parent_phone        text not null,
  student_name        text,
  booking_date        timestamptz not null,
  duration_minutes    integer not null check (duration_minutes > 0),
  location_preference text not null check (location_preference in ('online','offline','hybrid')),
  subject_focus       text,
  amount              integer not null,
  fee                 integer not null,
  withholding         integer not null,
  payout_amount       integer not null,
  sender_name         text,
  promo_code_used     text references promo_codes(code),
  status              text not null default 'pending'
                        check (status in ('pending','accepted','completed','refunded','cancelled')),
  created_at          timestamptz default now()
);

create table if not exists payouts (
  id             uuid primary key default gen_random_uuid(),
  tutor_id       text references tutors(id) on delete cascade,
  booking_id     uuid references bookings(id),
  amount         integer not null,
  withholding_tax integer not null,
  status         text not null default 'pending' check (status in ('pending','paid')),
  paid_at        timestamptz,
  created_at     timestamptz default now()
);

create table if not exists intro_calls (
  id                      uuid primary key default gen_random_uuid(),
  parent_email            text not null,
  parent_phone            text not null,
  tutor_id                text references tutors(id) on delete cascade,
  preferred_times         text,
  subject_focus           text,
  discussion_notes        text,
  zoom_link               text,
  status                  text not null default 'pending'
                            check (status in ('pending','accepted','completed','cancelled')),
  requested_at            timestamptz default now(),
  scheduled_at            timestamptz,
  completed_at            timestamptz,
  converted_to_booking_id uuid references bookings(id)
);

create table if not exists reviews (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid references bookings(id) on delete cascade,
  tutor_id     text references tutors(id),
  parent_email text,
  rating       integer not null check (rating >= 1 and rating <= 5),
  comment      text,
  response     text,
  created_at   timestamptz default now()
);

create table if not exists messages (
  id              uuid primary key default gen_random_uuid(),
  sender_email    text not null,
  recipient_email text not null,
  booking_id      uuid references bookings(id),
  content         text not null,
  redacted_at     timestamptz,
  created_at      timestamptz default now()
);

create table if not exists disputes (
  id               uuid primary key default gen_random_uuid(),
  booking_id       uuid references bookings(id),
  raised_by        text not null,
  parent_statement text,
  tutor_statement  text,
  resolution       text,
  status           text not null default 'open' check (status in ('open','resolved','denied')),
  resolved_at      timestamptz,
  created_at       timestamptz default now()
);
