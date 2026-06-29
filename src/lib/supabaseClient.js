import { createClient } from '@supabase/supabase-js';

// ============================================
// 🔌 Supabase Client Configuration
// ============================================
// Ordem de resolução das credenciais:
//   1. Variáveis de ambiente (Vercel / .env local)  — preferência
//   2. Fallbacks abaixo (build in-line)              — para deploys sem env var
//
// A anon key é segura para ficar pública (esse é o design dela).
// Nunca commite a service_role key!

// --- Fallbacks in-line (use para que o build funcione sem env var) ---------
const FALLBACK_SUPABASE_URL = 'https://ifgcgtqlfutbpzwybrbs.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'sb_publishable_SHSabD2r8a79RdSPdV-naA_ZqLGYK_d';
// ---------------------------------------------------------------------------

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

// "Mal configurado" aqui significa: alguém limpou o projeto e não colocou
// nada no .env nem nos fallbacks. Em vez de quebrar a página inteira,
// mostramos um banner.
export const supabaseConfigError = !supabaseUrl || !supabaseAnonKey;

if (supabaseConfigError) {
  // eslint-disable-next-line no-console
  console.warn(
    '⚠️ Supabase não configurado.\n' +
      'Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env local ou nas ' +
      'Environment Variables da Vercel.'
  );
}

export const supabase = supabaseConfigError
  ? null
  : createClient(supabaseUrl, supabaseAnonKey);

export const supabaseConfigSource = {
  url: import.meta.env.VITE_SUPABASE_URL ? 'env' : 'fallback',
  key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'env' : 'fallback',
};
