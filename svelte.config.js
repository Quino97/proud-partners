import adapter from '@sveltejs/adapter-node';
import staticAdapter from '@sveltejs/adapter-static';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const pagesBasePath = process.env.BASE_PATH || '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: isGitHubPages
			? staticAdapter({
					pages: 'build',
					assets: 'build',
					fallback: '404.html',
					strict: false
				})
			: adapter(),
		paths: {
			base: isGitHubPages ? pagesBasePath : '',
			relative: false
		},
		prerender: {
			handleMissingId: 'warn'
		}
	}
};

export default config;
