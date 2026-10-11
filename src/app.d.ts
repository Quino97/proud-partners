import type { SiteContent } from '$lib/content/site';

declare global {
	namespace App {
		interface Locals {
			admin: boolean;
			adminSession?: string;
		}

		interface PageData {
			content: SiteContent;
		}
	}
}

export {};
