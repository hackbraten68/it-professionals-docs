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
					label: 'Week 1',
					autogenerate: { directory: 'week-1' }
				},
				{
					label: 'Week 2',
					autogenerate: { directory: 'week-2' }
				},
				{
					label: 'Cheat Sheets',
					autogenerate: { directory: 'cheatsheets' }
				},
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', link: '/guides/example/' },
					],
				},
				{
					label: 'Softskill Course',
					autogenerate: { directory: 'softskill' }
				}
			],
		}),
	],
});
