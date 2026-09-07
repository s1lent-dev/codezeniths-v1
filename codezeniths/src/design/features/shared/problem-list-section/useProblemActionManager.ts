'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { problemQueryService } from '@/lib/tanstack/services/problem.query-service';
import { toast } from '@codezeniths/modules';

export function useProblemActionManager() {
    const updateMutation = problemQueryService.updateProblem();
    const [busyProblemIds, setBusyProblemIds] = useState<Set<string>>(new Set());
    const busyRef = useRef<Set<string>>(new Set());

    // Sync ref with state for synchronous event handler checks
    const isProblemBusy = useCallback((problemId: string) => {
        return busyRef.current.has(problemId);
    }, []);

    const markBusy = useCallback((problemId: string) => {
        busyRef.current.add(problemId);
        setBusyProblemIds(new Set(busyRef.current));
    }, []);

    const unmarkBusy = useCallback((problemId: string) => {
        busyRef.current.delete(problemId);
        setBusyProblemIds(new Set(busyRef.current));
    }, []);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            busyRef.current.clear();
        };
    }, []);

    const toggleSolved = useCallback(async (problemId: string, currentSolved: boolean) => {
        // 1. Throttling guard: block if mutation is already in-flight for this problem
        if (busyRef.current.has(problemId)) return;
        markBusy(problemId);

        const nextStatus: 'solved' | 'not_solved' = currentSolved ? 'not_solved' : 'solved';

        // 2. Dispatch Mutation (optimistic update is handled atomically in mutation's onMutate)
        try {
            await updateMutation.mutateAsync({
                problemId,
                status: nextStatus,
            });
        } catch (error: any) {
            toast.error('Failed to update problem status', error?.message || 'Could not update status.');
        } finally {
            unmarkBusy(problemId);
        }
    }, [updateMutation, markBusy, unmarkBusy]);

    const toggleFavourite = useCallback(async (problemId: string, currentFavourite: boolean) => {
        // 1. Throttling guard: block if mutation is already in-flight for this problem
        if (busyRef.current.has(problemId)) return;
        markBusy(problemId);

        const nextFavourite = !currentFavourite;

        // 2. Dispatch Mutation (optimistic update is handled atomically in mutation's onMutate)
        try {
            await updateMutation.mutateAsync({
                problemId,
                favourite: nextFavourite,
            });
        } catch (error: any) {
            toast.error('Failed to update favourite', error?.message || 'Could not update favourite.');
        } finally {
            unmarkBusy(problemId);
        }
    }, [updateMutation, markBusy, unmarkBusy]);

    const toggleRevisit = useCallback(async (problemId: string, currentRevisit: boolean) => {
        // 1. Throttling guard: block if mutation is already in-flight for this problem
        if (busyRef.current.has(problemId)) return;
        markBusy(problemId);

        const nextRevisit = !currentRevisit;

        // 2. Dispatch Mutation (optimistic update is handled atomically in mutation's onMutate)
        try {
            await updateMutation.mutateAsync({
                problemId,
                revisit: nextRevisit,
            });
        } catch (error: any) {
            toast.error('Failed to update revisit status', error?.message || 'Could not update revisit.');
        } finally {
            unmarkBusy(problemId);
        }
    }, [updateMutation, markBusy, unmarkBusy]);

    return {
        toggleSolved,
        toggleFavourite,
        toggleRevisit,
        isProblemBusy,
        busyProblemIds,
    };
}

