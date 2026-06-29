import { useState, useEffect } from 'react';
import { fetchServices } from '../../services/api';

// ============================================
// ✂️ Step 1 — Selecionar Serviço
// ============================================

const serviceIcons = {
  'Corte': '✂️',
  'Barba': '🪒',
  'Sobrancelha': '✨',
  'Hidratação': '💧',
  'Infantil': '👦',
};

function getIcon(nome) {
  for (const [key, icon] of Object.entries(serviceIcons)) {
    if (nome.includes(key)) return icon;
  }
  return '💈';
}

export default function ServiceStep({ selected, onSelect }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error mb-2">Erro ao carregar serviços</p>
        <p className="text-dark-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-dark-50 mb-2">Escolha o Serviço</h2>
        <p className="text-dark-400 text-sm">Selecione o que deseja fazer hoje</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
        {services.map((service) => {
          const isSelected = selected?.id === service.id;
          return (
            <button
              key={service.id}
              id={`service-${service.id}`}
              onClick={() => onSelect(service)}
              className={`
                group relative p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer
                border
                ${isSelected
                  ? 'bg-primary-500/10 border-primary-500 shadow-[0_0_30px_rgba(249,168,37,0.15)]'
                  : 'bg-dark-800/60 border-dark-700/50 hover:border-dark-500 hover:bg-dark-800'
                }
              `}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-dark-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Icon */}
              <span className="text-3xl mb-3 block">{getIcon(service.nome)}</span>

              {/* Name */}
              <h3 className={`font-bold text-lg mb-2 transition-colors ${isSelected ? 'text-primary-400' : 'text-dark-100 group-hover:text-dark-50'}`}>
                {service.nome}
              </h3>

              {/* Price & Duration */}
              <div className="flex items-center gap-3">
                <span className={`text-xl font-bold ${isSelected ? 'text-primary-500' : 'text-primary-400'}`}>
                  R$ {Number(service.preco).toFixed(2).replace('.', ',')}
                </span>
                <span className="text-dark-500 text-sm flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {service.duracao_minutos} min
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
