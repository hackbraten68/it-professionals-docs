import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'AWS re/start course docs',
			social: {
				github: 'https://github.com/hackbraten68/aws-restart-docs',
			},
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Documentation Guide', link: '/guides/navigation/' },
					],
				},
				{
					label: 'AWS Course Scripts',
					items: [
						{
							label: 'Cloud Foundation',
							collapsed: true,
							autogenerate: { directory: 'week-1' }
						},
						{
							label: 'Linux Fundamentals',
							collapsed: true,
							autogenerate: { directory: 'week-2' }
						},
						{
							label: 'Networking',
							collapsed: true,
							badge: { text: 'Updated', variant: 'tip' },
							autogenerate: { directory: 'week-3' }
						},
						{
							label: 'Security',
							collapsed: true,
							badge: { text: 'In progress', variant: 'caution' },
							autogenerate: { directory: 'week-4' }
						},
					]
				},
				{
					label: 'Cheat Sheets',
					collapsed: true,
					autogenerate: { directory: 'cheatsheets' }
				},
				{
					label: 'Python',
					collapsed: true,
					autogenerate: { directory: 'python' }
				},
				{
					label: 'Softskill Course',
					collapsed: true,
					autogenerate: { directory: 'softskill' }
				},
				{
					label: 'Course Archive',
					collapsed: true,
					hidden: true,
					autogenerate: { directory: 'archive' }
				}
			],
		}),
	],
});
