export async function readDownloadResponse(response: Response) {
  return await response.blob();
}
