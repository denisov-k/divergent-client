import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { SurfaceCard } from "@/components/native/SurfaceCard";
import type { Challenge, ChallengeParticipant, Report } from "@/types";

function formatReportDate(value: string) {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function ChallengeDetailsSheet({
  open,
  challenge,
  participants,
  reports,
  onOpenChange,
  onDownload,
  onKick,
}: {
  open: boolean;
  challenge: Challenge;
  participants: ChallengeParticipant[];
  reports: Report[];
  onOpenChange: (open: boolean) => void;
  onDownload: (reportId: string) => Promise<boolean>;
  onKick: (challengeId: string, userId: string) => Promise<void>;
}) {
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});

  const reportsByUser = useMemo(() => {
    return reports.reduce<Record<string, Report[]>>((acc, report) => {
      if (!acc[report.userId]) {
        acc[report.userId] = [];
      }
      acc[report.userId].push(report);
      return acc;
    }, {});
  }, [reports]);

  const toggleParticipant = (userId: string) => {
    setExpandedUsers((current) => ({
      ...current,
      [userId]: !current[userId],
    }));
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => onOpenChange(false)}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(15, 23, 42, 0.35)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            maxHeight: "88%",
            backgroundColor: "#ffffff",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            gap: 14,
          }}
        >
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#0f172a" }}>{challenge.title}</Text>
            <Text style={{ color: "#64748b" }}>
              Участники: {participants.length} • Отчёты: {reports.length}
            </Text>
          </View>

          <ScrollView contentContainerStyle={{ gap: 12 }}>
            {participants.length === 0 ? (
              <SurfaceCard>
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#0f172a" }}>Пока никто не участвует</Text>
                <Text style={{ color: "#64748b" }}>
                  Когда участники присоединятся, здесь появятся их отчёты и быстрые действия.
                </Text>
              </SurfaceCard>
            ) : (
              participants.map((participant) => {
                const userReports = reportsByUser[participant.userId] ?? [];
                const isExpanded = Boolean(expandedUsers[participant.userId]);
                const canKick = participant.userId !== challenge.creatorId;

                return (
                  <SurfaceCard key={participant.id}>
                    <Pressable onPress={() => toggleParticipant(participant.userId)} style={{ gap: 6 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 16, fontWeight: "600", color: "#0f172a" }}>
                            {participant.user.name}
                          </Text>
                          <Text style={{ color: "#64748b" }}>
                            {participant.user.email || "Email не указан"}
                          </Text>
                        </View>
                        <Text style={{ color: "#2563eb", fontWeight: "600" }}>
                          {isExpanded ? "Скрыть" : "Открыть"}
                        </Text>
                      </View>

                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                        <View
                          style={{
                            backgroundColor: "#f8fafc",
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 999,
                          }}
                        >
                          <Text style={{ color: "#334155" }}>{userReports.length} отчётов</Text>
                        </View>
                        {participant.userId === challenge.creatorId && (
                          <View
                            style={{
                              backgroundColor: "#ede9fe",
                              paddingHorizontal: 10,
                              paddingVertical: 6,
                              borderRadius: 999,
                            }}
                          >
                            <Text style={{ color: "#6d28d9" }}>Создатель</Text>
                          </View>
                        )}
                      </View>
                    </Pressable>

                    {isExpanded && (
                      <View style={{ gap: 10 }}>
                        {userReports.length === 0 ? (
                          <Text style={{ color: "#64748b" }}>У этого участника пока нет отчётов.</Text>
                        ) : (
                          userReports.map((report) => (
                            <View
                              key={report.id}
                              style={{
                                borderWidth: 1,
                                borderColor: "#e2e8f0",
                                borderRadius: 14,
                                padding: 12,
                                gap: 8,
                                backgroundColor: "#f8fafc",
                              }}
                            >
                              <View style={{ gap: 4 }}>
                                <Text style={{ fontWeight: "600", color: "#0f172a" }}>
                                  {report.taskCompletion.task.title}
                                </Text>
                                <Text style={{ color: "#64748b" }}>
                                  {report.fileType} • {formatReportDate(report.createdAt)}
                                </Text>
                                {!!report.comment && <Text style={{ color: "#475569" }}>{report.comment}</Text>}
                              </View>

                              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                                <ActionChip onPress={() => void onDownload(report.id)} tone="primary">
                                  Скачать отчёт
                                </ActionChip>
                              </View>
                            </View>
                          ))
                        )}

                        {canKick && (
                          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                            <ActionChip onPress={() => void onKick(challenge.id, participant.userId)} tone="danger">
                              Исключить участника
                            </ActionChip>
                          </View>
                        )}
                      </View>
                    )}
                  </SurfaceCard>
                );
              })
            )}
          </ScrollView>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <ActionChip onPress={() => onOpenChange(false)}>Закрыть</ActionChip>
          </View>
        </View>
      </View>
    </Modal>
  );
}
