/**
 * Astro Middleware: Token-based access protection for course content
 *
 * This middleware restricts access to specific routes unless a valid token is provided
 * via the URL (e.g., ?token=abc123). The valid token is defined in the .env file as:
 *
 *    PUBLIC_MOODLE_TOKEN=yourTokenHere
 *
 * To disable this protection (e.g., during development),
 * set the following in your .env file:
 *
 *    PROTECT=false
 *
 * ⚠️ Important for deployment on Netlify:
 * Before pushing changes to GitHub or triggering a new deployment,
 * make sure to set the `PROTECT` variable accordingly under:
 *
 *    Netlify → Site settings → Build & Deploy → Environment Variables
 *
 * Example:
 *    PROTECT=true       ← enables token protection
 *    PROTECT=false      ← disables protection for full access (e.g. while editing)
 *
 * Author:      hackbraten68 <mosdev@posteo.com>
 * GitHub:      https://github.com/hackbraten68
 * Version:     1.0.0
 * Created:     2025-06-04
 * Environment: Astro + Netlify Functions
 * License:     MIT
 */

import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async ({ url }, next) => {
  const protect = import.meta.env.PROTECT === 'true';

  if (!protect) {
    console.log('🟢 PROTECT=false → access protection disabled');
    return next();
  }

  const token = url.searchParams.get('token');
  const validToken = import.meta.env.PUBLIC_MOODLE_TOKEN;
  const path = url.pathname;

  // ⛔ Skip static assets like images, icons, fonts, etc.
  const isStaticAsset =
    path.startsWith('/_image') ||
    path.startsWith('/favicon.ico') ||
    path.startsWith('/robots.txt') ||
    path.startsWith('/.well-known') ||
    path.match(/\.(png|jpe?g|svg|gif|webp|ico|css|js|woff2?|ttf|map)$/);

  if (isStaticAsset) {
    return next(); // Skip protection for static files
  }

  // ✅ Token-based access control
  console.log('📥 Token from URL:', token);
  console.log('🔐 Valid token from .env:', validToken);

  if (token !== validToken) {
    console.log('⛔ Invalid or missing token!');
    return new Response('Access denied', { status: 403 });
  }

  console.log('✅ Access granted!');
  return next();
};
