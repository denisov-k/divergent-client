import type { ReportUploadPayload } from "@/types";

type DocumentPickerAsset = {
  uri: string;
  name: string;
  mimeType?: string;
};

export async function pickReportUpload(): Promise<ReportUploadPayload | null> {
  const documentPicker = await import("expo-document-picker");
  const result = await documentPicker.getDocumentAsync({
    type: ["image/*", "application/pdf"],
    multiple: false,
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets?.length) {
    return null;
  }

  const asset = result.assets[0] as DocumentPickerAsset;
  const response = await fetch(asset.uri);
  const file = await response.blob();

  return {
    file,
    fileName: asset.name || "report",
    mimeType: asset.mimeType || file.type || "application/octet-stream",
  };
}
