import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async ({ request, redirect, url }, next) => {
  const token = url.searchParams.get('token');
  const validToken = import.meta.env.PUBLIC_MOODLE_TOKEN;

  // Optional: Nur bestimmte Routen absichern
  if (url.pathname.startsWith('/embed')) {
    if (token !== validToken) {
      return new Response('Forbidden', { status: 403 });
    }
  }

  return next();
};
