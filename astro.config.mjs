import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import netlify from '@astrojs/netlify/functions';

// https://astro.build/config
export default defineConfig({
	output: 'server', // necessary to make middleware work
  	adapter: netlify(),
	integrations: [
		starlight({
			title: 'Codingschule | IT Professionals - Documentation',
			customCss: ['./src/styles/custom.css'],
			social: [
				{
					label: "GitHub",
					icon: "github",
					href: "https://github.com/hackbraten68"
				}
			],
			sidebar: [
				{
					label: 'Docker',
					items: [
						{
							label: 'Docker Fundamentals',
							collapsed: true,
							autogenerate: { directory: '07-docker-vcs/docker/01-docker-container-fundamentals/' }
						},
						{
							label: 'Docker CLI Basics',
							collapsed: true,
							autogenerate: { directory: '07-docker-vcs/docker/02-docker-cli-basics/' }
						},
						{
							label: 'Dockerfiles and Images',
							collapsed: true,
							autogenerate: { directory: '07-docker-vcs/docker/03-dockerfiles-and-images/' }
						},
						{
							label: 'Compose and Multi-Container Setups',
							collapsed: true,
							autogenerate: { directory: '07-docker-vcs/docker/04-compose-and-multi-container-setups/' }
						},
						{
							label: 'Persistant Data',
							collapsed: true,
							autogenerate: { directory: '07-docker-vcs/docker/05-persistant-data/' }
						},
						{
							label: 'Docker Networking',
							collapsed: true,
							autogenerate: { directory: '07-docker-vcs/docker/06-docker-networking/' }
						},
						{
							label: 'Security and Troubleshooting',
							collapsed: true,
							autogenerate: { directory: '07-docker-vcs/docker/07-security-and-troubleshooting/' }
						},
						{
							label: 'Deployment Scenarios',
							collapsed: true,
							autogenerate: { directory: '07-docker-vcs/docker/08-deployment-scenarios/' }
						},
						{
							label: 'Final Project',
							collapsed: true,
							autogenerate: { directory: '07-docker-vcs/docker/09-final-project/' }
						},
					]
				},
			],
		}),
	],
});
