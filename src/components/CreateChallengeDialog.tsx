"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { Challenge, Goal } from "@/types";

import Select from "react-select";

interface CreateChallengeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challenge?: Challenge;
  goals: Goal[];
  onSave: (data: ChallengeInput) => Promise<void> | void;
}

export type ChallengeInput = Omit<
  Challenge,
  "goals" | "leaderboard" | "creatorId" | "participants"
>;

export function CreateChallengeDialog({
                                        open,
                                        onOpenChange,
                                        onSave,
                                        challenge,
                                        goals,
                                      }: CreateChallengeDialogProps) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [link, setLink] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (!open) return;

    if (challenge) {
      setTitle(challenge.title);
      setDescription(challenge.description ?? "");
      setRules(challenge.rules ?? "");
      setLink(challenge.link ?? "");
      setIsPublic(challenge.isPublic);
      setStartsAt(challenge.startsAt?.slice(0, 10) ?? "");
      setEndsAt(challenge.endsAt?.slice(0, 10) ?? "");
      setSelectedGoals(
        challenge.goals
          .map((g) => ({ value: g.id, label: g.title }))
      );
    } else {
      resetForm();
    }
  }, [open, challenge, goals]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRules("");
    setLink("");
    setIsPublic(true);
    setStartsAt("");
    setEndsAt("");
    setSelectedGoals([]);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSave({
        id: challenge?.id || "",
        title: title.trim(),
        description: description.trim() || undefined,
        rules: rules.trim() || undefined,
        link: link.trim() || undefined,
        isPublic,
        startsAt: startsAt || undefined,
        endsAt: endsAt || undefined,
        goalIds: selectedGoals.map((g) => g.value),
      });

      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{challenge ? t("challenges.edit_title") : t("challenges.create_title")}</DialogTitle>
          <DialogDescription>
            {challenge ? t("challenges.edit_description") : t("challenges.create_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder={t("challenges.fields.title")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            placeholder={t("challenges.fields.description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Textarea
            placeholder={t("challenges.fields.rules")}
            value={rules}
            onChange={(e) => setRules(e.target.value)}
          />

          <Input
            placeholder={t("challenges.fields.link")}
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <Checkbox
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(!!checked)}
            />
            <span className="text-sm">{t("challenges.visibility.public")}</span>
          </div>

          <Select
            isMulti
            options={goals.map((g) => ({value: g.id, label: g.title}))}
            value={selectedGoals}
            onChange={(values) => setSelectedGoals(values as { value: string; label: string }[])}
            placeholder={t("challenges.fields.select_goals")}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)}/>
            <Input type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)}/>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || loading}>
          {challenge ? t("common.save") : t("common.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
