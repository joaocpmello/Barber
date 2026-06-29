import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchServices, fetchBarbers } from '../services/api';
import { formatCurrency } from '../utils/formatters';

// ============================================
// 🏠 Home — Página inicial
// ============================================

const HOW_IT_WORKS = [
  { icon: '✂️', title: '1. Escolha o serviço', desc: 'Corte, barba, sobrancelha e mais.' },
  { icon: '💈', title: '2. Escolha o barbeiro', desc: 'Os melhores profissionais da cidade.' },
  { icon: '📅', title: '3. Agende seu horário', desc: 'Rápido, fácil e sem complicação.' },
];

export default function Home() {
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchServices(), fetchBarbers()])
      .then(([s, b]) => { setServices(s); setBarbers(b); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-primary-500/5 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 grid md:grid-cols-2 gap-10 items-center relative">
          <div className="animate-fade-in">
            <span className="inline-block bg-primary-500/10 text-primary-400 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-5">
              ✂️ Barbearia Mineiro
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-dark-50 leading-tight mb-5">
              Estilo e precisão em <span className="text-primary-500">cada corte</span>.
            </h1>
            <p className="text-dark-300 text-lg mb-8 max-w-lg">
              Agende online em segundos. Escolha seu barbeiro, o melhor horário e apareça — a gente cuida do resto.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/agendar"
                className="bg-primary-500 text-dark-900 px-6 py-3 rounded-full font-semibold hover:bg-primary-400 transition-all duration-200 hover:shadow-[0_0_25px_rgba(249,168,37,0.35)]"
              >
                Agendar agora →
              </Link>
              <a
                href="#servicos"
                className="border border-dark-700 text-dark-100 px-6 py-3 rounded-full font-semibold hover:border-primary-500/50 hover:text-primary-400 transition"
              >
                Ver serviços
              </a>
            </div>

            <div className="mt-10 flex items-center gap-6 text-dark-400 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-primary-500 text-xl">★</span>
                <span>4.9 / 5.0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary-500 text-xl">👥</span>
                <span>+2.000 clientes</span>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in hidden md:block">
            <div className="absolute -inset-4 bg-primary-500/20 blur-3xl rounded-full" />

            {/* Collage de serviços (sem foto) */}
            <div className="relative w-full max-w-md mx-auto aspect-square">
              {/* Trás, à esquerda: Corte */}
              <div className="absolute top-4 left-0 w-44 h-44 rounded-3xl rotate-[-6deg]
                              bg-gradient-to-br from-dark-700 to-dark-800
                              border border-primary-500/30
                              shadow-[0_0_40px_rgba(249,168,37,0.15)]
                              flex flex-col items-center justify-center text-center
                              p-4">
                <span className="text-6xl mb-2">✂️</span>
                <span className="text-sm font-heading font-semibold text-dark-50">Corte</span>
              </div>

              {/* Trás, à direita: Barba */}
              <div className="absolute top-0 right-0 w-44 h-44 rounded-3xl rotate-[8deg]
                              bg-gradient-to-br from-dark-700 to-dark-800
                              border border-primary-500/30
                              shadow-[0_0_40px_rgba(249,168,37,0.15)]
                              flex flex-col items-center justify-center text-center
                              p-4">
                <span className="text-6xl mb-2">🪒</span>
                <span className="text-sm font-heading font-semibold text-dark-50">Barba</span>
              </div>

              {/* Frente, centralizado embaixo: Sobrancelha */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-48 rounded-3xl rotate-[-3deg]
                              bg-gradient-to-br from-primary-500 to-primary-600
                              border border-primary-400
                              shadow-[0_0_50px_rgba(249,168,37,0.4)]
                              flex flex-col items-center justify-center text-center
                              p-4">
                <span className="text-6xl mb-2">✨</span>
                <span className="text-sm font-heading font-semibold text-dark-900">Sobrancelha</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="bg-dark-800/30 border-y border-dark-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <SectionHeading
            eyebrow="Serviços"
            title="O que oferecemos"
            subtitle="Catálogo completo com preços e duração de cada serviço."
          />

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
          ) : services.length === 0 ? (
            <p className="text-center text-dark-400 py-8">Nenhum serviço disponível no momento.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="bg-dark-800 border border-dark-700 rounded-2xl p-6 hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300"
                >
                  <span className="inline-block bg-dark-700 text-dark-200 text-xs font-medium px-3 py-1 rounded-full mb-4">
                    🕐 {s.duracao_minutos} min
                  </span>
                  <h3 className="text-xl font-heading font-semibold text-white mb-3">{s.nome}</h3>
                  <p className="text-2xl font-bold text-primary-500">{formatCurrency(s.preco)}</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/agendar"
              className="inline-block bg-primary-500/10 text-primary-400 border border-primary-500/30 px-6 py-3 rounded-full font-semibold hover:bg-primary-500/20 transition"
            >
              Agendar agora →
            </Link>
          </div>
        </div>
      </section>

      {/* BARBEIROS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <SectionHeading
          eyebrow="Equipe"
          title="Nossos barbeiros"
          subtitle="Profissionais experientes prontos para cuidar do seu visual."
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : barbers.length === 0 ? (
          <p className="text-center text-dark-400 py-8">Nenhum barbeiro disponível no momento.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {barbers.map((b) => (
              <div
                key={b.id}
                className="flex flex-col items-center gap-3 rounded-2xl p-6 border border-dark-700 bg-dark-800 hover:border-primary-500/40 transition-all duration-300"
              >
                <img
                  src={b.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(b.nome)}&background=f9a825&color=121212&size=160&bold=true`}
                  alt={b.nome}
                  className="w-24 h-24 rounded-full object-cover border-2 border-dark-600"
                />
                <h3 className="text-lg font-heading font-semibold text-white">{b.nome}</h3>
                {b.especialidade && (
                  <p className="text-dark-300 text-sm text-center">{b.especialidade}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-dark-800/30 border-y border-dark-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <SectionHeading
            eyebrow="Simples e rápido"
            title="Como funciona"
            subtitle="Em 3 passos você sai com horário marcado."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.title}
                className="bg-dark-800 border border-dark-700 rounded-2xl p-6 text-center hover:border-primary-500/40 transition"
              >
                <div className="text-4xl mb-3">{step.icon}</div>
                <h3 className="text-lg font-heading font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-dark-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center mb-12">
      <span className="inline-block bg-primary-500/10 text-primary-400 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-3">
        {eyebrow}
      </span>
      <h2 className="text-3xl sm:text-4xl font-heading font-bold text-dark-50 mb-3">{title}</h2>
      <p className="text-dark-400 max-w-xl mx-auto">{subtitle}</p>
    </div>
  );
}