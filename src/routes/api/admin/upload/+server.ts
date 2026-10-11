import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const allowedTypes: Record<string, string> = {
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/webp': '.webp',
	'image/gif': '.gif',
	'image/avif': '.avif'
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.admin) return json({ message: 'Your admin session has expired.' }, { status: 401 });

	const form = await request.formData();
	const file = form.get('image');
	if (!(file instanceof File) || file.size === 0) {
		return json({ message: 'Choose an image to upload.' }, { status: 400 });
	}
	if (!allowedTypes[file.type] || file.size > 12 * 1024 * 1024) {
		return json({ message: 'Use a JPG, PNG, WebP, GIF or AVIF image smaller than 12 MB.' }, { status: 400 });
	}

	const originalBase = file.name
		.replace(extname(file.name), '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '')
		.slice(0, 48) || 'image';
	const filename = `${originalBase}-${randomUUID().slice(0, 8)}${allowedTypes[file.type]}`;
	const uploadDirectory = resolve(process.cwd(), 'static', 'uploads');
	await mkdir(uploadDirectory, { recursive: true });
	await writeFile(resolve(uploadDirectory, filename), new Uint8Array(await file.arrayBuffer()));

	return json({ ok: true, path: `/uploads/${filename}` });
};

