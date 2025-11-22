import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Trophy, Star, Gift, Crown, Award, Zap } from "lucide-react";

type RewardIcon = "trophy" | "star" | "gift" | "crown" | "award" | "zap";

export interface Reward {
  id: string;
  title: string;
  description: string;
  requiredXp: number;
  icon: RewardIcon;
  isUnlocked: boolean;
}

interface RewardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (reward: Reward) => void;
  reward?: Reward;
}

const iconOptions = [
  { value: "trophy", label: "Кубок", Icon: Trophy },
  { value: "star", label: "Звезда", Icon: Star },
  { value: "gift", label: "Подарок", Icon: Gift },
  { value: "crown", label: "Корона", Icon: Crown },
  { value: "award", label: "Медаль", Icon: Award },
  { value: "zap", label: "Молния", Icon: Zap },
];

export function RewardDialog({ open, onOpenChange, onSave, reward }: RewardDialogProps) {
  const [title, setTitle] = useState(reward?.title || "");
  const [description, setDescription] = useState(reward?.description || "");
  const [requiredXp, setRequiredXp] = useState(reward?.requiredXp?.toString() || "");
  const [icon, setIcon] = useState<RewardIcon>(reward?.icon || "trophy");

  const handleSave = () => {
    const rewardData: Reward = {
      id: reward?.id || Date.now().toString(),
      title,
      description,
      requiredXp: parseInt(requiredXp),
      icon,
      isUnlocked: reward?.isUnlocked || false,
    };

    onSave(rewardData);
    handleClose();
  };

  const handleClose = () => {
    if (!reward) {
      setTitle("");
      setDescription("");
      setRequiredXp("");
      setIcon("trophy");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
            <Label htmlFor="reward-xp">Требуемый опыт (XP) *</Label>
            <Input
              id="reward-xp"
              type="number"
              placeholder="1000"
              value={requiredXp}
              onChange={(e) => setRequiredXp(e.target.value)}
            />
            <p className="text-muted-foreground">
              Награда будет доступна, когда пользователь наберёт этот опыт
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Отмена
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!title || !description || !requiredXp || parseInt(requiredXp) <= 0}
          >
            {reward ? "Сохранить" : "Создать награду"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
