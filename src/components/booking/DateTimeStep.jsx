import { useState, useEffect, useMemo } from 'react';
import { fetchAppointmentsByBarberAndDate } from '../../services/api';

// ============================================
// 📅 Step 3 — Selecionar Dia e Horário
// ============================================

const WORK_START = 9;  // 09:00
const WORK_END = 19;   // 19:00 (último horário possível depende da duração)
const SLOT_INTERVAL = 30; // minutos entre cada slot

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function generateNext14Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }
  return days;
}

function generateTimeSlots(serviceDuration) {
  const slots = [];
  for (let hour = WORK_START; hour < WORK_END; hour++) {
    for (let min = 0; min < 60; min += SLOT_INTERVAL) {
      const endMin = hour * 60 + min + serviceDuration;
      if (endMin <= WORK_END * 60) {
        slots.push({
          hour,
          min,
          label: `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
        });
      }
    }
  }
  return slots;
}

function formatDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function DateTimeStep({ barberId, serviceDuration, selectedDate, selectedTime, onSelectDate, onSelectTime }) {
  const [busySlots, setBusySlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const days = useMemo(() => generateNext14Days(), []);
  const timeSlots = useMemo(() => generateTimeSlots(serviceDuration), [serviceDuration]);

  // Quando muda a data, busca agendamentos existentes
  useEffect(() => {
    if (!selectedDate || !barberId) return;

    let cancelled = false;
    const dateStr = formatDateStr(selectedDate);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingSlots(true);
    fetchAppointmentsByBarberAndDate(barberId, dateStr)
      .then((appointments) => {
        if (cancelled) return;
        const busy = appointments.map((a) => {
          const dt = new Date(a.data_hora);
          return `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
        });
        setBusySlots(busy);
      })
      .catch(() => { if (!cancelled) setBusySlots([]); })
      .finally(() => { if (!cancelled) setLoadingSlots(false); });

    return () => { cancelled = true; };
  }, [selectedDate, barberId]);

  // Verifica se um horário já passou (para o dia de hoje)
  function isSlotInPast(slot) {
    if (!selectedDate) return false;
    const today = new Date();
    if (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    ) {
      const now = today.getHours() * 60 + today.getMinutes();
      const slotMin = slot.hour * 60 + slot.min;
      return slotMin <= now;
    }
    return false;
  }

  const isSunday = (date) => date.getDay() === 0;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-dark-50 mb-2">Escolha o Dia e Horário</h2>
        <p className="text-dark-400 text-sm">Veja os horários disponíveis</p>
      </div>

      {/* ---- Calendário horizontal ---- */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-3 text-center">
          📅 Selecione o dia
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 px-1 snap-x snap-mandatory scrollbar-hide justify-start sm:justify-center">
          {days.map((date) => {
            const dateStr = formatDateStr(date);
            const isSelected = selectedDate && formatDateStr(selectedDate) === dateStr;
            const isToday = formatDateStr(new Date()) === dateStr;
            const sunday = isSunday(date);

            return (
              <button
                key={dateStr}
                id={`day-${dateStr}`}
                disabled={sunday}
                onClick={() => {
                  onSelectDate(date);
                  onSelectTime(null);
                }}
                className={`
                  snap-center flex flex-col items-center min-w-[60px] py-3 px-2 rounded-xl transition-all duration-300
                  border cursor-pointer
                  ${sunday
                    ? 'opacity-30 cursor-not-allowed border-transparent bg-dark-800/30'
                    : isSelected
                      ? 'bg-primary-500/15 border-primary-500 shadow-[0_0_20px_rgba(249,168,37,0.15)]'
                      : 'bg-dark-800/40 border-dark-700/40 hover:border-dark-500 hover:bg-dark-800/70'
                  }
                `}
              >
                <span className={`text-[10px] uppercase font-semibold tracking-wider ${isSelected ? 'text-primary-400' : 'text-dark-500'}`}>
                  {WEEKDAYS[date.getDay()]}
                </span>
                <span className={`text-xl font-bold my-0.5 ${isSelected ? 'text-primary-400' : 'text-dark-100'}`}>
                  {date.getDate()}
                </span>
                <span className={`text-[10px] ${isSelected ? 'text-primary-500/70' : 'text-dark-500'}`}>
                  {MONTHS[date.getMonth()]}
                </span>
                {isToday && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-primary-500' : 'bg-primary-500/50'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---- Grade de horários ---- */}
      {selectedDate && (
        <div className="animate-fade-in">
          <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-3 text-center">
            ⏰ Selecione o horário
          </h3>

          {loadingSlots ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-w-md mx-auto">
              {timeSlots.map((slot) => {
                const isBusy = busySlots.includes(slot.label);
                const isPast = isSlotInPast(slot);
                const isDisabled = isBusy || isPast;
                const isSelected = selectedTime === slot.label;

                return (
                  <button
                    key={slot.label}
                    id={`time-${slot.label}`}
                    disabled={isDisabled}
                    onClick={() => onSelectTime(slot.label)}
                    className={`
                      py-2.5 px-1 rounded-xl text-sm font-semibold transition-all duration-200
                      border cursor-pointer
                      ${isDisabled
                        ? 'opacity-25 cursor-not-allowed border-transparent bg-dark-800/30 text-dark-600 line-through'
                        : isSelected
                          ? 'bg-primary-500 text-dark-900 border-primary-500 shadow-[0_0_20px_rgba(249,168,37,0.3)]'
                          : 'bg-dark-800/50 text-dark-200 border-dark-700/40 hover:border-primary-500/50 hover:bg-dark-700/50'
                      }
                    `}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
