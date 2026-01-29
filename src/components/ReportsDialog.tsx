import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { ChevronUp, ChevronDown, Download } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useState } from "react";
import { format } from "date-fns";
import { Challenge, Report } from "@/types";
import { useTranslation } from "react-i18next";

interface ReportsDialogProps {
  challenge: Challenge;
  reports: Report[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (reportId: string) => void;
}

export function ReportsDialog({ challenge, reports, isOpen, onOpenChange, onDownload }: ReportsDialogProps) {
  const [openUsers, setOpenUsers] = useState<Record<string, boolean>>({});
  const { t } = useTranslation();

  console.log(reports, challenge)

  // Группировка отчётов по пользователям
  const reportsByUser = reports.reduce(
    (acc: Record<string, Report[]>, report) => {
      if (!acc[report.userId]) acc[report.userId] = [];
      acc[report.userId].push(report);
      return acc;
    },
    {}
  );

  const toggleUser = (userId: string) => {
    setOpenUsers(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-6 rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{challenge.title} — {t("challenges.reports")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-4">
          {Object.keys(reportsByUser).length === 0 && (
            <p className="text-sm text-muted-foreground">{t("challenges.noReports")}</p>
          )}

          {Object.entries(reportsByUser).map(([userId, reports]) => {
            const isOpen = openUsers[userId];
            return (
              <Collapsible key={userId} open={isOpen} onOpenChange={() => toggleUser(userId)}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>{reports[0].user.name}</span>
                    {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  {reports.map(report => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between border rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{report.taskCompletion.task.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {report.fileType} • {report.comment || "-"} • {format(new Date(report.createdAt), "dd.MM.yyyy HH:mm")}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDownload(report.id)}
                      >
                        <Download></Download>
                      </Button>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
