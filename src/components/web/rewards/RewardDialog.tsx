import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Trophy, Star, Gift, Crown, Award, Zap } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { Goal, Reward, RewardIcon } from "@/types";

interface RewardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (reward: Reward) => void;
  onDelete: (id: string) => void;
  reward?: Reward;
  goals: Goal[];
}

export function RewardDialog({ open, onOpenChange, onSave, onDelete, reward, goals }: RewardDialogProps) {
  const { t } = useTranslation();
  const iconOptions = [
    { value: "trophy", label: t("rewards.icon_trophy"), Icon: Trophy },
    { value: "star", label: t("rewards.icon_star"), Icon: Star },
    { value: "gift", label: t("rewards.icon_gift"), Icon: Gift },
    { value: "crown", label: t("rewards.icon_crown"), Icon: Crown },
    { value: "award", label: t("rewards.icon_award"), Icon: Award },
    { value: "zap", label: t("rewards.icon_zap"), Icon: Zap },
  ] as const;

  const [title, setTitle] = useState(reward?.title || "");
  const [description, setDescription] = useState(reward?.description || "");
  const [xpRequires, setXpRequires] = useState(reward?.xpRequires || "");
  const [icon, setIcon] = useState<RewardIcon>(reward?.icon || "trophy");
  const [goalId, setGoalId] = useState(reward?.goalId || "");

  useEffect(() => {
    if (open && reward) {
      setTitle(reward.title || "");
      setDescription(reward.description || "");
      setIcon(reward.icon || "trophy");
      setGoalId(reward.goalId || "");
      setXpRequires(reward.xpRequires || "");
    }

    if (open && !reward) {
      setTitle("");
      setDescription("");
      setIcon("trophy");
      setGoalId("");
      setXpRequires("");
    }
  }, [reward, open]);

  const handleSave = () => {
    const rewardData: Reward = {
      id: reward?.id || Date.now().toString(),
      title,
      description,
      icon,
      goalId,
      xpRequires: Number(xpRequires),
      isUnlocked: reward?.isUnlocked || false,
    };

    onSave(rewardData);
    handleClose();
  };

  const handleClose = () => {
    if (!reward) {
      setTitle("");
      setDescription("");
      setIcon("trophy");
    }
    onOpenChange(false);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) handleClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{reward ? t("rewards.dialog.edit_title") : t("rewards.dialog.create_title")}</DialogTitle>
          <DialogDescription>{t("rewards.dialog.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reward-title">{t("rewards.dialog.title_label")}</Label>
            <Input
              id="reward-title"
              placeholder={t("rewards.dialog.title_placeholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward-description">{t("rewards.dialog.description_label")}</Label>
            <Textarea
              id="reward-description"
              placeholder={t("rewards.dialog.description_placeholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward-icon">{t("rewards.dialog.icon_label")}</Label>
            <Select value={icon} onValueChange={(value) => setIcon(value as RewardIcon)}>
              <SelectTrigger id="reward-icon">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => {
                  const IconComponent = option.Icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="size-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward-goal">{t("rewards.dialog.goal_label")}</Label>
            <Select value={goalId} onValueChange={(value) => setGoalId(value)}>
              <SelectTrigger id="reward-goal">
                <SelectValue placeholder={t("rewards.dialog.goal_placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("rewards.dialog.goal_none")}</SelectItem>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="xp-requires">{t("rewards.dialog.xp_label")}</Label>
            <Input id="xp-requires" type="number" value={xpRequires} onChange={(e) => setXpRequires(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          {reward && (
            <Button variant="destructive" onClick={() => handleDelete(reward.id)}>
              {t("common.delete")}
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={!title || !description}>
            {reward ? t("common.save") : t("rewards.dialog.create_submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
