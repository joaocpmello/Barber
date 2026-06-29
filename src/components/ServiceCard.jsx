import { formatCurrency, formatDuration } from '../utils/formatters';

export default function ServiceCard({ service }) {
  const { nome, preco, duracao_minutos } = service;

  return (
    <div
      className="bg-dark-800 border border-dark-700 rounded-2xl p-6
                 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-500/10 hover:border-primary-500/30
                 transition-all duration-300 cursor-default"
    >
      {/* Duration badge */}
      <span className="inline-block bg-dark-700 text-dark-200 text-xs font-medium px-3 py-1 rounded-full mb-4">
        🕐 {formatDuration(duracao_minutos)}
      </span>

      {/* Service name */}
      <h3 className="text-xl font-heading font-semibold text-white mb-3">
        {nome}
      </h3>

      {/* Price */}
      <p className="text-2xl font-bold text-primary-500">
        {formatCurrency(preco)}
      </p>
    </div>
  );
}
