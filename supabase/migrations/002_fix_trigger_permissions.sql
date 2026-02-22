-- Fix handle_new_user trigger: add explicit search_path and grant permissions

-- Grant insert permissions to supabase_auth_admin (runs auth triggers)
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT INSERT ON public.organizations TO supabase_auth_admin;
GRANT INSERT ON public.profiles TO supabase_auth_admin;
GRANT INSERT ON public.workspaces TO supabase_auth_admin;

-- Also need SELECT for gen_random_uuid and sequences
GRANT SELECT ON ALL TABLES IN SCHEMA public TO supabase_auth_admin;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO supabase_auth_admin;

-- Recreate the function with explicit search_path to fix schema resolution
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- Create default organization for new user
  INSERT INTO public.organizations (name, slug)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)) || '''s Workspace',
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), ' ', '-')) || '-' || SUBSTRING(NEW.id::TEXT, 1, 8)
  )
  RETURNING id INTO new_org_id;

  -- Create profile linked to org
  INSERT INTO public.profiles (id, email, full_name, organization_id, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    new_org_id,
    'owner'
  );

  -- Create default workspace
  INSERT INTO public.workspaces (organization_id, name)
  VALUES (new_org_id, 'My Brand');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
