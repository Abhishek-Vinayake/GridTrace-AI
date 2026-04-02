import { motion } from 'framer-motion';
import type { ArrayState, CellRef } from '../types/trace';

interface Props {
  initialState: ArrayState;
  currentState: unknown[] | null;
  activeCells: CellRef[];
  action: string;
  isCrash: boolean;
}

export default function ArrayRenderer({ initialState, currentState, activeCells, action, isCrash }: Props) {
  const data = currentState ?? initialState.data;

  const isActive = (idx: number) =>
    activeCells.some((cell) => cell.index === idx);

  const getCellColor = (idx: number) => {
    if (!isActive(idx)) return 'bg-cell-default';
    if (isCrash) return 'bg-cell-crash';
    switch (action) {
      case 'write': return 'bg-cell-write';
      case 'compare': return 'bg-cell-compare';
      default: return 'bg-cell-read';
    }
  };

  const getCellGlow = (idx: number) => {
    if (!isActive(idx)) return '';
    if (isCrash) return 'cell-glow-crash';
    switch (action) {
      case 'write': return 'cell-glow-write';
      case 'compare': return 'cell-glow-compare';
      default: return 'cell-glow-read';
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex gap-1.5">
        {data.map((value, idx) => {
          const active = isActive(idx);

          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              {/* Index label */}
              <span className="text-[10px] text-gray-600 font-mono">{idx}</span>

              <motion.div
                className={`
                  w-14 h-14 flex items-center justify-center rounded-lg
                  font-mono text-lg font-semibold
                  border border-white/5
                  transition-colors duration-200
                  ${getCellColor(idx)} ${getCellGlow(idx)}
                `}
                animate={
                  active
                    ? isCrash
                      ? { x: [0, -4, 4, -3, 3, 0], transition: { duration: 0.4 } }
                      : { scale: [1, 1.15, 1], transition: { duration: 0.3 } }
                    : {}
                }
              >
                <span className={active ? 'text-white' : 'text-gray-400'}>
                  {String(value)}
                </span>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
