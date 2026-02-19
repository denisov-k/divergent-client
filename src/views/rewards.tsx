import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RewardCard } from "@/components/RewardCard";
import { RewardDialog } from "@/components/RewardDialog";

import { Plus } from "lucide-react";
import { toast } from "sonner";
import {useState} from "react";

import {Reward} from "@/types"

import { useAppStore } from "@/stores/useAppStore";
import {useTranslation} from "react-i18next";
import {useSearchParams} from "react-router-dom";

export default function Rewards() {
  const { t } = useTranslation();
  const { rewards, addReward, updateReward, goals, deleteReward } = useAppStore();

  const [searchParams] = useSearchParams();
  const focusId = searchParams.get("id");

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

  const handleDeleteReward = async (id: string) => {
    const reward = rewards.find((r) => r.id === id);
    if (reward) {
      await deleteReward(reward);
      setRewardDialogOpen(false);
    }
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

  return (
    <div className="flex flex-col px-2 flex-1">
      <div className="flex items-center justify-between py-2">
        <h2>{t('rewards.title')}</h2>
        <Button
          onClick={() => {
            setEditingReward(undefined);
            setRewardDialogOpen(true);
          }}
        >
          <Plus className="size-4 mr-2" />
          {t('rewards.add')}
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
        <div className="flex flex-wrap gap-2 overflow-auto">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="
                w-full
                sm:w-[calc(50%-0.25rem)]
                lg:w-[calc(33.333%-0.4rem)]
                xl:w-[calc(25%-0.4rem)]
              "
            >
              <RewardCard
                {...reward}
                onEdit={handleEditReward}
                goalTitle={goals.find(g => g.id === reward.goalId)?.title}
                focused={reward.id === focusId}
              />
            </div>
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
        onDelete={handleDeleteReward}
        reward={editingReward}
        goals={goals}
      />
    </div>
  );
}
