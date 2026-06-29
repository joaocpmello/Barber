import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import EnvConfigBanner from './components/EnvConfigBanner';
import Home from './pages/Home';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      <ScrollToTop />
      <EnvConfigBanner />
      <Header />
      {/* pt-16 compensa o header fixo */}
      <main className="flex-1 pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agendar" element={<BookingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-32 text-center">
      <h1 className="text-5xl font-heading font-bold text-dark-50 mb-4">
        Página não encontrada
      </h1>
      <p className="text-dark-300 mb-8">
        O endereço que você procura não existe ou foi movido.
      </p>
      <a
        href="/"
        className="inline-block bg-primary-500 text-dark-900 px-6 py-3 rounded-full font-semibold hover:bg-primary-400 transition"
      >
        Voltar ao início
      </a>
    </section>
  );
}