import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from './queryKeys'
import { CACHE_TIMES } from '@/lib/constants'
import { normalizeError } from '@/lib/errors'
import { slugify } from '@/utils/slugify'
import type { TagRow } from '@/types/app'

/**
 * Public query hook for fetching available furniture tags.
 * Cached efficiently with 5m staleTime to prevent redundant requests.
 */
export function useTags() {
  return useQuery<TagRow[], Error>({
    queryKey: queryKeys.tags.list(),
    queryFn: async ({ signal }) => {
      let query = supabase
        .from('tags')
        .select('id, name, slug')
        .order('name', { ascending: true })

      if (signal) {
        query = query.abortSignal(signal)
      }

      const { data, error } = await query

      if (error) {
        throw normalizeError(error)
      }

      return (data as TagRow[]) || []
    },
    staleTime: CACHE_TIMES.PUBLIC_STALE_MS,
  })
}

/**
 * Finds an existing tag by name/slug or creates a new one gracefully.
 * Resolves 409 unique constraint conflicts seamlessly.
 */
export async function findOrCreateTag(name: string): Promise<TagRow> {
  const trimmedName = name.trim()
  if (!trimmedName) {
    throw new Error('Tag name cannot be empty.')
  }

  const slug = slugify(trimmedName) || trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  // 1. Check if tag already exists in Supabase (case-insensitive name match or slug match)
  const { data: existing } = await supabase
    .from('tags')
    .select('id, name, slug')
    .or(`name.ilike.${trimmedName},slug.eq.${slug}`)
    .limit(1)
    .maybeSingle()

  if (existing) {
    return existing as TagRow
  }

  // 2. Attempt creation
  const { data, error } = await supabase
    .from('tags')
    .insert({ name: trimmedName, slug })
    .select('id, name, slug')
    .single()

  if (error) {
    // 3. Handle race condition / duplicate constraint gracefully
    if (
      error.code === '23505' ||
      error.message?.includes('unique constraint') ||
      error.message?.includes('tags_name_key')
    ) {
      const { data: duplicate } = await supabase
        .from('tags')
        .select('id, name, slug')
        .or(`name.ilike.${trimmedName},slug.eq.${slug}`)
        .limit(1)
        .maybeSingle()

      if (duplicate) {
        return duplicate as TagRow
      }
    }
    throw normalizeError(error)
  }

  return data as TagRow
}

/**
 * Mutation hook to create or select a tag and invalidate tag queries.
 */
export function useCreateTag() {
  const queryClient = useQueryClient()

  return useMutation<TagRow, Error, string>({
    mutationFn: findOrCreateTag,
    onSuccess: (tag) => {
      queryClient.setQueryData<TagRow[]>(queryKeys.tags.list(), (prev) => {
        if (!prev) return [tag]
        if (prev.some((t) => t.id === tag.id)) return prev
        return [...prev, tag].sort((a, b) => a.name.localeCompare(b.name))
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.list() })
    },
  })
}
