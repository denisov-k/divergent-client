import { ChevronRight } from "lucide-react";
import { CheckCircle2, Target } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { RewardIcon } from "@/components/shared/RewardIcon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { OnboardingStepKey } from "@/types";
import type { Reward } from "@/types";

import type { OnboardingChecklistState } from "@/shared/screens/onboarding/model";

type VisibleOnboardingStepKey = Exclude<OnboardingStepKey, "added_first_task">;
const STEP_XP = 100;

const STEP_META: Record<
  VisibleOnboardingStepKey,
  {
    titleKey: string;
    descriptionKey: string;
  }
> = {
  created_first_goal: {
    titleKey: "onboarding.steps.create_goal_title",
    descriptionKey: "onboarding.steps.create_goal_description",
  },
  used_ai: {
    titleKey: "onboarding.steps.use_ai_title",
    descriptionKey: "onboarding.steps.use_ai_description",
  },
  completed_first_task: {
    titleKey: "onboarding.steps.complete_task_title",
    descriptionKey: "onboarding.steps.complete_task_description",
  },
};

export function OnboardingCard({
  state,
  reward,
}: {
  state: OnboardingChecklistState;
  reward: Reward | null;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (state.isComplete) {
    return null;
  }

  return (
    <Card className="mx-auto w-full max-w-2xl bg-background">
      <CardContent className="flex flex-col gap-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-emerald-600" />
              <h3 className="text-base font-semibold">{t("onboarding.title")}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{t("onboarding.subtitle")}</p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {t("onboarding.progress", { completed: state.completedCount, total: state.totalCount })}
          </Badge>
        </div>

        <div className="grid gap-2">
          {state.steps.map((step) => {
            const meta = STEP_META[step.key as VisibleOnboardingStepKey];

            return (
              <div
                key={step.key}
                className="flex items-start gap-3 rounded-lg border border-border bg-background/80 p-3"
              >
                <div className="mt-0.5 shrink-0">
                  {step.completed ? (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  ) : (
                    <div className="size-4 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>
                <div className="min-w-0 flex-1 w-full">
                  <div className="flex w-full items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{t(meta.titleKey)}</div>
                    </div>
                    <Badge variant="secondary" className="ml-auto shrink-0 whitespace-nowrap bg-emerald-100 text-emerald-700">
                      +{STEP_XP} {t("common.xp")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{t(meta.descriptionKey)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {reward && (
          <button
            type="button"
            onClick={() => navigate({ pathname: "/rewards", search: `?id=${reward.id}` })}
            className="flex w-full items-center gap-3 rounded-xl border border-border bg-background px-3 py-2 text-left transition hover:bg-muted/50"
          >
            <RewardIcon
              icon={reward.icon}
              size={4}
              className="rounded-md bg-muted/60"
              colorClass={reward.isUnlocked ? "text-foreground" : "text-muted-foreground"}
            />
            <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold text-foreground">{reward.title}</span>
              <Badge variant={reward.isUnlocked ? "default" : "secondary"} className={reward.isUnlocked ? "bg-green-500" : ""}>
                {reward.isUnlocked ? t("rewards.unlocked") : t("rewards.locked")}
              </Badge>
            </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">{reward.description}</p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-emerald-600" />
          </button>
        )}

      </CardContent>
    </Card>
  );
}
