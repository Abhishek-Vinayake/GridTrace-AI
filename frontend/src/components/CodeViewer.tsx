import { useEffect, useRef } from 'react';

interface Props {
  code: string;
  currentLine: number | null;
}

export default function CodeViewer({ code, currentLine }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lines = code.split('\n');

  // Auto-scroll to the highlighted line
  useEffect(() => {
    if (currentLine && containerRef.current) {
      const lineEl = containerRef.current.querySelector(`[data-line="${currentLine}"]`);
      lineEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentLine]);

  return (
    <div className="glass-card overflow-hidden flex-1 min-h-0">
      <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Source Code</span>
      </div>
      <div ref={containerRef} className="overflow-auto max-h-64 p-2">
        <pre className="text-xs leading-6 font-mono">
          {lines.map((line, i) => {
            // Extract line number from the padded format "  3  code"
            const match = line.match(/^\s*(\d+)\s\s(.*)$/);
            const lineNum = match ? parseInt(match[1]) : i + 1;
            const lineCode = match ? match[2] : line;
            const isHighlighted = currentLine === lineNum;

            return (
              <div
                key={i}
                data-line={lineNum}
                className={`px-2 rounded-sm flex gap-3 ${isHighlighted ? 'line-highlight' : ''}`}
              >
                <span className="text-gray-600 select-none w-8 text-right shrink-0">
                  {lineNum}
                </span>
                <span className={isHighlighted ? 'text-gray-100' : 'text-gray-500'}>
                  {lineCode}
                </span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
