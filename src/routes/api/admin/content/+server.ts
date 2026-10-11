import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { SiteContent } from '$lib/content/site';
import { writeContent } from '$lib/server/content';

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.admin) return json({ message: 'Your admin session has expired.' }, { status: 401 });

	try {
		const content = (await request.json()) as SiteContent;
		await writeContent(content);
		return json({ ok: true, savedAt: new Date().toISOString() });
	} catch (error) {
		return json(
			{ message: error instanceof Error ? error.message : 'The content could not be saved.' },
			{ status: 400 }
		);
	}
};

