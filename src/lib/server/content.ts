import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { defaultContent, type SiteContent } from '$lib/content/site';

const contentPath = resolve(process.cwd(), 'data', 'content.json');
const backupPath = resolve(process.cwd(), 'data', 'content.backup.json');

export interface ContentRepository {
	read(): Promise<SiteContent>;
	write(content: SiteContent): Promise<void>;
}

function cloneDefaults(): SiteContent {
	return structuredClone(defaultContent);
}

function normaliseContent(saved: Partial<SiteContent>): SiteContent {
	const defaults = cloneDefaults();
	const savedNavigation = saved.site?.navigation || [];
	const navigation = [...savedNavigation];
	for (const item of defaults.site.navigation) {
		if (!navigation.some((existing) => existing.href === item.href)) navigation.push(item);
	}

	const projectSource = (saved.contentVersion ?? 1) < 2
		? defaults.projects
		: (saved.projects || defaults.projects);
	const projects = projectSource
		.filter((project) => project.slug !== 'consular-ball')
		.map((project, index) => {
			const projectDefaults = defaults.projects.find((item) => item.slug === project.slug);
			return {
				...projectDefaults,
				...project,
				number: String(index + 1).padStart(2, '0'),
				gallery: project.gallery ?? projectDefaults?.gallery ?? []
			};
		});

	return {
		...defaults,
		...saved,
		contentVersion: defaults.contentVersion,
		site: { ...defaults.site, ...saved.site, navigation },
		media: { ...defaults.media, ...saved.media },
		pages: {
			home: { ...defaults.pages.home, ...saved.pages?.home },
			about: { ...defaults.pages.about, ...saved.pages?.about },
			projects: { ...defaults.pages.projects, ...saved.pages?.projects }
		},
		projects,
		consularBall: {
			...defaults.consularBall,
			...saved.consularBall,
			externalLink: {
				...defaults.consularBall.externalLink,
				...saved.consularBall?.externalLink
			},
			years: saved.consularBall?.years || defaults.consularBall.years
		},
		partnersPage: {
			...defaults.partnersPage,
			...saved.partnersPage,
			items: saved.partnersPage?.items || defaults.partnersPage.items
		}
	};
}

export class LocalJsonContentRepository implements ContentRepository {
	async read(): Promise<SiteContent> {
		try {
			const raw = await readFile(contentPath, 'utf8');
			return normaliseContent(JSON.parse(raw) as Partial<SiteContent>);
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === 'ENOENT') return cloneDefaults();
			console.error('Could not read saved Proud Partners content.', error);
			return cloneDefaults();
		}
	}

	async write(content: SiteContent): Promise<void> {
		if (
			!content?.site ||
			!Array.isArray(content.projects) ||
			!content.media ||
			!content.pages ||
			!content.consularBall ||
			!content.partnersPage
		) {
			throw new Error('The submitted content is incomplete.');
		}

		await mkdir(dirname(contentPath), { recursive: true });
		try {
			await copyFile(contentPath, backupPath);
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
		}
		await writeFile(contentPath, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
	}
}

export const contentRepository: ContentRepository = new LocalJsonContentRepository();

export const readContent = () => contentRepository.read();
export const writeContent = (content: SiteContent) => contentRepository.write(content);

