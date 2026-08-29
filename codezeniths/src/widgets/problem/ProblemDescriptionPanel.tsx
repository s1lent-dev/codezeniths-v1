'use client';

import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  FlaskConical,
  History,
  CheckCircle2,
  Tag,
  Building2,
  StickyNote,
} from 'lucide-react';
import { editDistanceProblem } from '@/lib/problems/edit-distance';

export const ProblemDescriptionPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'description' | 'notes' | 'editorial' | 'solutions' | 'submissions'>('description');
  const problem = editDistanceProblem;

  return (
    <div className="flex h-full flex-col bg-background-dark text-body-dark select-text">
      {/* Top Tab Bar */}
      <div className="flex items-center border-b border-background-dark-shade2 bg-background-dark px-3 py-1.5 gap-1 overflow-x-auto select-none">
        <button
          type="button"
          onClick={() => setActiveTab('description')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'description'
              ? 'bg-background-dark-shade2 text-primary font-semibold'
              : 'text-muted-dark hover:text-body-dark hover:bg-background-dark-shade1'
          }`}
        >
          <FileText className={`h-3.5 w-3.5 ${activeTab === 'description' ? 'text-primary' : 'text-muted-dark'}`} />
          <span>Description</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-background-dark-shade2 text-primary font-semibold'
              : 'text-muted-dark hover:text-body-dark hover:bg-background-dark-shade1'
          }`}
        >
          <StickyNote className="h-3.5 w-3.5 text-muted-dark" />
          <span>Notes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('editorial')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'editorial'
              ? 'bg-background-dark-shade2 text-primary font-semibold'
              : 'text-muted-dark hover:text-body-dark hover:bg-background-dark-shade1'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5 text-muted-dark" />
          <span>Editorial</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('solutions')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'solutions'
              ? 'bg-background-dark-shade2 text-primary font-semibold'
              : 'text-muted-dark hover:text-body-dark hover:bg-background-dark-shade1'
          }`}
        >
          <FlaskConical className="h-3.5 w-3.5 text-muted-dark" />
          <span>Solutions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('submissions')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-background-dark-shade2 text-primary font-semibold'
              : 'text-muted-dark hover:text-body-dark hover:bg-background-dark-shade1'
          }`}
        >
          <History className="h-3.5 w-3.5 text-muted-dark" />
          <span>Submissions</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Title and Status */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground-light tracking-tight">
            {problem.number}. {problem.title}
          </h1>
          <div className="flex items-center gap-1.5 text-success text-xs font-medium bg-success/10 px-2.5 py-1 rounded-full border border-success/20">
            <span>{problem.status}</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-2 select-none">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
            {problem.difficulty}
          </span>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-background-dark-shade2 text-muted-dark hover:text-body-dark hover:bg-background-dark-shade3 transition-colors cursor-pointer border border-background-dark-shade3"
          >
            <Tag className="h-3 w-3 text-secondary" />
            <span>Topics</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-background-dark-shade2 text-muted-dark hover:text-body-dark hover:bg-background-dark-shade3 transition-colors cursor-pointer border border-background-dark-shade3"
          >
            <Building2 className="h-3 w-3 text-secondary" />
            <span>Companies</span>
          </button>
        </div>

        {/* Problem Description */}
        <div className="space-y-4 text-sm text-body-dark leading-relaxed">
          <p>
            Given two strings <code className="px-1.5 py-0.5 rounded bg-background-dark-shade2 text-foreground-light font-mono text-xs">word1</code> and <code className="px-1.5 py-0.5 rounded bg-background-dark-shade2 text-foreground-light font-mono text-xs">word2</code>, return <em>the minimum number of operations required to convert <code className="px-1.5 py-0.5 rounded bg-background-dark-shade2 text-foreground-light font-mono text-xs">word1</code> to <code className="px-1.5 py-0.5 rounded bg-background-dark-shade2 text-foreground-light font-mono text-xs">word2</code></em>.
          </p>
          <p>You have the following three operations permitted on a word:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-body-dark">
            <li>Insert a character</li>
            <li>Delete a character</li>
            <li>Replace a character</li>
          </ul>
        </div>

        {/* Examples */}
        <div className="space-y-6">
          {problem.examples.map((example, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground-light">Example {idx + 1}:</h3>
              <div className="rounded-xl bg-background-dark-shade1 p-4 font-mono text-xs space-y-2 border border-background-dark-shade2">
                <div>
                  <span className="text-muted-dark font-semibold">Input: </span>
                  <span className="text-foreground-light">{example.input}</span>
                </div>
                <div>
                  <span className="text-muted-dark font-semibold">Output: </span>
                  <span className="text-foreground-light">{example.output}</span>
                </div>
                {example.explanation && (
                  <div>
                    <span className="text-muted-dark font-semibold">Explanation:</span>
                    <pre className="mt-1 font-mono text-xs text-body-dark whitespace-pre-wrap leading-relaxed">
                      {example.explanation}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Constraints */}
        <div className="space-y-2 pt-2 border-t border-background-dark-shade2">
          <h3 className="text-sm font-semibold text-foreground-light">Constraints:</h3>
          <ul className="list-disc list-inside space-y-1.5 pl-2 font-mono text-xs text-body-dark">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx}>
                <span className="font-mono text-body-dark">{constraint}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
