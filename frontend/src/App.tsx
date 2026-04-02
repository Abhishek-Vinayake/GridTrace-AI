import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTerminal, FiClock, FiZap } from 'react-icons/fi';
import HomePage from './pages/HomePage';
import TracePage from './pages/TracePage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Navbar ──────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 glass-card border-b border-brand-500/10 px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
            <FiTerminal className="text-white text-lg" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
            GridTrace AI
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <NavLink to="/" icon={<FiZap />} label="Trace" current={location.pathname} />
          <NavLink to="/history" icon={<FiClock />} label="History" current={location.pathname} />
        </div>
      </nav>

      {/* ── Pages ───────────────────────────────────────────── */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/trace/:id" element={<PageTransition><TracePage /></PageTransition>} />
            <Route path="/history" element={<PageTransition><HistoryPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="text-center text-xs text-gray-500 py-4 border-t border-white/5">
        Built with FastAPI · React · Gemini 2.5 Pro
      </footer>
    </div>
  );
}

/* ── Helper Components ──────────────────────────────────────── */

function NavLink({ to, icon, label, current }: { to: string; icon: React.ReactNode; label: string; current: string }) {
  const isActive = current === to || (to !== '/' && current.startsWith(to));
  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
        ${isActive
          ? 'bg-brand-500/15 text-brand-300'
          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
        }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
