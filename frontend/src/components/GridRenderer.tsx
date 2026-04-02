import { motion } from 'framer-motion';
import type { GridState, CellRef } from '../types/trace';

interface Props {
  initialState: GridState;
  currentState: string[][] | null;
  activeCells: CellRef[];
  action: string;
  isCrash: boolean;
}

export default function GridRenderer({ initialState, currentState, activeCells, action, isCrash }: Props) {
  const data = currentState ?? initialState.data;
  const rows = initialState.rows;
  const cols = initialState.cols;

  const isActive = (r: number, c: number) =>
    activeCells.some((cell) => cell.row === r && cell.col === c);

  const getCellColor = (r: number, c: number) => {
    if (!isActive(r, c)) return 'bg-cell-default';
    if (isCrash) return 'bg-cell-crash';
    switch (action) {
      case 'write': return 'bg-cell-write';
      case 'compare': return 'bg-cell-compare';
      default: return 'bg-cell-read';
    }
  };

  const getCellGlow = (r: number, c: number) => {
    if (!isActive(r, c)) return '';
    if (isCrash) return 'cell-glow-crash';
    switch (action) {
      case 'write': return 'cell-glow-write';
      case 'compare': return 'cell-glow-compare';
      default: return 'cell-glow-read';
    }
  };

  return (
    <div className="flex justify-center">
      <div
        className="inline-grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            const active = isActive(r, c);
            const value = data?.[r]?.[c] ?? '?';

            return (
              <motion.div
                key={`${r}-${c}`}
                className={`
                  w-14 h-14 flex items-center justify-center rounded-lg
                  font-mono text-lg font-semibold
                  border border-white/5
                  transition-colors duration-200
                  ${getCellColor(r, c)} ${getCellGlow(r, c)}
                `}
                animate={
                  active
                    ? isCrash
                      ? { x: [0, -4, 4, -3, 3, 0], transition: { duration: 0.4 } }
                      : { scale: [1, 1.15, 1], transition: { duration: 0.3 } }
                    : {}
                }
                layout
              >
                <span className={active ? 'text-white' : 'text-gray-400'}>
                  {value}
                </span>

                {/* Row/Col label on first column / first row */}
                {c === 0 && (
                  <span className="absolute -left-7 text-[10px] text-gray-600 font-mono">
                    {r}
                  </span>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
