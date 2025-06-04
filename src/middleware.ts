import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async ({ url }, next) => {
  const token = url.searchParams.get('token');
  const validToken = import.meta.env.PUBLIC_MOODLE_TOKEN;

  console.log('📥 token (aus URL):', token);
  console.log('🔐 gültiger Token (aus .env):', validToken);

  if (token !== validToken) {
    console.log('⛔ Token ungültig!');
    return new Response('Zugriff verweigert', { status: 403 });
  }
  
  console.log('✅ Zugriff erlaubt!');
  return next();
};
