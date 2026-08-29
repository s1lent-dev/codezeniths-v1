'use client';

import React, { useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import {
  Code2,
  Maximize2,
  ChevronUp,
  ChevronDown,
  Lock,
  Menu,
  Bookmark,
  RotateCcw,
  Maximize,
  Check,
} from 'lucide-react';
import { tokyoNightSwarmTheme } from '@/lib/monaco/tokyo-night-swarm-theme';
import { editDistanceProblem } from '@/lib/problems/edit-distance';

interface CodeEditorPanelProps {
  code: string;
  language: 'cpp' | 'typescript';
  setCode: (code: string) => void;
  setLanguage: (lang: 'cpp' | 'typescript') => void;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  code,
  language,
  setCode,
  setLanguage,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    monaco.editor.defineTheme('tokyo-night-swarm', tokyoNightSwarmTheme);
    monaco.editor.setTheme('tokyo-night-swarm');
  };

  const resetBoilerplate = () => {
    setCode(editDistanceProblem.boilerplate[language]);
  };

  return (
    <div className="flex h-full flex-col bg-background-dark text-body-dark select-none">
      {/* Top Editor Header */}
      <div className="flex h-10 items-center justify-between border-b border-background-dark-shade2 bg-background-dark px-4">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-teal" />
          <span className="text-xs font-semibold text-foreground-light tracking-wide">Code</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1 rounded text-secondary hover:text-body-dark hover:bg-background-dark-shade1 transition-colors cursor-pointer"
            title="Maximize Editor"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="p-1 rounded text-secondary hover:text-body-dark hover:bg-background-dark-shade1 transition-colors cursor-pointer"
            title="Collapse"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Language & Tools Row */}
      <div className="flex h-9 items-center justify-between border-b border-background-dark-shade2 bg-background-dark px-4 relative z-10">
        {/* Left: Language selector & Auto lock */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-body-dark hover:text-foreground-light hover:bg-background-dark-shade1 transition-colors cursor-pointer"
            >
              <span>{language === 'cpp' ? 'C++' : 'TypeScript'}</span>
              <ChevronDown className="h-3 w-3 text-secondary" />
            </button>

            {/* Language Dropdown Menu */}
            {isLangOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsLangOpen(false)}
                />
                <div className="absolute top-full left-0 mt-1 w-36 rounded-lg bg-background-dark-shade2 border border-background-dark-shade3 shadow-xl z-30 py-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('cpp');
                      setIsLangOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-left text-body-dark hover:text-foreground-light hover:bg-background-dark-shade1 cursor-pointer transition-colors"
                  >
                    <span>C++</span>
                    {language === 'cpp' && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('typescript');
                      setIsLangOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-left text-body-dark hover:text-foreground-light hover:bg-background-dark-shade1 cursor-pointer transition-colors"
                  >
                    <span>TypeScript</span>
                    {language === 'typescript' && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-secondary">
            <Lock className="h-3 w-3" />
            <span>Auto</span>
          </div>
        </div>

        {/* Right: Code actions */}
        <div className="flex items-center gap-2 text-secondary">
          <button
            type="button"
            className="p-1 rounded hover:text-body-dark hover:bg-background-dark-shade1 transition-colors cursor-pointer"
            title="Format Code"
          >
            <Menu className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="p-1 rounded hover:text-body-dark hover:bg-background-dark-shade1 transition-colors cursor-pointer"
            title="Bookmark Snippet"
          >
            <Bookmark className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="p-1 rounded hover:text-body-dark hover:bg-background-dark-shade1 transition-colors cursor-pointer"
            title="Code Templates"
          >
            <Code2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={resetBoilerplate}
            className="p-1 rounded hover:text-body-dark hover:bg-background-dark-shade1 transition-colors cursor-pointer"
            title="Reset to default code definition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="p-1 rounded hover:text-body-dark hover:bg-background-dark-shade1 transition-colors cursor-pointer"
            title="Fullscreen"
          >
            <Maximize className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full overflow-hidden bg-background-dark">
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : 'typescript'}
          theme="tokyo-night-swarm"
          value={code}
          onChange={(val) => setCode(val || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: "var(--font-mono), 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            automaticLayout: true,
            tabSize: 4,
            cursorBlinking: 'smooth',
            padding: { top: 12, bottom: 12 },
            lineDecorationsWidth: 6,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
};
