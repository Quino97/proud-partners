import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	ADMIN_COOKIE,
	createSession,
	credentialsMatch,
	revokeSession
} from '$lib/server/auth';

export const prerender = false;

export const load: PageServerLoad = ({ locals }) => ({ authenticated: locals.admin });

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const form = await request.formData();
		const username = String(form.get('username') || '');
		const password = String(form.get('password') || '');

		if (!credentialsMatch(username, password)) {
			return fail(400, { message: 'That username or password is not correct.', username });
		}

		cookies.set(ADMIN_COOKIE, createSession(), {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: false,
			maxAge: 60 * 60 * 8
		});
		redirect(303, '/admin');
	},
	logout: ({ cookies, locals }) => {
		revokeSession(locals.adminSession);
		cookies.delete(ADMIN_COOKIE, { path: '/' });
		redirect(303, '/admin');
	}
};

