import { randomUUID } from 'node:crypto';
import { env } from '$env/dynamic/private';

export const ADMIN_COOKIE = 'pp_admin_session';
const sessions = new Set<string>();

export function credentialsMatch(username: string, password: string) {
	const expectedUsername = env.PP_ADMIN_USERNAME || 'admin';
	const expectedPassword = env.PP_ADMIN_PASSWORD || 'password';
	return username === expectedUsername && password === expectedPassword;
}

export function createSession() {
	const token = randomUUID();
	sessions.add(token);
	return token;
}

export function isValidSession(token?: string) {
	return Boolean(token && sessions.has(token));
}

export function revokeSession(token?: string) {
	if (token) sessions.delete(token);
}

