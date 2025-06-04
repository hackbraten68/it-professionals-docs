import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async ({ url }, next) => {
  const token = url.searchParams.get('token');
  const validToken = import.meta.env.PUBLIC_MOODLE_TOKEN;
  const path = url.pathname;

  // ⛔ Ausschluss von statischen Assets (damit Bilder, CSS & Fonts laden)
  const isStaticAsset =
    path.startsWith('/_image') ||
    path.startsWith('/favicon.ico') ||
    path.startsWith('/robots.txt') ||
    path.startsWith('/.well-known') ||
    path.match(/\.(png|jpe?g|svg|gif|webp|ico|css|js|woff2?|ttf|map)$/);

  if (isStaticAsset) {
    return next(); // Nicht prüfen
  }

  // ✅ Zugriffsschutz auf Inhalte
  console.log('📥 token (aus URL):', token);
  console.log('🔐 gültiger Token (aus .env):', validToken);

  if (token !== validToken) {
    console.log('⛔ Token ungültig!');
    return new Response('Zugriff verweigert', { status: 403 });
  }

  console.log('✅ Zugriff erlaubt!');
  return next();
};
