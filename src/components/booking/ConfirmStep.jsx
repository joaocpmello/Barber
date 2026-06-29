import { formatCurrency, formatDate, formatDuration } from '../../utils/formatters';

// ============================================
// ✅ Step 4 — Confirmação com dados do cliente
// ============================================

export default function ConfirmStep({
  service,
  barber,
  selectedDate,
  selectedTime,
  form,
  onChange,
  onSubmit,
  onBack,
  submitting,
  error,
}) {
  const dataHora = combineDateAndTime(selectedDate, selectedTime);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-dark-50 mb-2">Confirme seu agendamento</h2>
        <p className="text-dark-400 text-sm">Revise os dados e finalize o agendamento.</p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Resumo */}
        <div className="bg-dark-800/60 border border-dark-700 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-2">
            Resumo
          </h3>
          <SummaryRow label="Serviço">
            <span className="text-dark-100 font-medium">{service?.nome}</span>
            <span className="text-primary-500 ml-2">{formatCurrency(service?.preco)}</span>
          </SummaryRow>
          <SummaryRow label="Barbeiro">
            <span className="text-dark-100 font-medium">{barber?.nome}</span>
          </SummaryRow>
          <SummaryRow label="Data">
            <span className="text-dark-100 font-medium">
              {selectedDate ? formatDate(selectedDate) : '—'}
            </span>
          </SummaryRow>
          <SummaryRow label="Horário">
            <span className="text-dark-100 font-medium">{selectedTime || '—'}</span>
            <span className="text-dark-500 text-xs ml-2">
              ({formatDuration(service?.duracao_minutos)})
            </span>
          </SummaryRow>
        </div>

        {/* Dados do cliente */}
        <form onSubmit={onSubmit} className="space-y-4">
          <Field
            label="Nome completo"
            id="clienteNome"
            type="text"
            placeholder="João da Silva"
            value={form.clienteNome}
            onChange={(v) => onChange({ ...form, clienteNome: v })}
            required
          />
          <Field
            label="WhatsApp"
            id="clienteWhatsapp"
            type="tel"
            placeholder="(31) 99999-9999"
            value={form.clienteWhatsapp}
            onChange={(v) => onChange({ ...form, clienteWhatsapp: v })}
            required
          />
          <div>
            <label htmlFor="observacoes" className="block text-sm font-medium text-dark-200 mb-2">
              Observações <span className="text-dark-500">(opcional)</span>
            </label>
            <textarea
              id="observacoes"
              rows={3}
              placeholder="Ex: quero o degradê igual da última vez"
              value={form.observacoes}
              onChange={(e) => onChange({ ...form, observacoes: e.target.value })}
              className="w-full bg-dark-800/60 border border-dark-700 rounded-xl px-4 py-3 text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition resize-none"
            />
          </div>

          {error && (
            <div className="bg-error/10 border border-error/30 text-error rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              disabled={submitting}
              className="flex-1 border border-dark-700 text-dark-200 px-6 py-3 rounded-full font-semibold hover:border-dark-500 hover:text-dark-50 transition disabled:opacity-50"
            >
              ← Voltar
            </button>
            <button
              type="submit"
              disabled={submitting || !dataHora}
              className="flex-[2] bg-primary-500 text-dark-900 px-6 py-3 rounded-full font-semibold hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_25px_rgba(249,168,37,0.35)]"
            >
              {submitting ? 'Agendando…' : 'Confirmar agendamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SummaryRow({ label, children }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-dark-500 w-24 shrink-0">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Field({ label, id, type, placeholder, value, onChange, required }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-dark-200 mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-dark-800/60 border border-dark-700 rounded-xl px-4 py-3 text-dark-100 placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
      />
    </div>
  );
}

function combineDateAndTime(date, time) {
  if (!date || !time) return null;
  const [h, m] = time.split(':').map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}