import type { ReportUploadPayload } from "@/types";

export async function pickReportUpload(): Promise<ReportUploadPayload | null> {
  throw new Error("Report upload picker is not available on the web runtime.");
}
