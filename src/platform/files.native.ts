import { Alert, Linking } from "react-native";

import Config from "@/services/Config";
import type { Report } from "@/types";

export async function downloadReportFile(report: Report) {
  const fileUrl = report.fileUrl.startsWith("http")
    ? report.fileUrl
    : `${Config.data.api.http.baseURL}${report.fileUrl}`;

  try {
    await Linking.openURL(fileUrl);
  } catch {
    Alert.alert(
      "Cannot open report",
      "The report link could not be opened on this device. Native file persistence can be added next."
    );
  }
}
