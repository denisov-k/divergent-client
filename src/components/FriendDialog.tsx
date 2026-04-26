import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { FriendInput } from "@/types";

export function FriendDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (friend: FriendInput) => Promise<unknown>;
}) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("1");
  const [currentXp, setCurrentXp] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName("");
    setLevel("1");
    setCurrentXp("0");
    setIsSubmitting(false);
  }, [open]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        name: trimmedName,
        level: Math.max(1, Number(level) || 1),
        currentXp: Math.max(0, Number(currentXp) || 0),
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить друга</DialogTitle>
          <DialogDescription>Быстрая форма для social-layer без web-only заглушек.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Имя</label>
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Например, Алина" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Уровень</label>
              <Input
                type="number"
                min={1}
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">XP</label>
              <Input
                type="number"
                min={0}
                value={currentXp}
                onChange={(event) => setCurrentXp(event.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={() => void handleSave()} disabled={isSubmitting || !name.trim()}>
            {isSubmitting ? "Создаём..." : "Добавить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
