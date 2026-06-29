// ============================================
// 📍 StepIndicator — Barra de progresso do fluxo
// ============================================

const steps = [
  { number: 1, label: 'Serviço' },
  { number: 2, label: 'Barbeiro' },
  { number: 3, label: 'Horário' },
  { number: 4, label: 'Confirmar' },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-lg mx-auto mb-10">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            {/* Circle + Label */}
            <div className="flex flex-col items-center gap-1.5 min-w-[60px]">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-500 ease-out
                  ${isCompleted
                    ? 'bg-primary-500 text-dark-900 shadow-[0_0_20px_rgba(249,168,37,0.4)]'
                    : isActive
                      ? 'bg-primary-500/20 text-primary-400 ring-2 ring-primary-500 shadow-[0_0_25px_rgba(249,168,37,0.3)]'
                      : 'bg-dark-700/50 text-dark-400 ring-1 ring-dark-600'
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`
                  text-xs font-medium transition-colors duration-300
                  ${isActive ? 'text-primary-400' : isCompleted ? 'text-primary-500/70' : 'text-dark-500'}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div className="flex-1 h-[2px] mx-2 mt-[-20px] rounded-full overflow-hidden bg-dark-700">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-700 ease-out rounded-full"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
