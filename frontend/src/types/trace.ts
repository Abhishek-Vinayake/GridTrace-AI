/**
 * TypeScript interfaces matching the JSON trace contract from the PRD.
 */

export interface CellRef {
  row?: number;
  col?: number;
  index?: number;
}

export interface CrashInfo {
  type: string;
  message: string;
}

export interface TraceStep {
  stepNumber: number;
  lineOfCode: string;
  lineNumber: number;
  action: 'read' | 'write' | 'compare' | 'call' | 'return';
  cells: CellRef[];
  cellValues: {
    before: unknown[];
    after: unknown[];
  };
  dataStructureState: string[][] | unknown[];
  variables: Record<string, unknown>;
  explanation: string;
  callStack: string[];
  status: 'normal' | 'crash';
  crashInfo?: CrashInfo;
}

export interface GridState {
  rows: number;
  cols: number;
  data: string[][];
}

export interface ArrayState {
  length: number;
  data: unknown[];
}

export type InitialState = GridState | ArrayState;

export interface TraceResponse {
  id: string;
  title: string | null;
  problemType: 'grid' | 'array';
  initialState: InitialState;
  steps: TraceStep[];
  hasCrash: boolean;
  createdAt: string;
}

export interface TraceListItem {
  id: string;
  title: string | null;
  problemType: 'grid' | 'array';
  hasCrash: boolean;
  createdAt: string;
}

export interface TraceCreateRequest {
  code: string;
  problemType: 'grid' | 'array';
  title?: string;
}
