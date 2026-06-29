import { useState } from 'react';
import { Link } from 'react-router-dom';
import StepIndicator from '../components/booking/StepIndicator';
import ServiceStep from '../components/booking/ServiceStep';
import BarberStep from '../components/booking/BarberStep';
import DateTimeStep from '../components/booking/DateTimeStep';
import ConfirmStep from '../components/booking/ConfirmStep';
import { createAppointment } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

// ============================================
// 📅 BookingPage — fluxo de agendamento
// ============================================

const INITIAL_FORM = { clienteNome: '', clienteWhatsapp: '', observacoes: '' };

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);
  const [barber, setBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function next() { setStep((s) => Math.min(s + 1, 4)); }
  function back() { setStep((s) => Math.max(s - 1, 1)); }

  function resetWizard() {
    setStep(1);
    setService(null);
    setBarber(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setForm(INITIAL_FORM);
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const [h, m] = selectedTime.split(':').map(Number);
    const dt = new Date(selectedDate);
    dt.setHours(h, m, 0, 0);

    try {
      setSubmitting(true);
      const created = await createAppointment({
        barberId: barber.id,
        serviceId: service.id,
        clienteNome: form.clienteNome,
        clienteWhatsapp: form.clienteWhatsapp,
        dataHora: dt.toISOString(),
        observacoes: form.observacoes || null,
        status: 'pendente',
      });
      setSuccess(created);
    } catch (err) {
      setError(err.message || 'Erro ao criar agendamento.');
    } finally {
      setSubmitting(false);
    }
  }

  // Tela de sucesso
  if (success) {
    return (
      <section className="max-w-xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
        <div className="bg-dark-800/60 border border-primary-500/30 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-heading font-bold text-dark-50 mb-2">
            Agendamento enviado!
          </h1>
          <p className="text-dark-300 mb-6">
            {success.cliente_nome?.split(' ')[0]}, seu agendamento está <span className="text-primary-400 font-semibold">pendente de confirmação</span>. Em breve entraremos em contato pelo WhatsApp.
          </p>

          <div className="bg-dark-900/50 border border-dark-700 rounded-xl p-4 text-left space-y-2 mb-6">
            <Row label="Serviço"><span className="text-dark-100">{service?.nome}</span></Row>
            <Row label="Barbeiro"><span className="text-dark-100">{barber?.nome}</span></Row>
            <Row label="Data"><span className="text-dark-100">{formatDate(selectedDate)}</span></Row>
            <Row label="Horário"><span className="text-dark-100">{selectedTime}</span></Row>
            <Row label="Total"><span className="text-primary-500 font-semibold">{formatCurrency(service?.preco)}</span></Row>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={resetWizard}
              className="flex-1 border border-dark-700 text-dark-100 px-5 py-3 rounded-full font-semibold hover:border-dark-500 hover:text-dark-50 transition"
            >
              Novo agendamento
            </button>
            <Link
              to="/"
              className="flex-1 bg-primary-500 text-dark-900 px-5 py-3 rounded-full font-semibold hover:bg-primary-400 transition text-center"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-dark-50 mb-2">
          Agendar horário
        </h1>
        <p className="text-dark-400">
          Siga os passos abaixo para marcar seu atendimento.
        </p>
      </div>

      <StepIndicator currentStep={step} />

      <div className="bg-dark-800/30 border border-dark-700/50 rounded-2xl p-6 sm:p-8">
        {step === 1 && (
          <ServiceStep
            selected={service}
            onSelect={(s) => { setService(s); setBarber(null); setSelectedDate(null); setSelectedTime(null); }}
            onNext={next}
          />
        )}
        {step === 2 && (
          <BarberStep
            selected={barber}
            onSelect={(b) => { setBarber(b); setSelectedDate(null); setSelectedTime(null); }}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 3 && (
          <DateTimeStep
            barberId={barber?.id}
            serviceDuration={service?.duracao_minutos}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={setSelectedDate}
            onSelectTime={setSelectedTime}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 4 && (
          <ConfirmStep
            service={service}
            barber={barber}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            form={form}
            onChange={setForm}
            onSubmit={handleSubmit}
            onBack={back}
            submitting={submitting}
            error={error}
          />
        )}
      </div>

      {/* Rodapé do wizard: avançar / voltar (exceto step 4, que tem seus próprios botões) */}
      {step < 4 && (
        <div className="max-w-4xl mx-auto mt-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={back}
              className="border border-dark-700 text-dark-200 px-6 py-3 rounded-full font-semibold hover:border-dark-500 hover:text-dark-50 transition"
            >
              ← Voltar
            </button>
          )}
          <button
            onClick={next}
            disabled={
              (step === 1 && !service) ||
              (step === 2 && !barber) ||
              (step === 3 && (!selectedDate || !selectedTime))
            }
            className="ml-auto bg-primary-500 text-dark-900 px-6 py-3 rounded-full font-semibold hover:bg-primary-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_25px_rgba(249,168,37,0.35)]"
          >
            Avançar →
          </button>
        </div>
      )}
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-dark-500">{label}</span>
      <span>{children}</span>
    </div>
  );
}