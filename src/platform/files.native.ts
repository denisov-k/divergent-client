import { Alert } from "react-native";
import { File, Paths } from "expo-file-system";
import { isAvailableAsync, shareAsync } from "expo-sharing";

import i18n from "@/i18n";
import Config from "@/services/Config";
import type { Report } from "@/types";

function resolveExtension(report: Report) {
  const fromUrl = report.fileUrl.split("?")[0]?.split(".").pop()?.trim();
  if (fromUrl) {
    return fromUrl;
  }

  const lowerType = report.fileType.toLowerCase();
  if (lowerType.includes("pdf")) {
    return "pdf";
  }
  if (lowerType.includes("png")) {
    return "png";
  }
  if (lowerType.includes("jpeg") || lowerType.includes("jpg")) {
    return "jpg";
  }

  return "bin";
}

export async function downloadReportFile(report: Report) {
  const fileUrl = report.fileUrl.startsWith("http")
    ? report.fileUrl
    : `${Config.data.api.http.baseURL}${report.fileUrl}`;

  try {
    const extension = resolveExtension(report);
    const fileName = `report-${report.id}.${extension}`;
    const destination = new File(Paths.cache, fileName);
    const file = await File.downloadFileAsync(fileUrl, destination);
    const canShare = await isAvailableAsync();

    if (!canShare) {
      Alert.alert(
        i18n.t("common.sharing_unavailable_title"),
        i18n.t("common.sharing_unavailable_description"),
      );
      return;
    }

    await shareAsync(file.uri, {
      mimeType: report.fileType || undefined,
      dialogTitle: i18n.t("common.export_report_title"),
    });
  } catch {
    Alert.alert(
      i18n.t("common.export_report_error_title"),
      i18n.t("common.export_report_error_description"),
    );
  }
}
