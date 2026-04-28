import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Image as ImageIcon, Upload } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ReportUploadPayload } from "@/types";

interface ReportUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ReportUploadPayload) => Promise<void>;
}

export default function CreateReportDialog({
  open,
  onOpenChange,
  onSubmit,
}: ReportUploadModalProps) {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!file) {
      setError(t("reports.file_required"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        file,
        fileName: file.name,
        mimeType: file.type,
        comment: comment || undefined,
      });
      setFile(null);
      setComment("");
    } catch {
      setError(t("reports.submit_error"));
    } finally {
      setLoading(false);
    }
  };

  const isImage = file?.type.startsWith("image/");
  const isPdf = file?.type === "application/pdf";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("reports.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3 rounded-2xl border-2 border-dashed p-6 text-center">
            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
              id="report-file"
            />
            <label htmlFor="report-file" className="flex cursor-pointer flex-col items-center gap-2">
              <Upload className="h-6 w-6" />
              <span className="text-sm text-muted-foreground">{t("common.supported_images_pdf")}</span>
            </label>

            {file && (
              <div className="flex items-center justify-center gap-2 text-sm">
                {isImage && <ImageIcon className="h-4 w-4" />}
                {isPdf && <FileText className="h-4 w-4" />}
                <span className="max-w-[200px] truncate">{file.name}</span>
              </div>
            )}
          </div>

          <Textarea
            placeholder={`${t("common.comment")} (${t("common.optional")})`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t("common.sending") : t("common.confirm_completion")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
