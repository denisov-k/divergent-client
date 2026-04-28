import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

import { ActionChip } from "@/components/native/ActionChip";
import { pickReportUpload } from "@/platform/reportUpload";
import { appPalette } from "@/theme/palette";
import type { ReportUploadPayload } from "@/types";

export function CreateReportSheet({ open, onOpenChange, onSubmit }: { open: boolean; onOpenChange: (open: boolean) => void; onSubmit: (data: ReportUploadPayload) => Promise<boolean> }) {
  const { t } = useTranslation();
  const [comment, setComment] = useState("");
  const [selectedFile, setSelectedFile] = useState<ReportUploadPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePickFile = async () => {
    try {
      setError(null);
      const nextFile = await pickReportUpload();
      if (nextFile) setSelectedFile(nextFile);
    } catch (pickerError) {
      console.error(pickerError);
      setError(t("reports.picker_error"));
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError(t("reports.file_required"));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({ ...selectedFile, comment: comment.trim() || undefined });
      setComment("");
      setSelectedFile(null);
      onOpenChange(false);
    } catch (submitError) {
      console.error(submitError);
      setError(t("reports.submit_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => onOpenChange(false)}>
      <View style={{ flex: 1, backgroundColor: appPalette.surface.overlay, justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: appPalette.surface.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 14 }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: appPalette.semantic.textStrong, fontFamily: "Montserrat" }}>{t("reports.title")}</Text>
          <Text style={{ color: appPalette.semantic.textMuted, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{t("reports.description")}</Text>
          <Pressable onPress={() => void handlePickFile()} style={{ borderWidth: 1, borderStyle: "dashed", borderColor: appPalette.semantic.borderStrong, borderRadius: 16, padding: 18, backgroundColor: appPalette.ui.inputBackground }}>
            <Text style={{ color: appPalette.semantic.textStrong, fontWeight: "600", fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{selectedFile ? selectedFile.fileName : t("common.choose_file")}</Text>
            <Text style={{ color: appPalette.semantic.textMuted, marginTop: 4, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{selectedFile ? selectedFile.mimeType || t("common.file_selected") : t("common.supported_images_pdf")}</Text>
          </Pressable>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: appPalette.semantic.text, fontFamily: "Montserrat", lineHeight: 20 }}>{t("common.comment")}</Text>
            <TextInput value={comment} onChangeText={setComment} placeholder={t("common.optional")} multiline textAlignVertical="top" style={{ minHeight: 110, borderWidth: 1, borderColor: appPalette.semantic.borderStrong, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: appPalette.surface.background, color: appPalette.semantic.textStrong, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }} placeholderTextColor={appPalette.semantic.textSubtle} />
          </View>
          {!!error && <View style={{ backgroundColor: appPalette.semantic.dangerSurface, borderRadius: 12, padding: 12 }}><Text style={{ color: appPalette.semantic.dangerText, fontFamily: "Montserrat", fontSize: 12, lineHeight: 18 }}>{error}</Text></View>}
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}><ActionChip onPress={() => onOpenChange(false)}>{t("common.cancel")}</ActionChip><ActionChip onPress={() => void handleSubmit()} tone="primary">{loading ? t("common.sending") : t("common.confirm_completion")}</ActionChip></View>
        </View>
      </View>
    </Modal>
  );
}
