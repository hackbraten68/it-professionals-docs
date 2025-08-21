// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import netlify from '@astrojs/netlify/functions';

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  integrations: [
    starlight({
      title: 'Codingschule | IT Professionals - Documentation',
      defaultLocale: 'root', // root als Default
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
        de: {
          label: 'Deutsch',
          lang: 'de',
        },
      },
      customCss: ['./src/styles/custom.css'],
      social: [
        { label: 'GitHub', icon: 'github', href: 'https://github.com/hackbraten68/it-professionals-docs' },
      ],
      sidebar: [
        {
          label: 'Docker',
          items: [
            { label: 'Docker Fundamentals', collapsed: true, autogenerate: { directory: '07-docker-vcs/docker/01-docker-container-fundamentals/' } },
            { label: 'Docker CLI Basics', collapsed: true, autogenerate: { directory: '07-docker-vcs/docker/02-docker-cli-basics/' } },
            { label: 'Dockerfiles and Images', collapsed: true, autogenerate: { directory: '07-docker-vcs/docker/03-dockerfiles-and-images/' } },
            { label: 'Compose and Multi-Container Setups', collapsed: true, autogenerate: { directory: '07-docker-vcs/docker/04-compose-and-multi-container-setups/' } },
            { label: 'Persistent Data', collapsed: true, autogenerate: { directory: '07-docker-vcs/docker/05-persistant-data/' } },
            { label: 'Docker Networking', collapsed: true, autogenerate: { directory: '07-docker-vcs/docker/06-docker-networking/' } },
            { label: 'Security and Troubleshooting', collapsed: true, autogenerate: { directory: '07-docker-vcs/docker/07-security-and-troubleshooting/' } },
            { label: 'Deployment Scenarios', collapsed: true, autogenerate: { directory: '07-docker-vcs/docker/08-deployment-scenarios/' } },
            { label: 'Final Project', collapsed: true, autogenerate: { directory: '07-docker-vcs/docker/09-final-project/' } },
          ],
        },
        {
          label: 'Git',
          items: [
            { label: 'Introduction to Version Control Systems', collapsed: true, autogenerate: { directory: '07-docker-vcs/github/01-introduction-to-vcs/' } },
            { label: 'Git Basics', collapsed: true, autogenerate: { directory: '07-docker-vcs/github/02-git-basics/' } },
            { label: 'Git Branching and Merging', collapsed: true, autogenerate: { directory: '07-docker-vcs/github/03-branching-and-merging' } },
            { label: 'Introduction to GitHub', collapsed: true, autogenerate: { directory: '07-docker-vcs/github/04-introduction-github' } },
            { label: 'Collaboration in GitHub', collapsed: true, autogenerate: { directory: '07-docker-vcs/github/05-collaboration-in-github/' } },
            { label: 'Rebase, Stashing and Tags', collapsed: true, autogenerate: { directory: '07-docker-vcs/github/06-rebase-stashing-tags/' } },
            { label: 'GitHub Actions', collapsed: true, autogenerate: { directory: '07-docker-vcs/github/07-github-actions/' } },
          ],
        },
      ],
    }),
  ],
});
