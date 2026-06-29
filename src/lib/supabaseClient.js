import { createClient } from '@supabase/supabase-js';

// ============================================
// 🔌 Supabase Client Configuration
// ============================================
// Essas variáveis vêm do arquivo .env na raiz do projeto.
// Nunca commite a service_role key! Apenas a anon key é segura para o client.
//
// Para encontrar suas credenciais:
// 1. Acesse o painel do Supabase (https://supabase.com/dashboard)
// 2. Selecione seu projeto
// 3. Vá em Settings > API
// 4. Copie "Project URL" e "anon public" key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '⚠️ Variáveis do Supabase não configuradas!\n' +
    'Crie um arquivo .env na raiz do projeto com:\n\n' +
    'VITE_SUPABASE_URL=https://seu-projeto.supabase.co\n' +
    'VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui\n'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
