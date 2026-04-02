import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';
import { getTrace } from '../api/traceApi';
import type { TraceResponse } from '../types/trace';
import TracePlayer from '../components/TracePlayer';

export default function TracePage() {
  const { id } = useParams<{ id: string }>();
  const [trace, setTrace] = useState<TraceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getTrace(id)
      .then(setTrace)
      .catch(() => setError('Failed to load trace.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <FiLoader className="text-brand-400 text-3xl" />
        </motion.div>
      </div>
    );
  }

  if (error || !trace) {
    return (
      <div className="flex items-center justify-center py-32 text-red-400">
        {error || 'Trace not found.'}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-100">
          {trace.title || 'Untitled Trace'}
        </h1>
        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 font-medium uppercase tracking-wider">
          {trace.problemType}
        </span>
        {trace.hasCrash && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 font-medium">
            💀 Crash
          </span>
        )}
      </div>
      <TracePlayer trace={trace} />
    </div>
  );
}
