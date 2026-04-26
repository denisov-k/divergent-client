import type { Report } from "@/types";
import Config from "@/services/Config";

export async function downloadReportFile(report: Report) {
  const fileUrl = report.fileUrl.startsWith("http")
    ? report.fileUrl
    : `${Config.data.api.http.baseURL}${report.fileUrl}`;

  const res = await fetch(fileUrl, { credentials: "include" });
  const blob = await res.blob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${report.user.name} - ${report.taskCompletion.task.title}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
