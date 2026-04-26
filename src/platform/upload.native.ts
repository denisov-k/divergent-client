import type { ReportUploadPayload } from "@/types";

export function createReportUploadBody(data: ReportUploadPayload): FormData {
  const formData = new FormData();
  const filePart = {
    uri: (data.file as Blob & { uri?: string }).uri || "",
    name: data.fileName,
    type: data.mimeType || data.file.type || "application/octet-stream",
  };

  formData.append("file", filePart as unknown as Blob);
  if (data.comment) {
    formData.append("comment", data.comment);
  }

  return formData;
}
