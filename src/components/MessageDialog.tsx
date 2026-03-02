import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Challenge } from "@/types";
import { useTranslation } from "react-i18next";

interface MessageDialogProps {
  challenge: Challenge;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (challengeId: string, text: string) => Promise<void>;
}

export function MessageDialog({
                                challenge,
                                isOpen,
                                onOpenChange,
                                onSend
                              }: MessageDialogProps) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      await onSend(challenge.id, text.trim());
      setText("");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {t("challenges.sendMessage")} — {challenge.title}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Textarea
            placeholder={t("challenges.messagePlaceholder")}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
          />
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("common.cancel")}
          </Button>

          <Button
            onClick={handleSend}
            disabled={!text.trim() || loading}
          >
            {loading
              ? t("common.sending")
              : t("common.send")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
