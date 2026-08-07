export interface DifficultyData {
    solved: number;
    total: number;
}

export interface ProblemProgressProps {
    /** Easy difficulty solved and total */
    easy: DifficultyData;

    /** Medium difficulty solved and total */
    medium: DifficultyData;

    /** Hard difficulty solved and total */
    hard: DifficultyData;

    /** Overall total problems count */
    totalProblems: number;

    /** Total solved count */
    solved: number;

    /** Total unsolved count */
    unsolved: number;

    /** Overall completion percentage (e.g. 68.06) */
    completionPercentage: number;

    /** Number of problems flagged for revisit (e.g. 3) */
    revisitCount: number;

    /** Optional container class name */
    className?: string;

    /** Toggle state on hover (default: true) */
    interactive?: boolean;

    /** Initial mode when not hovered (default: 'difficulty') */
    defaultMode?: 'difficulty' | 'status';
}
