import { motion } from 'framer-motion';
import { FiChevronRight } from 'react-icons/fi';

interface Props {
  stack: string[];
}

export default function CallStackPanel({ stack }: Props) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="px-4 py-2 border-b border-white/5">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Call Stack</span>
      </div>
      <div className="p-3">
        {stack.length === 0 ? (
          <p className="text-xs text-gray-600 italic">Empty at this step.</p>
        ) : (
          <div className="flex flex-wrap items-center gap-1">
            {stack.map((fn, i) => (
              <motion.div
                key={`${fn}-${i}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1"
              >
                {i > 0 && <FiChevronRight className="text-gray-600 text-xs" />}
                <span
                  className={`
                    text-xs font-mono px-2 py-0.5 rounded
                    ${i === stack.length - 1
                      ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
                      : 'bg-surface text-gray-500 border border-white/5'
                    }
                  `}
                >
                  {fn}()
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
