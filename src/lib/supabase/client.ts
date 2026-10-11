import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

const hasSupabaseConfiguration = Boolean(PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export const supabase: SupabaseClient | null = hasSupabaseConfiguration
	? createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
			auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
		})
	: null;

export const supabaseConfigurationMessage = hasSupabaseConfiguration
	? ''
	: 'Supabase is not configured for this copy of the site yet.';
