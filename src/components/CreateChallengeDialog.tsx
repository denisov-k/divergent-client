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
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { Challenge, Goal } from "@/types";

import Select from "react-select";
import {Label} from "@/components/ui/label.tsx";
import {DatePickerInput} from "@/components/ui/date-picker.tsx";

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
  const [price, setPrice] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [requiresReport, setRequiresReport] = useState(false);
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
      setPrice(challenge.price ? String(challenge.price) : "");
      setIsPublic(challenge.isPublic);
      setRequiresReport(challenge.requiresReport);
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
    setPrice("");
    setIsPublic(true);
    setRequiresReport(false);
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
        reports: [], // FIXME
        requiresReport,
        price: Number(price),
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{challenge ? t("challenges.edit_title") : t("challenges.create_title")}</DialogTitle>
          <DialogDescription>
            {challenge ? t("challenges.edit_description") : t("challenges.create_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rules">{t("challenges.fields.title")}</Label>
            <Input
              id="title"
              placeholder={t("challenges.fields.title")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rules">{t("challenges.fields.description")}</Label>
            <Textarea
              id="description"
              placeholder={t("challenges.fields.description")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rules">{t("challenges.fields.rules")}</Label>
            <Textarea
              id="rules"
              placeholder={t("challenges.fields.rules")}
              value={rules}
              onChange={(e) => setRules(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Ссылка на сообщество</Label>
            <Input
              id="link"
              placeholder={t("challenges.fields.link")}
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">{t("challenges.fields.price")}</Label>
            <Input
              placeholder={t("challenges.fields.price")}
              id="price"
              value={price}
              type="number"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">{t("challenges.fields.visibility")}</Label>
            <Select
              id="visibility"
              className="text-sm"
              options={[
                {value: true, label: t("challenges.visibility.public")},
                {value: false, label: t("challenges.visibility.private")},
              ]}
              value={
                isPublic
                  ? {value: true, label: t("challenges.visibility.public")}
                  : {value: false, label: t("challenges.visibility.private")}
              }
              onChange={(option) => setIsPublic(option?.value ?? true)}
              placeholder={t("challenges.fields.select_visibility")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiresReport">{t("challenges.fields.requiresReport")}</Label>
            <Select
              id="requiresReport"
              className="text-sm"
              options={[
                {value: true, label: t("common.yes")},
                {value: false, label: t("common.no")},
              ]}
              value={
                requiresReport
                  ? {value: true, label: t("common.yes")}
                  : {value: false, label: t("common.no")}
              }
              onChange={(option) => setRequiresReport(option?.value ?? true)}
              placeholder={t("challenges.fields.requiresReport")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">{t("challenges.fields.goals")}</Label>
            <Select
              id="goals"
              className="text-sm"
              isMulti
              options={goals.map((g) => ({value: g.id, label: g.title}))}
              value={selectedGoals}
              onChange={(values) => setSelectedGoals(values as { value: string; label: string }[])}
              placeholder={t("challenges.fields.select_goals")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">{t("challenges.fields.start_date")}</Label>
              <DatePickerInput
                value={startsAt ? new Date(startsAt) : undefined}
                onChange={(date) => setStartsAt(date ? date.toISOString().slice(0, 10) : "")}
              />            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">{t("challenges.fields.end_date")}</Label>
              <DatePickerInput
                value={endsAt ? new Date(endsAt) : undefined}
                onChange={(date) => setEndsAt(date ? date.toISOString().slice(0, 10) : "")}
              />            </div>
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
