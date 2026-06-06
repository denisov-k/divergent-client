import { lazy, Suspense } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const RewardDialog = lazy(() => import("@/components/web/rewards/RewardDialog").then((m) => ({ default: m.RewardDialog })));

import { RewardCard } from "@/components/web/rewards/RewardCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRewardsScreen } from "@/shared/screens/rewards/useRewardsScreen";

function DialogFallback() {
  return null;
}

export default function RewardsScreen() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get("id");

  const {
    rewards,
    goals,
    rewardDialogOpen,
    editingReward,
    openCreateReward,
    openEditReward,
    saveReward,
    removeReward,
    closeRewardDialog,
  } = useRewardsScreen();

  const handleSaveReward = async (...args: Parameters<typeof saveReward>) => {
    const result = await saveReward(...args);
    toast.success(result.status === "updated" ? t("rewards.updated") : t("rewards.created"));
  };

  const handleDeleteReward = async (id: string) => {
    await removeReward(id);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col px-2">
      <div className="flex items-center justify-between py-2">
        <h2>{t("rewards.title")}</h2>
        <Button onClick={openCreateReward}>
          <Plus className="mr-2 size-4" />
          {t("rewards.add")}
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-2">
        {rewards.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="mb-4 text-muted-foreground">{t("rewards.empty_title")}</p>
              <Button onClick={openCreateReward}>
                <Plus className="mr-2 size-4" />
                {t("common.create_first_reward")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="columns-1 gap-2 sm:columns-2 lg:columns-3 xl:columns-4">
            {rewards.map((reward) => (
              <RewardCard
                {...reward}
                key={reward.id}
                onEdit={openEditReward}
                goalTitle={goals.find((goal) => goal.id === reward.goalId)?.title}
                focused={reward.id === focusId}
              />
            ))}
          </div>
        )}
      </div>

      <Suspense fallback={<DialogFallback />}>
        {rewardDialogOpen && (
          <RewardDialog
            open={rewardDialogOpen}
            onOpenChange={closeRewardDialog}
            onSave={handleSaveReward}
            onDelete={handleDeleteReward}
            reward={editingReward}
            goals={goals}
          />
        )}
      </Suspense>
    </div>
  );
}

