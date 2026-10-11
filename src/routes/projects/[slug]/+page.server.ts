import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { content } = await parent();
	const project = content.projects.find((item) => item.slug === params.slug);

	if (!project) error(404, 'Project not found');

	const index = content.projects.findIndex((item) => item.slug === project.slug);
	const nextProject = content.projects[(index + 1) % content.projects.length];

	return { project, nextProject };
};
