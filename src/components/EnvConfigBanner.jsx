import { useEffect, useState } from 'react';
import { supabaseConfigError } from '../lib/supabaseClient';

/**
 * Banner mostrado no topo do app quando algo está errado com o Supabase.
 * Cobre dois casos:
 *  - Misconfiguração estática (env var e fallback ausentes ao construir)
 *  - Erros em tempo de execução (chave inválida, JWT, RLS, rede, ...)
 *
 * O site continua renderizando — o usuário vê o que precisa corrigir.
 */
export default function EnvConfigBanner() {
  const [open, setOpen] = useState(true);
  const [runtimeError, setRuntimeError] = useState(null);

  useEffect(() => {
    function onError(e) {
      const detail = e?.detail;
      if (!detail) return;
      // Aceita tanto Error nativo quanto objeto {code, message, cause}
      const code = detail.code || 'UNKNOWN';
      const message = detail.message || String(detail);
      if (
        code === 'SUPABASE_NOT_CONFIGURED' ||
        code === 'SUPABASE_INVALID_KEY' ||
        code === 'SUPABASE_JWT_ERROR' ||
        code === 'SUPABASE_RLS_ERROR' ||
        code === 'NETWORK_ERROR'
      ) {
        setRuntimeError({ code, message });
      }
    }
    window.addEventListener('supabase:error', onError);
    return () => window.removeEventListener('supabase:error', onError);
  }, []);

  if (!supabaseConfigError && !runtimeError) return null;
  if (!open) return null;

  const issue = runtimeError?.code || (supabaseConfigError ? 'CONFIG' : null);
  const url = import.meta.env.VITE_SUPABASE_URL;

  const messages = {
    CONFIG:
      'Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env ou no painel da Vercel.',
    SUPABASE_INVALID_KEY:
      'A chave do Supabase foi recusada (Invalid API key). Provavelmente é um placeholder ou pertence a outro projeto. Troque pela chave `anon` real do Supabase (começa com eyJ...).',
    SUPABASE_JWT_ERROR:
      'A chave do Supabase está expirada ou mal-formada. Gere uma nova em Supabase → Settings → API.',
    SUPABASE_RLS_ERROR:
      'O Supabase bloqueou o acesso por causa das políticas de RLS (Row Level Security). Ajuste as policies no SQL editor.',
    NETWORK_ERROR:
      'Não consegui falar com o Supabase (fetch failed). Verifique sua internet ou se o projeto Supabase não foi pausado.',
  };
  const title =
    issue === 'CONFIG'
      ? 'Supabase não configurado'
      : 'Erro ao falar com o Supabase';

  return (
    <div
      role="alert"
      className="bg-amber-500/95 text-dark-900 border-b border-amber-600"
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-start gap-3">
        <span aria-hidden className="text-xl leading-none">⚠️</span>
        <div className="flex-1 text-sm leading-relaxed">
          <p className="font-semibold">{title}</p>
          <p className="mt-1">{messages[issue] || messages.CONFIG}</p>
          {issue === 'CONFIG' && (
            <pre className="mt-2 bg-dark-900/90 text-amber-100 rounded p-2 text-xs overflow-x-auto">
{`VITE_SUPABASE_URL=${url || 'https://seu-projeto.supabase.co'}
VITE_SUPABASE_ANON_KEY=eyJ...   (a chave anon real do Supabase)`}
            </pre>
          )}
          {runtimeError && (
            <p className="mt-1 text-xs opacity-80">
              código: <span className="font-mono">{runtimeError.code}</span>
              {import.meta.env.DEV && (
                <>
                  {' — '}
                  <span className="font-mono break-all">
                    {runtimeError.message}
                  </span>
                </>
              )}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="shrink-0 rounded p-1 hover:bg-dark-900/20"
          aria-label="Fechar aviso"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
