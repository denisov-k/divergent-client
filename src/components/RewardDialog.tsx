import {useEffect, useState} from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Trophy, Star, Gift, Crown, Award, Zap } from "lucide-react";

import {Goal, Reward, RewardIcon} from "@/types";
import {useTranslation} from "react-i18next";


interface RewardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (reward: Reward) => void;
  onDelete: (id: string) => void;
  reward?: Reward;
  goals: Goal[];
}

const iconOptions = [
  { value: "trophy", label: "Кубок", Icon: Trophy },
  { value: "star", label: "Звезда", Icon: Star },
  { value: "gift", label: "Подарок", Icon: Gift },
  { value: "crown", label: "Корона", Icon: Crown },
  { value: "award", label: "Медаль", Icon: Award },
  { value: "zap", label: "Молния", Icon: Zap },
];

export function RewardDialog({ open, onOpenChange, onSave, onDelete, reward, goals }: RewardDialogProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(reward?.title || "");
  const [description, setDescription] = useState(reward?.description || "");
  const [icon, setIcon] = useState<RewardIcon>(reward?.icon || "trophy");
  const [goalId, setGoalId] = useState(reward?.goalId || "");

  useEffect(() => {
    if (open && reward) {
      setTitle(reward.title || "");
      setDescription(reward.description || "");
      setIcon(reward.icon || "trophy");
      setGoalId(reward.goalId || "");
    }

    if (open && !reward) {
      setTitle("");
      setDescription("");
      setIcon("trophy");
      setGoalId("");
    }
  }, [reward, open]);


  const handleSave = () => {
    const rewardData: Reward = {
      id: reward?.id || Date.now().toString(),
      title,
      description,
      icon,
      goalId,
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
    if (onDelete)
      onDelete(id);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) handleClose();  // закрывается → сброс
        else onOpenChange(true);    // открывается → просто открыть
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{reward ? "Редактировать награду" : "Создать новую награду"}</DialogTitle>
          <DialogDescription>
            Создайте награду, которую можно получить за достижение определенного опыта
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reward-title">Название награды *</Label>
            <Input
              id="reward-title"
              placeholder="Например: Мастер привычек"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward-description">Описание *</Label>
            <Textarea
              id="reward-description"
              placeholder="За что даётся награда..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward-icon">Иконка</Label>
            <Select value={icon} onValueChange={(value) => setIcon(value as RewardIcon)}>
              <SelectTrigger id="reward-icon">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => {
                  const IconComponent = option.Icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="size-4"/>
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward">Цель</Label>

            <Select value={goalId} onValueChange={(value) => setGoalId(value)}>
              <SelectTrigger id="reward">
                <SelectValue placeholder="Выберите цель"/>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="none">Без цели</SelectItem>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>
        </div>

        <DialogFooter>
          {reward &&
            <Button variant="destructive" onClick={() => handleDelete(reward!.id)}>
              {t('common.delete')}
            </Button>
          }
          <Button variant="outline" onClick={handleClose}>
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title || !description}
          >
            {reward ? "Сохранить" : "Создать награду"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
