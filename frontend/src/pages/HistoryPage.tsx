import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiList, FiAlertTriangle, FiArrowRight, FiLoader } from 'react-icons/fi';
import { listTraces } from '../api/traceApi';
import type { TraceListItem } from '../types/trace';

export default function HistoryPage() {
  const [traces, setTraces] = useState<TraceListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listTraces()
      .then(setTraces)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-6">Trace History</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <FiLoader className="text-brand-400 text-2xl" />
          </motion.div>
        </div>
      ) : traces.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg mb-2">No traces yet.</p>
          <Link to="/" className="text-brand-400 hover:text-brand-300 underline">
            Create your first trace →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {traces.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/trace/${t.id}`}
                className="glass-card p-4 flex items-center justify-between hover:border-brand-500/30 transition-all group block"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg
                    ${t.problemType === 'grid'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-blue-500/10 text-blue-400'
                    }`}
                  >
                    {t.problemType === 'grid' ? <FiGrid /> : <FiList />}
                  </div>
                  <div>
                    <div className="font-medium text-gray-200 flex items-center gap-2">
                      {t.title || 'Untitled'}
                      {t.hasCrash && (
                        <FiAlertTriangle className="text-red-400 text-sm" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <FiArrowRight className="text-gray-600 group-hover:text-brand-400 transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
