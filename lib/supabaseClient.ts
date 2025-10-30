/**
 * Simple compatibility shim for the canonical Supabase client.
 *
 * This file intentionally contains minimal logic: it re-exports the single
 * client instance created in `utils/supabase.ts`. Keeping a small shim here
 * avoids duplicated initialization across the codebase and fixes prior
 * parse/duplicate-declaration issues.
 */

import { supabase } from '@/utils/supabase';

export const getSupabaseClient = () => supabase ?? null;

export default getSupabaseClient;
