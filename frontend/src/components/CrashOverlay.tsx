import { motion } from 'framer-motion';
import { FiXCircle } from 'react-icons/fi';
import type { CrashInfo } from '../types/trace';

interface Props {
  crashInfo: CrashInfo;
  lineOfCode: string;
}

export default function CrashOverlay({ crashInfo, lineOfCode }: Props) {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Tinted backdrop */}
      <div className="absolute inset-0 bg-red-950/40 backdrop-blur-sm rounded-xl" />

      {/* Crash card */}
      <motion.div
        className="relative z-10 max-w-md w-full mx-4 bg-surface border border-red-500/30 rounded-2xl p-6 shadow-2xl shadow-red-500/10"
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center">
            <span className="text-2xl">💀</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-400">Runtime Crash</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{crashInfo.type.replace('_', ' ')}</p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 mb-4">
          <p className="text-sm text-red-300 leading-relaxed">{crashInfo.message}</p>
        </div>

        <div className="text-xs text-gray-500">
          <span className="text-gray-400">Crashing line: </span>
          <code className="font-mono text-red-300 bg-red-500/10 px-1.5 py-0.5 rounded">
            {lineOfCode}
          </code>
        </div>
      </motion.div>
    </motion.div>
  );
}
