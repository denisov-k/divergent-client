export async function openAuthSession(url: string, redirectUrl: string) {
  const importer = new Function("specifier", "return import(specifier);") as (
    specifier: string
  ) => Promise<{
    openAuthSessionAsync?: (authUrl: string, returnUrl?: string) => Promise<{ type: string; url?: string }>;
  }>;

  const module = await importer("expo-web-browser");
  if (!module.openAuthSessionAsync) {
    throw new Error("expo-web-browser is not available in this runtime");
  }

  return module.openAuthSessionAsync(url, redirectUrl);
}
