import { redirect } from '@sveltejs/kit';
import { sitePath } from '$lib/utils/site-path';
export const load = () => redirect(307,sitePath('/projects'));
