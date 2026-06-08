import { useEffect, useMemo, useState } from "react";

import { getChatHistory } from "@/shared/api/client";
import { useAppStore } from "@/stores/useAppStore";
import type { Goal } from "@/types";

import { buildOnboardingChecklist, type OnboardingChecklistState } from "./model";

export type UseOnboardingChecklistResult = OnboardingChecklistState & {
  historyLoading: boolean;
  ready: boolean;
};

export function useOnboardingChecklist(goals: Goal[]): UseOnboardingChecklistResult {
  const { user } = useAppStore();
  const [hasAiHistory, setHasAiHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const persistedState = user?.onboardingState ?? null;
  const needsHistoryFallback = !persistedState?.used_ai;
  const [historyChecked, setHistoryChecked] = useState(() => !needsHistoryFallback);

  useEffect(() => {
    if (!needsHistoryFallback) {
      setHasAiHistory(false);
      setHistoryLoading(false);
      setHistoryChecked(true);
      return;
    }

    setHistoryChecked(false);
    let cancelled = false;

    const loadHistory = async () => {
      setHistoryLoading(true);
      try {
        const history = await getChatHistory();
        if (!cancelled) {
          setHasAiHistory((history ?? []).length > 0);
          setHistoryChecked(true);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setHasAiHistory(false);
          setHistoryChecked(true);
        }
      } finally {
        if (!cancelled) {
          setHistoryLoading(false);
        }
      }
    };

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [needsHistoryFallback]);

  return useMemo(
    () => ({
      ...buildOnboardingChecklist(goals, persistedState, hasAiHistory),
      historyLoading,
      ready: historyChecked,
    }),
    [goals, persistedState, hasAiHistory, historyLoading, historyChecked],
  );
}
