import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  variables: Record<string, unknown>;
}

export default function VariablePanel({ variables }: Props) {
  const entries = Object.entries(variables);

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-2 border-b border-white/5">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Variables</span>
      </div>
      <div className="p-3">
        {entries.length === 0 ? (
          <p className="text-xs text-gray-600 italic">No variables at this step.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <AnimatePresence>
              {entries.map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs font-mono text-brand-300">{key}</span>
                  <span className="text-xs text-gray-500">=</span>
                  <span className="text-xs font-mono text-emerald-300">
                    {JSON.stringify(value)}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
