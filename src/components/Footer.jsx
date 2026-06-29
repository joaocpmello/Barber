import { Link } from 'react-router-dom';

// ============================================
// 🏪 Footer — Rodapé do site
// ============================================

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-dark-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <span className="text-2xl">✂️</span>
              <span className="text-xl font-heading font-bold text-dark-50 group-hover:text-primary-400 transition-colors">
                Mineiro <span className="text-primary-500">Barbearia</span>
              </span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed">
              Estilo e precisão em cada corte. Sua barbearia de confiança com os melhores profissionais.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">
              Navegação
            </h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Início' },
                { to: '/#servicos', label: 'Serviços' },
                { to: '/agendar', label: 'Agendar Horário' },
                { to: '/admin', label: 'Painel Admin' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-dark-400 hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-4">
              Contato
            </h3>
            <ul className="space-y-3 text-sm text-dark-400">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Rua Principal, 123 — Centro
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Seg–Sáb: 09:00 – 19:00
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (31) 99999-9999
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-dark-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-xs">
            © {currentYear} Mineiro Barbearia. Todos os direitos reservados.
          </p>
          <p className="text-dark-600 text-xs">
            Feito com 💛 e muito café
          </p>
        </div>
      </div>
    </footer>
  );
}
