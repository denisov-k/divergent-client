import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { pickReportUpload } from "@/platform/reportUpload";
import type { ReportUploadPayload } from "@/types";

export function CreateReportSheet({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ReportUploadPayload) => Promise<boolean>;
}) {
  const [comment, setComment] = useState("");
  const [selectedFile, setSelectedFile] = useState<ReportUploadPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePickFile = async () => {
    try {
      setError(null);
      const nextFile = await pickReportUpload();
      if (nextFile) {
        setSelectedFile(nextFile);
      }
    } catch (pickerError) {
      console.error(pickerError);
      setError("Не удалось открыть выбор файла.");
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Сначала выбери изображение или PDF.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        ...selectedFile,
        comment: comment.trim() || undefined,
      });
      setComment("");
      setSelectedFile(null);
      onOpenChange(false);
    } catch (submitError) {
      console.error(submitError);
      setError("Не удалось отправить отчёт.");
    } finally {
      setLoading(false);
    }
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
            backgroundColor: "#ffffff",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
            gap: 14,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#0f172a" }}>Отчёт о выполнении</Text>
          <Text style={{ color: "#64748b" }}>
            Прикрепи изображение или PDF и при желании добавь короткий комментарий.
          </Text>

          <Pressable
            onPress={() => void handlePickFile()}
            style={{
              borderWidth: 1,
              borderStyle: "dashed",
              borderColor: "#cbd5e1",
              borderRadius: 16,
              padding: 18,
              backgroundColor: "#f8fafc",
            }}
          >
            <Text style={{ color: "#0f172a", fontWeight: "600" }}>
              {selectedFile ? selectedFile.fileName : "Выбрать файл"}
            </Text>
            <Text style={{ color: "#64748b", marginTop: 4 }}>
              {selectedFile ? selectedFile.mimeType || "Файл выбран" : "Поддерживаются изображения и PDF"}
            </Text>
          </Pressable>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>Комментарий</Text>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Необязательно"
              multiline
              textAlignVertical="top"
              style={{
                minHeight: 110,
                borderWidth: 1,
                borderColor: "#cbd5e1",
                borderRadius: 16,
                paddingHorizontal: 14,
                paddingVertical: 12,
                backgroundColor: "#ffffff",
                color: "#0f172a",
              }}
              placeholderTextColor="#94a3b8"
            />
          </View>

          {!!error && (
            <View style={{ backgroundColor: "#fef2f2", borderRadius: 12, padding: 12 }}>
              <Text style={{ color: "#b91c1c" }}>{error}</Text>
            </View>
          )}

          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <ActionChip onPress={() => onOpenChange(false)}>Отмена</ActionChip>
            <ActionChip onPress={() => void handleSubmit()} tone="primary">
              {loading ? "Отправка..." : "Подтвердить выполнение"}
            </ActionChip>
          </View>
        </View>
      </View>
    </Modal>
  );
}
