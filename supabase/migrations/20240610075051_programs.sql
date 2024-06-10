create table programs (
  id uuid references auth.users on delete cascade not null primary key,
  owner uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  updated_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  name text not null default '',
  description text default '',
  location geography(point),
  
  price numeric not null,
  subscription_frequency interval,
  include_deplacement_cost bool default false not null,

  default_phone_calls int2 not null default 0 check (phone_calls >= 0),
  default_visits int2 not null default 0 check (visits >= 0)
);

alter table programs
  enable row level security;

create policy "Public services are viewable by everyone." on services
  for select using (true);

create policy "Users can create their own services." on services
  for insert with check (auth.uid() = owner);

create policy "Users can delete their own services." on services
  for delete using (auth.uid() = owner);

create policy "Users can update own services." on services
  for update using (auth.uid() = owner);

create function public.program_handle_update()
returns trigger as $$
begin
  new.updated_at = CURRENT_TIMESTAMP;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_program_updated
  after update on public.profiles
  for each row execute procedure public.program_handle_update();