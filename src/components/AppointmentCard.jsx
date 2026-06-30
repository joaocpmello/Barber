import { formatCurrency, formatDateTime } from '../utils/formatters';
import StatusBadge from './StatusBadge';

export default function AppointmentCard({ appointment, onUpdateStatus }) {
  const {
    id,
    cliente_nome,
    cliente_whatsapp,
    data_hora,
    status,
    barbers,
    services,
    observacoes,
  } = appointment;

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 transition-all duration-300 hover:border-dark-600">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Barber photo & name */}
        <div className="flex items-center sm:flex-col sm:items-center gap-3 sm:gap-2 sm:w-20 shrink-0">
          <img
            src={barbers?.foto_url || '/placeholder-barber.jpg'}
            alt={barbers?.nome}
            className="w-12 h-12 rounded-full object-cover border-2 border-dark-600"
          />
          <span className="text-sm text-dark-300 font-medium text-center">
            {barbers?.nome}
          </span>
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Client name */}
          <h3 className="text-lg font-heading font-bold text-white truncate">
            {cliente_nome}
          </h3>

          {/* Service + price */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-dark-200 text-sm">{services?.nome}</span>
            {services?.preco != null && (
              <span className="text-primary-500 text-sm font-semibold">
                {formatCurrency(services.preco)}
              </span>
            )}
          </div>

          {/* Date/time */}
          <p className="text-dark-400 text-sm">
            📅 {formatDateTime(data_hora)}
          </p>

          {/* WhatsApp */}
          {cliente_whatsapp && (
            <a
              href={`https://wa.me/${cliente_whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-dark-300 hover:text-primary-500 transition-colors duration-300"
            >
              📱 {cliente_whatsapp}
            </a>
          )}

          {/* Observações do cliente */}
          {observacoes && observacoes.trim() && (
            <div className="mt-2 border-l-2 border-primary-500/40 bg-primary-500/5 rounded-r-md px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-primary-400 font-semibold mb-0.5">
                Observações
              </p>
              <p className="text-sm text-dark-200 italic whitespace-pre-wrap break-words">
                “{observacoes.trim()}”
              </p>
            </div>
          )}
        </div>

        {/* Status & Actions */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          <StatusBadge status={status} />

          <div className="flex items-center gap-2">
            {status === 'pendente' && (
              <>
                <button
                  onClick={() => onUpdateStatus(id, 'confirmado')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg
                             bg-success/20 text-success
                             hover:bg-success/30 active:scale-95
                             transition-all duration-300"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => onUpdateStatus(id, 'cancelado')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg
                             bg-error/20 text-error
                             hover:bg-error/30 active:scale-95
                             transition-all duration-300"
                >
                  Cancelar
                </button>
              </>
            )}

            {status === 'confirmado' && (
              <>
                <button
                  onClick={() => onUpdateStatus(id, 'concluido')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg
                             bg-info/20 text-info
                             hover:bg-info/30 active:scale-95
                             transition-all duration-300"
                >
                  Concluir
                </button>
                <button
                  onClick={() => onUpdateStatus(id, 'cancelado')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg
                             bg-error/20 text-error
                             hover:bg-error/30 active:scale-95
                             transition-all duration-300"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
