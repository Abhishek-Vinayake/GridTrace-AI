import { useState, useCallback, useEffect, useRef } from 'react';
import type { TraceResponse, TraceStep, GridState, ArrayState } from '../types/trace';
import GridRenderer from './GridRenderer';
import ArrayRenderer from './ArrayRenderer';
import CodeViewer from './CodeViewer';
import VariablePanel from './VariablePanel';
import CallStackPanel from './CallStackPanel';
import StepControls from './StepControls';
import CrashOverlay from './CrashOverlay';

interface Props {
  trace: TraceResponse;
}

export default function TracePlayer({ trace }: Props) {
  const [currentStep, setCurrentStep] = useState(-1); // -1 = initial state
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step: TraceStep | null = currentStep >= 0 ? trace.steps[currentStep] ?? null : null;
  const totalSteps = trace.steps.length;
  const isAtStart = currentStep < 0;
  const isAtEnd = currentStep >= totalSteps - 1;
  const isCrash = step?.status === 'crash';

  // Auto-play
  useEffect(() => {
    if (playing && !isAtEnd) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next >= totalSteps - 1) setPlaying(false);
          return Math.min(next, totalSteps - 1);
        });
      }, 800);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, isAtEnd, totalSteps]);

  const goNext = useCallback(() => {
    if (!isAtEnd) setCurrentStep((s) => s + 1);
  }, [isAtEnd]);

  const goPrev = useCallback(() => {
    setCurrentStep((s) => Math.max(-1, s - 1));
  }, []);

  const goStart = useCallback(() => {
    setCurrentStep(-1);
    setPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isAtEnd) {
      setCurrentStep(-1);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  }, [isAtEnd]);

  // Get current data structure state
  const getCurrentState = () => {
    if (!step) return null;
    return step.dataStructureState;
  };

  // Get initial data for renderers
  const initialState = trace.initialState;
  const isGrid = trace.problemType === 'grid';

  return (
    <div className="relative">
      {/* Layout: Grid/Array + Code side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-4">
        {/* Data Structure Visualization */}
        <div className="xl:col-span-3 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              {isGrid ? '2D Grid' : '1D Array'}
            </h2>
            <span className="text-xs text-gray-600 font-mono">
              Step {currentStep + 1} / {totalSteps}
            </span>
          </div>

          {isGrid ? (
            <GridRenderer
              initialState={initialState as GridState}
              currentState={getCurrentState() as string[][] | null}
              activeCells={step?.cells ?? []}
              action={step?.action ?? 'read'}
              isCrash={isCrash}
            />
          ) : (
            <ArrayRenderer
              initialState={initialState as ArrayState}
              currentState={getCurrentState() as unknown[] | null}
              activeCells={step?.cells ?? []}
              action={step?.action ?? 'read'}
              isCrash={isCrash}
            />
          )}

          {/* Explanation */}
          {step && (
            <div className="mt-4 p-3 rounded-lg bg-surface border border-white/5 text-sm text-gray-300">
              <span className="text-brand-400 font-medium">💡 </span>
              {step.explanation}
            </div>
          )}
        </div>

        {/* Code + Info Panels */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <CodeViewer code={trace.steps[0]?.lineOfCode ? getCppCode(trace) : ''} currentLine={step?.lineNumber ?? null} />
          <VariablePanel variables={step?.variables ?? {}} />
          <CallStackPanel stack={step?.callStack ?? []} />
        </div>
      </div>

      {/* Step Controls */}
      <StepControls
        onPrev={goPrev}
        onNext={goNext}
        onReset={goStart}
        onTogglePlay={togglePlay}
        playing={playing}
        isAtStart={isAtStart}
        isAtEnd={isAtEnd}
        currentStep={currentStep + 1}
        totalSteps={totalSteps}
      />

      {/* Crash Overlay */}
      {isCrash && step?.crashInfo && (
        <CrashOverlay crashInfo={step.crashInfo} lineOfCode={step.lineOfCode} />
      )}
    </div>
  );
}

/** Reconstruct source code from the trace's first step context (or use the original code field). */
function getCppCode(trace: TraceResponse): string {
  // Build source from steps' lineOfCode + lineNumber to show context
  // In a full implementation, the original code would be returned from the API.
  // For now, we assemble unique lines.
  const lines = new Map<number, string>();
  for (const s of trace.steps) {
    if (!lines.has(s.lineNumber)) {
      lines.set(s.lineNumber, s.lineOfCode);
    }
  }
  const sorted = [...lines.entries()].sort((a, b) => a[0] - b[0]);
  return sorted.map(([num, code]) => `${String(num).padStart(3)}  ${code}`).join('\n');
}
