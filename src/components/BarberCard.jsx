export default function BarberCard({ barber, selected, onSelect }) {
  const { nome, foto_url, especialidade } = barber;

  return (
    <button
      type="button"
      onClick={() => onSelect(barber)}
      className={`flex flex-col items-center gap-3 rounded-2xl p-6 cursor-pointer
                  transition-all duration-300
                  hover:scale-[1.02] hover:shadow-lg hover:shadow-primary-500/10
                  ${selected
                    ? 'border-2 border-primary-500 ring-2 ring-primary-500/30 bg-dark-700'
                    : 'border border-dark-700 bg-dark-800 hover:border-primary-500/30'
                  }`}
    >
      {/* Barber photo */}
      <img
        src={foto_url || '/placeholder-barber.jpg'}
        alt={nome}
        className={`w-24 h-24 rounded-full object-cover transition-all duration-300
                    ${selected
                      ? 'border-2 border-primary-500'
                      : 'border-2 border-dark-600'
                    }`}
      />

      {/* Name */}
      <h3 className="text-lg font-heading font-semibold text-white">
        {nome}
      </h3>

      {/* Specialty */}
      {especialidade && (
        <p className="text-dark-300 text-sm text-center">
          {especialidade}
        </p>
      )}
    </button>
  );
}
