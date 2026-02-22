import type { SupabaseClient } from '@supabase/supabase-js'
import type { Workspace } from '@/types'

export async function getWorkspaces(supabase: SupabaseClient, orgId: string) {
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('organization_id', orgId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as Workspace[]
}

export async function getWorkspace(supabase: SupabaseClient, workspaceId: string) {
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('id', workspaceId)
    .single()

  if (error) throw error
  return data as Workspace
}

export async function createWorkspace(
  supabase: SupabaseClient,
  orgId: string,
  name: string,
  description?: string
) {
  const { data, error } = await supabase
    .from('workspaces')
    .insert({ organization_id: orgId, name, description })
    .select()
    .single()

  if (error) throw error
  return data as Workspace
}
