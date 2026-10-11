import { writable } from 'svelte/store';
import { defaultContent, type SiteContent } from '$lib/content/site';
import { addSiteBase } from '$lib/utils/site-path';
import { supabase } from '$lib/supabase/client';

// The static default also needs the Pages base prefix during server rendering.
export const siteContent = writable<SiteContent>(addSiteBase(defaultContent));

export async function refreshPublishedContent() {
	if (!supabase) return;

	const { data, error } = await supabase
		.from('site_content')
		.select('content')
		.eq('id', 'primary')
		.maybeSingle();

	if (error) {
		console.warn('Could not load published Proud Partners content.', error.message);
		return;
	}

	if (data?.content) siteContent.set(addSiteBase(data.content as SiteContent));
}
