'use client';

import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Maximize2,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { editDistanceProblem } from '@/lib/problems/edit-distance';

interface TestCaseResult {
  index: number;
  passed: boolean;
  status: string;
  stdout?: string | null;
  compileOutput?: string | null;
  stderr?: string | null;
  input?: string;
  expected?: string;
  time?: string | null;
}

interface ExecutionResponse {
  mode: 'run' | 'submit';
  verdict: string;
  runtimeMs: string;
  results: TestCaseResult[];
  error?: string;
}

interface TestResultsPanelProps {
  results: ExecutionResponse | null;
  isRunning?: boolean;
}

export const TestResultsPanel: React.FC<TestResultsPanelProps> = ({ results, isRunning }) => {
  const [activeTab, setActiveTab] = useState<'testcases' | 'testresult'>('testresult');
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);

  const sampleCases = editDistanceProblem.testCases.filter((tc) => tc.isSample);
  const activeCaseResult = results?.results ? results.results[selectedCaseIdx] : null;

  return (
    <div className="flex h-full flex-col bg-background-dark text-body-dark select-none">
      {/* Top Header */}
      <div className="flex h-10 items-center justify-between border-b border-background-dark-shade2 bg-background-dark px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('testcases')}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer py-1 px-2 rounded ${
              activeTab === 'testcases'
                ? 'text-teal font-semibold bg-background-dark-shade2'
                : 'text-muted-dark hover:text-body-dark hover:bg-background-dark-shade1'
            }`}
          >
            <Code2 className="h-3.5 w-3.5 text-teal" />
            <span>TestCases</span>
          </button>

          <div className="h-3.5 w-px bg-background-dark-shade2" />

          <button
            type="button"
            onClick={() => setActiveTab('testresult')}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer py-1 px-2 rounded ${
              activeTab === 'testresult'
                ? 'text-teal font-semibold bg-background-dark-shade2'
                : 'text-muted-dark hover:text-body-dark hover:bg-background-dark-shade1'
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-teal" />
            <span>Test Result</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-secondary">
          <button
            type="button"
            className="p-1 rounded hover:text-body-dark hover:bg-background-dark-shade1 transition-colors cursor-pointer"
            title="Maximize Panel"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="p-1 rounded hover:text-body-dark hover:bg-background-dark-shade1 transition-colors cursor-pointer"
            title="Collapse"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-y-auto p-5 select-text">
        {isRunning ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-dark py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-xs font-medium">Executing code against test cases...</span>
          </div>
        ) : results ? (
          <div className="space-y-4">
            {/* Verdict Header */}
            <div className="flex items-center gap-4">
              <span
                className={`text-lg font-bold ${
                  results.verdict === 'Accepted' ? 'text-success' : 'text-destructive'
                }`}
              >
                {results.verdict}
              </span>
              <span className="text-xs text-muted-dark font-mono">
                Runtime: {results.runtimeMs} ms
              </span>
              {results.mode === 'submit' && (
                <span className="text-xs text-muted-dark">
                  ({results.results.filter((r) => r.passed).length} / {results.results.length} test cases passed)
                </span>
              )}
            </div>

            {/* Test Case Pills Row */}
            <div className="flex flex-wrap items-center gap-2 select-none">
              {(results.mode === 'run'
                ? results.results
                : results.results.slice(0, 10)
              ).map((caseResult, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCaseIdx(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                    selectedCaseIdx === idx
                      ? 'bg-background-dark-shade1 text-foreground-light border-background-dark-shade3 shadow-sm'
                      : 'bg-background-dark-shade2 text-muted-dark hover:text-body-dark border-transparent hover:border-background-dark-shade3'
                  }`}
                >
                  {caseResult.passed ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-success fill-success/20" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-destructive fill-destructive/20" />
                  )}
                  <span>Case {idx + 1}</span>
                </button>
              ))}

              {results.mode === 'submit' && results.results.length > 10 && (
                <span className="text-xs text-muted-dark px-2">
                  + {results.results.length - 10} hidden cases
                </span>
              )}
            </div>

            {/* Case Details / Output */}
            {activeCaseResult && (
              <div className="space-y-3 pt-1">
                {/* Errors (Compile error / stderr) */}
                {activeCaseResult.compileOutput && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-destructive">Compile Output</span>
                    <pre className="rounded-xl bg-background-dark-shade1 border border-destructive/30 p-3.5 font-mono text-xs text-destructive whitespace-pre-wrap overflow-x-auto">
                      {activeCaseResult.compileOutput}
                    </pre>
                  </div>
                )}

                {activeCaseResult.stderr && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-destructive">Error</span>
                    <pre className="rounded-xl bg-background-dark-shade1 border border-destructive/30 p-3.5 font-mono text-xs text-destructive whitespace-pre-wrap overflow-x-auto">
                      {activeCaseResult.stderr}
                    </pre>
                  </div>
                )}

                {/* Sample Case Details */}
                {activeCaseResult.input !== undefined && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-dark font-medium">Input</span>
                    <div className="rounded-xl bg-background-dark-shade1 border border-background-dark-shade2 p-3 font-mono text-xs text-foreground-light whitespace-pre-wrap">
                      {activeCaseResult.input}
                    </div>
                  </div>
                )}

                {/* Output Box */}
                <div className="space-y-1">
                  <span className="text-xs text-muted-dark font-medium">Output</span>
                  <div className="rounded-xl bg-background-dark-shade1 border border-background-dark-shade2 p-3.5 font-mono text-sm text-foreground-light min-h-[44px]">
                    {activeCaseResult.stdout ? activeCaseResult.stdout.trim() : '(empty)'}
                  </div>
                </div>

                {/* Expected Box (if available for sample cases) */}
                {activeCaseResult.expected !== undefined && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-dark font-medium">Expected</span>
                    <div className="rounded-xl bg-background-dark-shade1 border border-background-dark-shade2 p-3 font-mono text-xs text-foreground-light">
                      {activeCaseResult.expected}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Default / Initial state */
          <div className="space-y-4">
            <div className="flex items-center gap-2 select-none">
              {sampleCases.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCaseIdx(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                    selectedCaseIdx === idx
                      ? 'bg-background-dark-shade1 text-foreground-light border-background-dark-shade3'
                      : 'bg-background-dark-shade2 text-muted-dark hover:text-body-dark border-transparent'
                  }`}
                >
                  <span>Case {idx + 1}</span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-xs text-muted-dark font-medium">Input</span>
                <div className="rounded-xl bg-background-dark-shade1 border border-background-dark-shade2 p-3 font-mono text-xs text-foreground-light whitespace-pre-wrap">
                  {sampleCases[selectedCaseIdx]?.input || ''}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-dark font-medium">Expected Output</span>
                <div className="rounded-xl bg-background-dark-shade1 border border-background-dark-shade2 p-3 font-mono text-xs text-foreground-light">
                  {sampleCases[selectedCaseIdx]?.expectedOutput || ''}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
