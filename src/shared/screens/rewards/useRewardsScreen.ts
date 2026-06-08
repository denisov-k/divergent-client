import { useState } from "react";

import { useAppStore } from "@/stores/useAppStore";
import type { Reward } from "@/types";

const ONBOARDING_REWARD_SOURCE_KEY = "onboarding_completion";

type SaveRewardResult =
  | { status: "created"; rewardId: string }
  | { status: "updated"; rewardId: string };

export function useRewardsScreen() {
  const { rewards, addReward, updateReward, goals, deleteReward } = useAppStore();

  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | undefined>(undefined);

  const openCreateReward = () => {
    setEditingReward(undefined);
    setRewardDialogOpen(true);
  };

  const openEditReward = (id: string) => {
    const reward = rewards.find((item) => item.id === id);
    if (!reward || reward.sourceKey === ONBOARDING_REWARD_SOURCE_KEY) {
      return;
    }

    setEditingReward(reward);
    setRewardDialogOpen(true);
  };

  const saveReward = async (reward: Reward): Promise<SaveRewardResult> => {
    if (editingReward?.sourceKey === ONBOARDING_REWARD_SOURCE_KEY) {
      setEditingReward(undefined);
      return { status: "updated", rewardId: reward.id };
    }

    if (editingReward) {
      await updateReward(reward);
      setEditingReward(undefined);
      return { status: "updated", rewardId: reward.id };
    }

    await addReward(reward);
    setEditingReward(undefined);
    return { status: "created", rewardId: reward.id };
  };

  const removeReward = async (id: string) => {
    const reward = rewards.find((item) => item.id === id);
    if (!reward || reward.sourceKey === ONBOARDING_REWARD_SOURCE_KEY) {
      return false;
    }

    await deleteReward(reward);
    setRewardDialogOpen(false);
    return true;
  };

  const closeRewardDialog = (open: boolean) => {
    setRewardDialogOpen(open);
    if (!open) {
      setEditingReward(undefined);
    }
  };

  return {
    rewards,
    goals,
    rewardDialogOpen,
    editingReward,
    openCreateReward,
    openEditReward,
    saveReward,
    removeReward,
    closeRewardDialog,
  };
}
