create extension if not exists postgis schema extensions;

create type access_level as enum ('public', 'private', 'mentored');

create table profile (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  updated_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  avatar_url text not null default '',
  full_name text not null default '',
  about_me text default '',
  location geography(point),
  location_visibility access_level default 'public',
  phone_number text not null default '',
  phone_number_visibility access_level not null default 'public',
  email text not null default '',
  email_visibility access_level default 'public'
);

alter table profile
  enable row level security;

create policy "Public profiles are viewable by everyone." on profile
  for select using (true);

create policy "Users can insert their own profile." on profile
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profile
  for update using ((select auth.uid()) = id);

create function public.profile_handle_update()
returns trigger as $$
begin
  new.updated_at = CURRENT_TIMESTAMP;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_updated
  after update on public.profile
  for each row execute procedure public.profile_handle_update();

create function public.profile_save_metadata()
returns trigger as $$
begin
  insert into public.profile (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.profile_save_metadata();