import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RewardCard } from "@/components/RewardCard";
import { RewardDialog, type Reward } from "@/components/RewardDialog";

import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { useAppStore } from "@/stores/useAppStore";

export default function Rewards() {
  const { rewards, user, addReward, updateReward, claimReward } = useAppStore();
  const currentXp = user.xp;

  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | undefined>(undefined);

  // ------------------------------
  // Сохранение награды
  // ------------------------------
  const handleSaveReward = (reward: Reward) => {
    if (editingReward) {
      updateReward(reward);
      toast.success("Награда обновлена");
    } else {
      addReward(reward);
      toast.success("Награда создана");
    }
    setEditingReward(undefined);
  };

  // ------------------------------
  // Редактирование награды
  // ------------------------------
  const handleEditReward = (id: string) => {
    const reward = rewards.find((r) => r.id === id);
    if (reward) {
      setEditingReward(reward);
      setRewardDialogOpen(true);
    }
  };

  // ------------------------------
  // Получение награды
  // ------------------------------
  const handleClaimReward = (id: string) => {
    claimReward(id);
    toast.success("🎉 Награда получена!");
  };

  return (
    <div className="flex flex-col px-2 flex-1">
      <div className="flex items-center justify-between py-2">
        <h2>Награды и достижения</h2>
        <Button
          onClick={() => {
            setEditingReward(undefined);
            setRewardDialogOpen(true);
          }}
        >
          <Plus className="size-4 mr-2" />
          Создать награду
        </Button>
      </div>

      {rewards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">У вас пока нет наград</p>
            <Button onClick={() => setRewardDialogOpen(true)}>
              <Plus className="size-4 mr-2" />
              Создать первую награду
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-auto">
          {rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              {...reward}
              currentXp={currentXp}
              onClaim={() => handleClaimReward(reward.id)}
              onEdit={handleEditReward}
            />
          ))}
        </div>
      )}

      <RewardDialog
        open={rewardDialogOpen}
        onOpenChange={(open) => {
          setRewardDialogOpen(open);
          if (!open) setEditingReward(undefined);
        }}
        onSave={handleSaveReward}
        reward={editingReward}
      />
    </div>
  );
}
