import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Image as ImageIcon, Upload } from "lucide-react";
import {useTranslation} from "react-i18next";
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
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();


  const handleSubmit = async () => {
    if (!file) {
      setError("Загрузите файл отчёта");
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
    } catch (e) {
      setError("Не удалось отправить отчёт");
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
          <DialogTitle>Отчёт о выполнении</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-2xl p-6 text-center space-y-3">
            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
              id="report-file"
            />
            <label
              htmlFor="report-file"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm text-muted-foreground">
                Загрузить изображение или PDF
              </span>
            </label>

            {file && (
              <div className="flex items-center justify-center gap-2 text-sm">
                {isImage && <ImageIcon className="w-4 h-4" />}
                {isPdf && <FileText className="w-4 h-4" />}
                <span className="truncate max-w-[200px]">{file.name}</span>
              </div>
            )}
          </div>

          <Textarea
            placeholder="Комментарий (необязательно)"
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
            {loading ? "Отправка..." : "Подтвердить выполнение"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
