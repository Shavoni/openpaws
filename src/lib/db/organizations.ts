import type { SupabaseClient } from '@supabase/supabase-js'
import type { Organization } from '@/types'

export async function getOrganization(supabase: SupabaseClient, orgId: string) {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single()

  if (error) throw error
  return data as Organization
}

export async function updateOrganization(
  supabase: SupabaseClient,
  orgId: string,
  updates: Partial<Pick<Organization, 'name' | 'logo_url' | 'branding'>>
) {
  const { data, error } = await supabase
    .from('organizations')
    .update(updates)
    .eq('id', orgId)
    .select()
    .single()

  if (error) throw error
  return data as Organization
}
