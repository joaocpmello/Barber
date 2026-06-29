import { useState, useEffect, useMemo } from 'react';
import { fetchAppointmentsByBarberAndDate } from '../../services/api';

// ============================================
// 📅 Step 3 — Selecionar Dia e Horário
// ============================================

const WORK_START = 9;  // 09:00
const WORK_END = 19;   // 19:00 (último horário possível depende da duração)
const SLOT_INTERVAL = 30; // minutos entre cada slot

// Segunda → Domingo, para alinhar com ISO weeks.
const WEEKDAYS_SHORT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Navegação do calendário: máximo 60 dias à frente a partir de hoje.
const FORWARD_LIMIT_DAYS = 60;

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

/**
 * Retorna todos os dias do mês de `viewMonth`, com padding à esquerda
 * para o primeiro dia cair na coluna correta (Mon-first).
 * Cada célula é `{ date: Date, inMonth: boolean }`.
 */
function generateMonthCells(viewMonth) {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 0 = Sunday, 1 = Monday ... converter para Mon-first (0 = Monday)
  const weekdayOfFirst = (firstDayOfMonth.getDay() + 6) % 7;
  const cells = [];

  // Padding à esquerda (dias do mês anterior)
  for (let i = 0; i < weekdayOfFirst; i++) {
    const d = new Date(year, month, -(weekdayOfFirst - 1 - i));
    cells.push({ date: d, inMonth: false });
  }

  // Dias do mês atual
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month, day), inMonth: true });
  }

  // Padding à direita até completar múltiplo de 7
  while (cells.length % 7 !== 0) {
    const d = new Date(year, month, daysInMonth + (cells.length - (weekdayOfFirst + daysInMonth)) + 1);
    cells.push({ date: d, inMonth: false });
  }

  return cells;
}

function formatDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isSameDay(a, b) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

export default function DateTimeStep({ barberId, serviceDuration, selectedDate, selectedTime, onSelectDate, onSelectTime }) {
  const [busySlots, setBusySlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = useMemo(() => new Date(), []);
  const maxMonth = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + FORWARD_LIMIT_DAYS);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }, [today]);

  const cells = useMemo(() => generateMonthCells(viewMonth), [viewMonth]);
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
    if (!isSameDay(selectedDate, today)) return false;
    const now = today.getHours() * 60 + today.getMinutes();
    const slotMin = slot.hour * 60 + slot.min;
    return slotMin <= now;
  }

  function dayState(cell) {
    const { date, inMonth } = cell;
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const futureLimit = new Date(today.getFullYear(), today.getMonth(), today.getDate() + FORWARD_LIMIT_DAYS);
    const isSunday = date.getDay() === 0;
    const isPast = date < todayMidnight;
    const isToday = isSameDay(date, today);
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isFutureLimit = date > futureLimit;
    return {
      isSunday,
      isPast,
      isToday,
      isSelected,
      isFutureLimit,
      isOutOfMonth: !inMonth,
      isDisabled: isSunday || isPast || !inMonth || isFutureLimit,
    };
  }

  function prevMonth() {
    setViewMonth((m) => {
      const d = new Date(m);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  }

  function nextMonth() {
    setViewMonth((m) => {
      const d = new Date(m);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  }

  const canGoPrev = (() => {
    const prev = new Date(viewMonth);
    prev.setMonth(prev.getMonth() - 1);
    return prev.getFullYear() > today.getFullYear()
      || (prev.getFullYear() === today.getFullYear() && prev.getMonth() >= today.getMonth());
  })();

  const canGoNext = viewMonth < maxMonth;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-dark-50 mb-2">Escolha o Dia e Horário</h2>
        <p className="text-dark-400 text-sm">Veja os horários disponíveis</p>
      </div>

      {/* ---- Calendário mensal ---- */}
      <div className="mb-8 max-w-2xl mx-auto">
        {/* Header do calendário (mês + setas) */}
        <div className="flex items-center justify-between mb-4 px-2">
          <button
            type="button"
            onClick={prevMonth}
            disabled={!canGoPrev}
            aria-label="Mês anterior"
            className="w-9 h-9 rounded-full flex items-center justify-center
                       bg-dark-800/60 border border-dark-700 text-dark-200
                       hover:border-primary-500/50 hover:text-primary-400
                       disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-dark-700 disabled:hover:text-dark-200
                       transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="text-center">
            <h3 className="text-lg font-heading font-semibold text-dark-50">
              {MONTHS[viewMonth.getMonth()]}
              <span className="text-dark-500 ml-2 text-sm font-normal">{viewMonth.getFullYear()}</span>
            </h3>
          </div>

          <button
            type="button"
            onClick={nextMonth}
            disabled={!canGoNext}
            aria-label="Próximo mês"
            className="w-9 h-9 rounded-full flex items-center justify-center
                       bg-dark-800/60 border border-dark-700 text-dark-200
                       hover:border-primary-500/50 hover:text-primary-400
                       disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-dark-700 disabled:hover:text-dark-200
                       transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {WEEKDAYS_SHORT.map((d) => (
            <div key={d} className="text-center text-[10px] uppercase tracking-wider font-semibold text-dark-500 py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Grade de dias */}
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((cell, idx) => {
            const st = dayState(cell);
            const dateStr = formatDateStr(cell.date);

            return (
              <button
                key={`${dateStr}-${idx}`}
                type="button"
                disabled={st.isDisabled}
                onClick={() => {
                  onSelectDate(cell.date);
                  onSelectTime(null);
                  // Trazer o mês selecionado para a visão atual se clicou em dia de outro mês
                  if (!st.isOutOfMonth) {
                    // nada a fazer
                  }
                }}
                title={st.isSunday ? 'Fechado aos domingos' : undefined}
                className={`
                  relative aspect-square flex flex-col items-center justify-center rounded-xl
                  text-sm font-semibold transition-all duration-200 border
                  ${st.isDisabled
                    ? 'opacity-25 cursor-not-allowed border-transparent bg-dark-800/20 text-dark-600'
                    : st.isSelected
                      ? 'bg-primary-500 text-dark-900 border-primary-500 shadow-[0_0_20px_rgba(249,168,37,0.4)] scale-105'
                      : st.isOutOfMonth
                        ? 'bg-transparent border-transparent text-dark-700 cursor-default'
                        : 'bg-dark-800/40 text-dark-100 border-dark-700/40 hover:border-primary-500/50 hover:bg-dark-700/60 cursor-pointer'
                  }
                `}
              >
                <span className={`text-base ${st.isSelected ? 'font-bold' : ''}`}>
                  {cell.date.getDate()}
                </span>
                {st.isToday && !st.isSelected && (
                  <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-primary-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legenda */}
        <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-dark-500 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            Hoje
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-primary-500/15 border border-primary-500" />
            Selecionado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-dark-800/40 border border-dark-700/40 opacity-50" />
            Indisponível
          </span>
        </div>
      </div>

      {/* ---- Grade de horários ---- */}
      {selectedDate && (
        <div className="animate-fade-in max-w-2xl mx-auto">
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
                    type="button"
                    id={`time-${slot.label}`}
                    disabled={isDisabled}
                    onClick={() => onSelectTime(slot.label)}
                    className={`
                      py-2.5 px-1 rounded-xl text-sm font-semibold transition-all duration-200
                      border
                      ${isDisabled
                        ? 'opacity-25 cursor-not-allowed border-transparent bg-dark-800/30 text-dark-600 line-through'
                        : isSelected
                          ? 'bg-primary-500 text-dark-900 border-primary-500 shadow-[0_0_20px_rgba(249,168,37,0.3)]'
                          : 'bg-dark-800/50 text-dark-200 border-dark-700/40 hover:border-primary-500/50 hover:bg-dark-700/50 cursor-pointer'
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