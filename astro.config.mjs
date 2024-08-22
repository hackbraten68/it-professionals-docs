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
							autogenerate: { directory: 'linux-fundamentals' }
						},
						{
							label: 'Networking',
							collapsed: true,
							badge: { text: 'Done', variant: 'tip' },
							autogenerate: { directory: 'networking' }
						},
						{
							label: 'Security',
							collapsed: true,
							badge: { text: 'Done', variant: 'tip' },
							autogenerate: { directory: 'security' }
						},
						{
							label: 'Databases',
							collapsed: true,
							badge: { text: 'New', variant: 'success' },
							autogenerate: { directory: 'databases' }
						},
						{
							label: 'AWS Architecture',
							collapsed: true,
							badge: { text: 'New', variant: 'success' },
							autogenerate: { directory: 'aws-architecture' }
						},
						{
							label: 'Systems Operations',
							collapsed: true,
							badge: { text: 'New', variant: 'success' },
							autogenerate: { directory: 'system-operations' }
						},
						{
							label: 'Tooling and Automation',
							collapsed: true,
							badge: { text: 'New', variant: 'success' },
							autogenerate: { directory: 'tooling-automation' }
						},
						{
							label: 'Servers',
							collapsed: true,
							badge: { text: 'New', variant: 'success' },
							autogenerate: { directory: 'servers' }
						},
						{
							label: 'Scaling and Name Resolution',
							collapsed: true,
							badge: { text: 'New', variant: 'success' },
							autogenerate: { directory: 'scaling-name-resolution' }
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
			],
		}),
	],
});
