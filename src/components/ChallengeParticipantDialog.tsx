import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "./ui/dialog";
import {Button} from "./ui/button";
import {ChevronUp, ChevronDown, Download} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "./ui/collapsible";
import {useState} from "react";
import {format} from "date-fns";
import {Challenge, ChallengeParticipant, Report} from "@/types";
import {useTranslation} from "react-i18next";

interface ChallengeParticipantDialogProps {
  challenge: Challenge;
  participants: ChallengeParticipant[];
  reports: Report[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (reportId: string) => void;
  onKick: (challengeId: string, userId: string) => void;
}

export function ChallengeParticipantDialog({
                                             challenge,
                                             participants,
                                             reports,
                                             isOpen,
                                             onOpenChange,
                                             onDownload,
                                             onKick
                                           }: ChallengeParticipantDialogProps) {
  const [openUsers, setOpenUsers] = useState<Record<string, boolean>>({});
  const {t} = useTranslation();

  const isCreator = (userId: string) => challenge.creatorId === userId;

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
    setOpenUsers(prev => ({...prev, [userId]: !prev[userId]}));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle
            className="text-lg font-semibold">{challenge.title} — {t("challenges.participants")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-4">
          {participants.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {t("challenges.noParticipants")}
            </p>
          )}

          {participants.map((participant) => {
            const userReports = reportsByUser[participant.userId] || [];
            const isOpen = openUsers[participant.userId];

            return (
              <Collapsible
                key={participant.userId}
                open={isOpen}
                onOpenChange={() => toggleUser(participant.userId)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
            <span>
              {participant.user.name}
            </span>
                    {isOpen ? (
                      <ChevronUp className="size-4"/>
                    ) : (
                      <ChevronDown className="size-4"/>
                    )}
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="space-y-2 mt-2">

                  {userReports.length === 0 && (
                    <span className="text-xs ml-2 text-muted-foreground">
                      {t("challenges.noReports")}
                    </span>
                  )}

                  {/* Репорты */}
                  {userReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between border rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <div className="flex flex-col">
                <span className="font-medium">
                  {report.taskCompletion.task.title}
                </span>
                        <span className="text-xs text-muted-foreground">
                  {report.fileType} • {report.comment || "-"} •{" "}
                          {format(new Date(report.createdAt), "dd.MM.yyyy HH:mm")}
                </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDownload(report.id)}
                      >
                        <Download/>
                      </Button>
                    </div>
                  ))}

                  { !isCreator(participant.userId) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onKick(challenge.id, participant.userId)}
                    >
                      {t("challenges.kick")}
                    </Button>
                  )}
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
