import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { defaultContent, normaliseContent, type SiteContent } from '$lib/content/site';
const contentPath = resolve(process.cwd(), 'data', 'content.json');
const backupPath = resolve(process.cwd(), 'data', 'content.backup.json');
export interface ContentRepository { read(): Promise<SiteContent>; write(content: SiteContent): Promise<void> }
export class LocalJsonContentRepository implements ContentRepository {
	async read(): Promise<SiteContent> {
		try { return normaliseContent(JSON.parse(await readFile(contentPath,'utf8'))); }
		catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') console.error('Could not read saved content.',error); return structuredClone(defaultContent); }
	}
	async write(content: SiteContent): Promise<void> {
		if (content.contentVersion !== 3 || !content.site || !Array.isArray(content.pages) || !Array.isArray(content.mediaLibrary) || !content.contact) throw Error('The content is incomplete.');
		await mkdir(dirname(contentPath),{recursive:true});
		try { await copyFile(contentPath,backupPath); } catch(error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
		await writeFile(contentPath,JSON.stringify(content,null,2)+'\n','utf8');
	}
}
export const contentRepository: ContentRepository = new LocalJsonContentRepository();
export const readContent = () => contentRepository.read();
export const writeContent = (content:SiteContent) => contentRepository.write(content);
