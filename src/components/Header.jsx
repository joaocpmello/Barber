import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// ============================================
// 🏪 Header — Navegação principal
// ============================================

const navLinks = [
  { to: '/', label: 'Início' },
  { to: '/#servicos', label: 'Serviços', isHash: true },
  { to: '/agendar', label: 'Agendar' },
  { to: '/admin', label: 'Painel' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  function handleNavClick(link) {
    setMobileOpen(false);
    if (link.isHash && location.pathname === '/') {
      const el = document.getElementById('servicos');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">✂️</span>
            <span className="text-xl font-heading font-bold text-dark-50 group-hover:text-primary-400 transition-colors">
              Mineiro <span className="text-primary-500">Barbearia</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                !link.isHash && location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => handleNavClick(link)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-dark-300 hover:text-dark-50 hover:bg-dark-800'
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/agendar"
              className="ml-3 bg-primary-500 text-dark-900 px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-400 transition-all duration-200 hover:shadow-[0_0_20px_rgba(249,168,37,0.3)]"
            >
              Agendar Horário
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-dark-300 hover:text-dark-50 hover:bg-dark-800 transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark-900/95 backdrop-blur-xl border-t border-dark-700/50">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive =
                !link.isHash && location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => handleNavClick(link)}
                  className={`
                    block px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${isActive
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-dark-300 hover:text-dark-50 hover:bg-dark-800'
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/agendar"
              onClick={() => setMobileOpen(false)}
              className="block text-center mt-3 bg-primary-500 text-dark-900 px-5 py-3 rounded-full text-sm font-semibold hover:bg-primary-400 transition"
            >
              Agendar Horário
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
