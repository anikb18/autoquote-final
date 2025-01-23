-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text
);

-- Create user_roles table
create table public.user_roles (
  id uuid references public.profiles on delete cascade primary key,
  role text not null default 'user'
);

-- Profiles RLS Policies
create policy "Public profiles are viewable by everyone"
on public.profiles for select using (true);

create policy "Users can update own profile"
on public.profiles for update using (auth.uid() = id);

-- User Roles RLS Policies
create policy "Admins can manage roles"
on public.user_roles for all using (
  exists (
    select 1 from public.user_roles 
    where id = auth.uid() and role = 'admin'
  )
) with check (
  exists (
    select 1 from public.user_roles 
    where id = auth.uid() and role = 'admin'
  )
);
