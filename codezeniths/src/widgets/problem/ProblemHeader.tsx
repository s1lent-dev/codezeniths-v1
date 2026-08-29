'use client';

import React from 'react';
import {
  List,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Play,
  Upload,
  StickyNote,
  Sparkles,
  LayoutGrid,
  Settings,
  Flame,
  Clock,
  User,
  Loader2,
} from 'lucide-react';

interface ProblemHeaderProps {
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
}

export const ProblemHeader: React.FC<ProblemHeaderProps> = ({ onRun, onSubmit, isRunning }) => {
  return (
    <header className="h-12 border-b border-background-dark-shade2 bg-background-dark px-4 flex items-center justify-between select-none">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Brand Icon */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-azure flex items-center justify-center shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-white transform -rotate-12"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
        </div>

        <div className="h-4 w-px bg-background-dark-shade2" />

        {/* Problem List */}
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs font-medium text-body-dark hover:text-foreground-light transition-colors cursor-pointer py-1 px-2 rounded hover:bg-background-dark-shade1"
        >
          <List className="h-4 w-4 text-secondary" />
          <span>Problem List</span>
        </button>

        {/* Navigation / Shuffle */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-1 rounded text-secondary hover:text-body-dark hover:bg-background-dark-shade1 transition-colors cursor-pointer"
            title="Previous Problem"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="p-1 rounded text-secondary hover:text-body-dark hover:bg-background-dark-shade1 transition-colors cursor-pointer"
            title="Next Problem"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="p-1 rounded text-secondary hover:text-body-dark hover:bg-background-dark-shade1 transition-colors cursor-pointer ml-0.5"
            title="Random Problem"
          >
            <Shuffle className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Center Section: Run & Submit Actions */}
      <div className="flex items-center gap-2">
        {/* Run Button */}
        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background-dark-shade2 text-success hover:bg-background-dark-shade3 transition-all text-xs font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-background-dark-shade3/60 shadow-sm"
        >
          {isRunning ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Play className="h-3.5 w-3.5 fill-success text-success" />
          )}
          <span>Run</span>
        </button>

        {/* Submit Button */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-shade1 transition-all text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isRunning ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          <span>Submit</span>
        </button>

        {/* Center-Right Quick Tools */}
        <div className="flex items-center gap-1 ml-1">
          <button
            type="button"
            className="p-1.5 rounded-lg text-secondary hover:text-body-dark hover:bg-background-dark-shade1 transition-colors cursor-pointer"
            title="Notes"
          >
            <StickyNote className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded-lg text-primary hover:text-primary-shade1 hover:bg-background-dark-shade1 transition-colors cursor-pointer"
            title="AI Assistant"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Right Section: User & Global Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="p-1.5 rounded-lg text-secondary hover:text-body-dark hover:bg-background-dark-shade1 transition-colors cursor-pointer"
          title="App Grid"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>

        <button
          type="button"
          className="p-1.5 rounded-lg text-secondary hover:text-body-dark hover:bg-background-dark-shade1 transition-colors cursor-pointer"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>

        {/* Streak Flame */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-warning hover:bg-background-dark-shade1 cursor-pointer">
          <Flame className="h-4 w-4 fill-warning text-warning" />
          <span>7</span>
        </div>

        {/* Timer */}
        <button
          type="button"
          className="p-1.5 rounded-lg text-secondary hover:text-body-dark hover:bg-background-dark-shade1 transition-colors cursor-pointer"
          title="Session Timer"
        >
          <Clock className="h-4 w-4" />
        </button>

        {/* Avatar */}
        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary to-blue flex items-center justify-center text-white cursor-pointer ml-1 ring-1 ring-background-dark-shade2">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
};
