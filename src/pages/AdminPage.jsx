import { useEffect, useState } from 'react';
import {
  fetchAppointmentsByDate,
  fetchAppointments,
  fetchBarbers,
  updateAppointmentStatus,
} from '../services/api';
import AppointmentCard from '../components/AppointmentCard';
import { formatCurrency, formatDate } from '../utils/formatters';

// ============================================
// 🛠️ AdminPage — painel administrativo
// ============================================

// Fallback para que o build funcione sem env var configurada.
// Troque para uma senha forte em produção — defina VITE_ADMIN_PASSWORD
// no .env local ou nas Environment Variables da Vercel para sobrescrever.
const FALLBACK_ADMIN_PASSWORD = 'Mineiro123';

const ADMIN_PASSWORD =
  import.meta.env.VITE_ADMIN_PASSWORD || FALLBACK_ADMIN_PASSWORD;
const SESSION_KEY = 'mineiro_admin_authed';

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function offsetDateStr(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isoDateNDaysAgo(n) {
  return offsetDateStr(-n);
}

function isoDateNDaysAhead(n) {
  return offsetDateStr(n);
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');

  if (!ADMIN_PASSWORD) {
    return (
      <section className="max-w-xl mx-auto px-4 py-20">
        <div className="bg-error/10 border border-error/30 text-error rounded-xl p-5 text-sm">
          <strong>VITE_ADMIN_PASSWORD</strong> não está definida no arquivo <code>.env</code>.
          Adicione uma senha e reinicie o servidor.
        </div>
      </section>
    );
  }

  if (!authed) return <LoginGate onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); }} />;
}

function LoginGate({ onSuccess }) {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onSuccess();
    } else {
      setErr('Senha incorreta.');
      setPwd('');
    }
  }

  return (
    <section className="max-w-md mx-auto px-4 py-20 animate-fade-in">
      <div className="bg-dark-800/60 border border-dark-700 rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-dark-50">Painel administrativo</h1>
          <p className="text-dark-400 text-sm mt-1">Informe a senha para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pwd}
            onChange={(e) => { setPwd(e.target.value); setErr(null); }}
            placeholder="Senha"
            autoFocus
            className="w-full bg-dark-900/50 border border-dark-700 rounded-xl px-4 py-3 text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
          />
          {err && <p className="text-error text-sm">{err}</p>}
          <button
            type="submit"
            className="w-full bg-primary-500 text-dark-900 py-3 rounded-full font-semibold hover:bg-primary-400 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </section>
  );
}

function Dashboard({ onLogout }) {
  const [dateMode, setDateMode] = useState('day'); // 'day' | 'all'
  const [date, setDate] = useState(todayStr());
  const [appointments, setAppointments] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [selectedBarberIds, setSelectedBarberIds] = useState([]); // [] = todos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('todos'); // todos | pendente | confirmado | concluido | cancelado

  // Carrega a lista de barbeiros uma vez (fonte da verdade do Supabase).
  useEffect(() => {
    let cancelled = false;
    fetchBarbers()
      .then((data) => {
        if (cancelled) return;
        // Garante ordem estável por nome
        const sorted = [...(data || [])].sort((a, b) =>
          a.nome.localeCompare(b.nome, 'pt-BR')
        );
        setBarbers(sorted);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Erro ao carregar barbeiros.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Recarrega agendamentos quando muda o modo de data ou o dia.
  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    const promise =
      dateMode === 'all'
        ? // No modo "Todos", esconde passados com mais de 7 dias para a
          // lista não virar um cemitério de agendamentos antigos.
          fetchAppointments({
            from: isoDateNDaysAgo(7),
            to: isoDateNDaysAhead(60),
          })
        : fetchAppointmentsByDate(date);

    promise
      .then((data) => {
        if (!cancelled) setAppointments(data || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Erro ao buscar agendamentos.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dateMode, date]);

  async function handleUpdateStatus(id, status) {
    try {
      const updated = await updateAppointmentStatus(id, status);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
      );
    } catch (err) {
      alert(`Erro ao atualizar: ${err.message}`);
    }
  }

  function toggleBarber(id) {
    setSelectedBarberIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  // Aplica filtros localmente (já viemos com o recorte de data do servidor).
  const visible = appointments.filter((a) => {
    if (selectedBarberIds.length && !selectedBarberIds.includes(a.barber_id)) {
      return false;
    }
    if (filter !== 'todos' && a.status !== filter) return false;
    return true;
  });

  const counts = countByStatus(visible);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-dark-50">
            Painel administrativo
          </h1>
          <p className="text-dark-400 text-sm mt-1">
            Gerencie os agendamentos da barbearia.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="self-start text-dark-400 hover:text-error text-sm font-medium transition"
        >
          Sair
        </button>
      </div>

      {/* Filtros de data + status */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle: dia atual vs todos */}
          <div className="inline-flex bg-dark-800/60 border border-dark-700 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setDateMode('day')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                dateMode === 'day'
                  ? 'bg-primary-500 text-dark-900'
                  : 'text-dark-300 hover:text-dark-100'
              }`}
            >
              📅 Dia
            </button>
            <button
              type="button"
              onClick={() => setDateMode('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                dateMode === 'all'
                  ? 'bg-primary-500 text-dark-900'
                  : 'text-dark-300 hover:text-dark-100'
              }`}
            >
              ∞ Todos
            </button>
          </div>

          {dateMode === 'day' && (
            <div className="flex items-center gap-2 bg-dark-800/60 border border-dark-700 rounded-xl px-3 py-2">
              <span className="text-dark-500 text-sm">📅</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-dark-100 focus:outline-none"
              />
            </div>
          )}

          {dateMode === 'all' && (
            <span className="text-xs text-dark-500">
              Mostrando dos últimos 7 dias até os próximos 60.
            </span>
          )}

          <div className="flex flex-wrap gap-2 sm:ml-auto">
            {[
              { v: 'todos', label: 'Todos' },
              { v: 'pendente', label: 'Pendentes' },
              { v: 'confirmado', label: 'Confirmados' },
              { v: 'concluido', label: 'Concluídos' },
              { v: 'cancelado', label: 'Cancelados' },
            ].map((f) => (
              <button
                key={f.v}
                onClick={() => setFilter(f.v)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
                  filter === f.v
                    ? 'bg-primary-500/15 text-primary-400 border border-primary-500/40'
                    : 'bg-dark-800/60 text-dark-400 border border-dark-700 hover:text-dark-100'
                }`}
              >
                {f.label}
                <span className="ml-1.5 text-[10px] opacity-70">
                  {f.v === 'todos' ? visible.length : counts[f.v] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filtro por barbeiro (multi-select) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-dark-500 mr-1">
            Barbeiro:
          </span>
          <button
            type="button"
            onClick={() => setSelectedBarberIds([])}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
              selectedBarberIds.length === 0
                ? 'bg-primary-500/15 text-primary-400 border border-primary-500/40'
                : 'bg-dark-800/60 text-dark-400 border border-dark-700 hover:text-dark-100'
            }`}
          >
            Todos
          </button>
          {barbers.map((b) => {
            const active = selectedBarberIds.includes(b.id);
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => toggleBarber(b.id)}
                className={`flex items-center gap-2 pl-1.5 pr-3 py-1 text-xs font-semibold rounded-full transition ${
                  active
                    ? 'bg-primary-500/15 text-primary-400 border border-primary-500/40'
                    : 'bg-dark-800/60 text-dark-400 border border-dark-700 hover:text-dark-100'
                }`}
              >
                <img
                  src={b.foto_url || '/placeholder-barber.jpg'}
                  alt={b.nome}
                  className="w-5 h-5 rounded-full object-cover border border-dark-600"
                />
                {b.nome}
              </button>
            );
          })}
          {barbers.length === 0 && !error && (
            <span className="text-xs text-dark-500">
              Carregando barbeiros…
            </span>
          )}
        </div>
      </div>

      {/* Resumo (reflete o conjunto filtrado) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Visíveis" value={visible.length} accent="text-dark-100" />
        <StatCard label="Pendentes" value={counts.pendente || 0} accent="text-warning" />
        <StatCard label="Confirmados" value={counts.confirmado || 0} accent="text-success" />
        <StatCard
          label="Receita prevista"
          value={formatCurrency(
            visible
              .filter((a) => a.status === 'confirmado' || a.status === 'concluido')
              .reduce((sum, a) => sum + Number(a.services?.preco || 0), 0)
          )}
          accent="text-primary-500"
          small
        />
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-error/10 border border-error/30 text-error rounded-xl p-5 text-sm">
          {error}
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-dark-800/40 border border-dark-700 rounded-2xl p-12 text-center">
          <p className="text-dark-400">
            Nenhum agendamento
            {filter !== 'todos' && (
              <span className="text-dark-300">
                {' '}com status <strong>{filter}</strong>
              </span>
            )}
            {dateMode === 'day' && (
              <span className="text-dark-300"> para {formatDate(`${date}T12:00:00`)}</span>
            )}
            {dateMode === 'all' && selectedBarberIds.length > 0 && (
              <span className="text-dark-300"> para os barbeiros selecionados</span>
            )}
            .
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((a) => (
            <AppointmentCard
              key={a.id}
              appointment={a}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value, accent, small }) {
  return (
    <div className="bg-dark-800/60 border border-dark-700 rounded-xl px-4 py-3">
      <p className="text-xs text-dark-500 uppercase tracking-wider">{label}</p>
      <p className={`font-bold ${small ? 'text-base' : 'text-2xl'} ${accent}`}>{value}</p>
    </div>
  );
}

function countByStatus(list) {
  return list.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});
}