import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { RewardCard } from "@/components/RewardCard";
import { RewardDialog } from "@/components/RewardDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRewardsScreen } from "@/shared/screens/rewards/useRewardsScreen";

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
    toast.success(result.status === "updated" ? "Награда обновлена" : "Награда создана");
  };

  const handleDeleteReward = async (id: string) => {
    await removeReward(id);
  };

  return (
    <div className="flex flex-1 flex-col px-2">
      <div className="flex items-center justify-between py-2">
        <h2>{t("rewards.title")}</h2>
        <Button onClick={openCreateReward}>
          <Plus className="mr-2 size-4" />
          {t("rewards.add")}
        </Button>
      </div>

      {rewards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-muted-foreground">У вас пока нет наград</p>
            <Button onClick={openCreateReward}>
              <Plus className="mr-2 size-4" />
              Создать первую награду
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

      <RewardDialog
        open={rewardDialogOpen}
        onOpenChange={closeRewardDialog}
        onSave={handleSaveReward}
        onDelete={handleDeleteReward}
        reward={editingReward}
        goals={goals}
      />
    </div>
  );
}
