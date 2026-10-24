import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import * as publicEnv from '$env/static/public';

const { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } = publicEnv as Record<string,string>;

const hasSupabaseConfiguration = Boolean(PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export const supabase: SupabaseClient | null = hasSupabaseConfiguration
	? createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
			auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
		})
	: null;

export const supabaseConfigurationMessage = hasSupabaseConfiguration
	? ''
	: 'Supabase is not configured for this copy of the site yet.';
