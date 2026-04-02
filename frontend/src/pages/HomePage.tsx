import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { FiPlay, FiGrid, FiList, FiAlertTriangle } from 'react-icons/fi';
import { createTrace } from '../api/traceApi';
import type { TraceCreateRequest } from '../types/trace';

const DEFAULT_CODE = `#include <vector>
#include <iostream>
using namespace std;

void dfs(vector<vector<char>>& board, int i, int j) {
    int m = board.size(), n = board[0].size();
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] != 'O')
        return;
    board[i][j] = '#';
    dfs(board, i + 1, j);
    dfs(board, i - 1, j);
    dfs(board, i, j + 1);
    dfs(board, i, j - 1);
}

void solve(vector<vector<char>>& board) {
    if (board.empty()) return;
    int m = board.size(), n = board[0].size();
    for (int i = 0; i < m; i++) {
        if (board[i][0] == 'O') dfs(board, i, 0);
        if (board[i][n-1] == 'O') dfs(board, i, n-1);
    }
    for (int j = 0; j < n; j++) {
        if (board[0][j] == 'O') dfs(board, 0, j);
        if (board[m-1][j] == 'O') dfs(board, m-1, j);
    }
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++) {
            if (board[i][j] == 'O') board[i][j] = 'X';
            if (board[i][j] == '#') board[i][j] = 'O';
        }
}`;

export default function HomePage() {
  const navigate = useNavigate();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [problemType, setProblemType] = useState<'grid' | 'array'>('grid');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrace = async () => {
    if (!code.trim()) return;
    if (!code.includes('using namespace std;')) {
      setError('Code must contain "using namespace std;"');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const req: TraceCreateRequest = {
        code,
        problemType,
        title: title || undefined,
      };
      const res = await createTrace(req);
      navigate(`/trace/${res.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-emerald-400 bg-clip-text text-transparent">
            Visualize Your C++ Code
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Paste your Array or Grid C++ code and watch it execute step-by-step.
          Powered by Gemini 2.5 Pro as a Virtual CPU.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Code Editor Panel */}
        <motion.div
          className="lg:col-span-2 glass-card p-1 overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-xs text-gray-500 font-mono ml-2">solution.cpp</span>
          </div>
          <Editor
            height="450px"
            language="cpp"
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v || '')}
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              minimap: { enabled: false },
              padding: { top: 16 },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              bracketPairColorization: { enabled: true },
            }}
          />
        </motion.div>

        {/* Controls Panel */}
        <motion.div
          className="glass-card p-6 flex flex-col gap-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Surrounded Regions"
              className="w-full rounded-lg bg-surface border border-white/10 px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Problem Type</label>
            <div className="grid grid-cols-2 gap-2">
              <TypeButton
                active={problemType === 'grid'}
                onClick={() => setProblemType('grid')}
                icon={<FiGrid />}
                label="2D Grid"
              />
              <TypeButton
                active={problemType === 'array'}
                onClick={() => setProblemType('array')}
                icon={<FiList />}
                label="1D Array"
              />
            </div>
          </div>

          <div className="flex-1" />

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
            >
              <FiAlertTriangle className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <motion.button
            onClick={handleTrace}
            disabled={loading || !code.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40
              transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Generating Trace…
              </>
            ) : (
              <>
                <FiPlay className="text-lg" />
                Trace Execution
              </>
            )}
          </motion.button>

          <p className="text-xs text-gray-600 text-center">
            Gemini simulates execution — it does not compile your code.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function TypeButton({ active, onClick, icon, label }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
        ${active
          ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30 shadow-inner'
          : 'bg-surface text-gray-500 border border-white/5 hover:border-white/10 hover:text-gray-300'
        }`}
    >
      {icon} {label}
    </button>
  );
}
