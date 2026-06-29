/**
 * Traduz erros do Supabase em algo que a UI consegue tratar com dignidade.
 *
 * O Supabase-js às vezes devolve `Invalid API key` (chave errada / projeto
 * errado), `fetch failed` (sem internet), `JWT expired`, etc. Em vez de
 * deixar isso cair no console como string crua, marcamos o erro com um
 * `code` que o resto do app pode filtrar.
 */

const API_KEY_HINTS = [
  'invalid api key',
  'apikey',
  'jwt',
  'anon key',
  'publishable',
];

export function annotateSupabaseError(err, contextLabel) {
  if (!err) return err;
  const msg = String(err.message || err).toLowerCase();

  let code = 'UNKNOWN';
  if (msg.includes('invalid api key') || msg.includes('apikey')) {
    code = 'SUPABASE_INVALID_KEY';
  } else if (msg.includes('jwt')) {
    code = 'SUPABASE_JWT_ERROR';
  } else if (msg.includes('fetch failed') || msg.includes('network')) {
    code = 'NETWORK_ERROR';
  } else if (msg.includes('permission') || msg.includes('policy')) {
    code = 'SUPABASE_RLS_ERROR';
  } else if (msg.includes('not found') || msg.includes('does not exist')) {
    code = 'NOT_FOUND';
  }

  const wrapped = new Error(
    `[${contextLabel || 'supabase'}] ${err.message || err}`
  );
  wrapped.code = code;
  wrapped.cause = err;
  return wrapped;
}

export function isSupabaseError(err, code) {
  return Boolean(err && err.code === code);
}

export { API_KEY_HINTS };

/**
 * Despacha um evento `supabase:error` que o EnvConfigBanner escuta.
 * Não faz nada em SSR / testes (sem `window`).
 */
export function reportSupabaseError(err) {
  if (typeof window === 'undefined' || !err) return;
  window.dispatchEvent(
    new CustomEvent('supabase:error', { detail: err })
  );
}
