'use client';

import React, { useState, use } from 'react';
import { notFound } from 'next/navigation';
import { ProblemHeader } from '@/widgets/problem/ProblemHeader';
import { ProblemDescriptionPanel } from '@/widgets/problem/ProblemDescriptionPanel';
import { CodeEditorPanel } from '@/widgets/problem/CodeEditorPanel';
import { TestResultsPanel } from '@/widgets/problem/TestResultsPanel';
import { editDistanceProblem } from '@/lib/problems/edit-distance';

interface ProblemPageProps {
  params: Promise<{ problem: string }> | { problem: string };
}

export default function ProblemPage({ params }: ProblemPageProps) {
  // Feature is in testing phase: strictly return 404 in production
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  // TODO: DB lookup using unwrappedParams.problem next
  const unwrappedParams = typeof (params as any)?.then === 'function' ? use(params as Promise<{ problem: string }>) : (params as { problem: string });
  void unwrappedParams;

  const [language, setLanguage] = useState<'cpp' | 'typescript'>('cpp');
  const [code, setCode] = useState(editDistanceProblem.boilerplate.cpp);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleLanguageChange = (newLang: 'cpp' | 'typescript') => {
    setLanguage(newLang);
    setCode(editDistanceProblem.boilerplate[newLang]);
    setResults(null);
  };

  const executeCode = async (mode: 'run' | 'submit') => {
    setIsRunning(true);
    setResults(null);
    try {
      const res = await fetch('/api/problemset/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code, mode }),
      });
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error('Execution error:', e);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background-dark text-body-dark font-sans overflow-hidden">
      <ProblemHeader
        onRun={() => executeCode('run')}
        onSubmit={() => executeCode('submit')}
        isRunning={isRunning}
      />
      <div className="flex flex-1 overflow-hidden p-2 gap-2">
        {/* Left Pane (40%) */}
        <div className="w-[40%] overflow-hidden rounded-xl border border-background-dark-shade2 bg-background-dark shadow-sm">
          <ProblemDescriptionPanel />
        </div>

        {/* Right Pane (60%) */}
        <div className="flex w-[60%] flex-col gap-2 overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 overflow-hidden rounded-xl border border-background-dark-shade2 bg-background-dark shadow-sm">
            <CodeEditorPanel
              code={code}
              language={language}
              setCode={setCode}
              setLanguage={handleLanguageChange}
            />
          </div>

          {/* Test Results Panel */}
          <div className="h-[270px] min-h-[220px] overflow-hidden rounded-xl border border-background-dark-shade2 bg-background-dark shadow-sm">
            <TestResultsPanel results={results} isRunning={isRunning} />
          </div>
        </div>
      </div>
    </div>
  );
}
