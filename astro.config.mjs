import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'AWS re/start course docs',
			social: [
				{
					label: "GitHub",
					icon: "github",
					href: "https://github.com/hackbraten68"
				}
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Documentation Guide', link: '/guides/navigation/' },
						{ label: 'Exam Questions', link: '/exams/kc' }
					],
				},
				{
					label: 'AWS Course Scripts',
					items: [
						{
							label: 'Cloud Foundation',
							collapsed: true,
							badge: { text: 'revisit', variant: 'tip' },
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
							autogenerate: { directory: 'networking' }
						},
						{
							label: 'Security',
							collapsed: true,
							autogenerate: { directory: 'security' }
						},
						{
							label: 'Databases',
							collapsed: true,
							autogenerate: { directory: 'databases' }
						},
						{
							label: 'AWS Architecture',
							collapsed: true,
							autogenerate: { directory: 'aws-architecture' }
						},
						{
							label: 'Systems Operations',
							collapsed: true,
							badge: { text: 'todo', variant: 'success' },
							autogenerate: { directory: 'system-operations' }
						},
						{
							label: 'Tooling and Automation',
							collapsed: true,
							badge: { text: 'todo', variant: 'success' },
							autogenerate: { directory: 'tooling-automation' }
						},
						{
							label: 'Servers',
							collapsed: true,
							badge: { text: 'todo', variant: 'success' },
							autogenerate: { directory: 'servers' }
						},
						{
							label: 'Scaling and Name Resolution',
							collapsed: true,
							badge: { text: 'todo', variant: 'success' },
							autogenerate: { directory: 'scaling-name-resolution' }
						},
						{
							label: 'Serverless and Containers',
							collapsed: true,
							badge: { text: 'todo', variant: 'success' },
							autogenerate: { directory: 'serverless-and-containers' }
						},
						{
							label: 'AWS Database Services',
							collapsed: true,
							badge: { text: 'todo', variant: 'success' },
							autogenerate: { directory: 'aws-database-services' }
						},
						{
							label: 'AWS Networking Services',
							collapsed: true,
							badge: { text: 'todo', variant: 'success' },
							autogenerate: { directory: 'aws-networking-services' }
						},
						{
							label: 'Storage and Archiving',
							collapsed: true,
							badge: { text: 'todo', variant: 'success' },
							autogenerate: { directory: 'storage-archiving' }
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
