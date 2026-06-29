import { useState, useEffect } from 'react';
import { fetchBarbers } from '../../services/api';

// ============================================
// 💇 Step 2 — Selecionar Barbeiro
// ============================================

export default function BarberStep({ selected, onSelect }) {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBarbers()
      .then(setBarbers)
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
        <p className="text-error mb-2">Erro ao carregar barbeiros</p>
        <p className="text-dark-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-dark-50 mb-2">Escolha seu Barbeiro</h2>
        <p className="text-dark-400 text-sm">Quem vai cuidar do seu visual?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
        {barbers.map((barber) => {
          const isSelected = selected?.id === barber.id;
          return (
            <button
              key={barber.id}
              id={`barber-${barber.id}`}
              onClick={() => onSelect(barber)}
              className={`
                group relative flex flex-col items-center p-6 rounded-2xl transition-all duration-300 cursor-pointer
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

              {/* Photo */}
              <div className={`
                w-20 h-20 rounded-full overflow-hidden mb-4 ring-2 transition-all duration-300
                ${isSelected
                  ? 'ring-primary-500 shadow-[0_0_20px_rgba(249,168,37,0.3)]'
                  : 'ring-dark-600 group-hover:ring-dark-400'
                }
              `}>
                <img
                  src={barber.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(barber.nome)}&background=f9a825&color=121212&size=160&bold=true`}
                  alt={barber.nome}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Name */}
              <h3 className={`font-bold text-base mb-1 transition-colors ${isSelected ? 'text-primary-400' : 'text-dark-100'}`}>
                {barber.nome}
              </h3>

              {/* Specialty */}
              {barber.especialidade && (
                <p className="text-dark-500 text-xs text-center leading-relaxed">
                  {barber.especialidade}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
