import { motion } from 'framer-motion';
import { FiSkipBack, FiChevronLeft, FiChevronRight, FiPlay, FiPause } from 'react-icons/fi';

interface Props {
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onTogglePlay: () => void;
  playing: boolean;
  isAtStart: boolean;
  isAtEnd: boolean;
  currentStep: number;
  totalSteps: number;
}

export default function StepControls({
  onPrev, onNext, onReset, onTogglePlay,
  playing, isAtStart, isAtEnd, currentStep, totalSteps,
}: Props) {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="glass-card p-4">
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-surface rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex items-center justify-center gap-2">
        <ControlButton onClick={onReset} disabled={isAtStart} title="Reset">
          <FiSkipBack />
        </ControlButton>

        <ControlButton onClick={onPrev} disabled={isAtStart} title="Previous Step">
          <FiChevronLeft />
        </ControlButton>

        <motion.button
          onClick={onTogglePlay}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500
            flex items-center justify-center text-white text-xl
            shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40
            transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={playing ? 'Pause' : 'Play'}
        >
          {playing ? <FiPause /> : <FiPlay />}
        </motion.button>

        <ControlButton onClick={onNext} disabled={isAtEnd} title="Next Step">
          <FiChevronRight />
        </ControlButton>

        <span className="ml-3 text-xs text-gray-500 font-mono min-w-[3.5rem] text-center">
          {currentStep} / {totalSteps}
        </span>
      </div>
    </div>
  );
}

function ControlButton({ onClick, disabled, title, children }: {
  onClick: () => void; disabled: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg
        transition-all
        ${disabled
          ? 'bg-surface/50 text-gray-700 cursor-not-allowed'
          : 'bg-surface-light text-gray-300 hover:bg-surface-lighter hover:text-white'
        }`}
    >
      {children}
    </button>
  );
}
