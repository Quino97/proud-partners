import type { Handle } from '@sveltejs/kit';
import { ADMIN_COOKIE, isValidSession } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(ADMIN_COOKIE);
	event.locals.adminSession = token;
	event.locals.admin = isValidSession(token);
	return resolve(event);
};

