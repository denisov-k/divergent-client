import Config from "@/services/Config";

function hasValue(value?: string | null) {
  return Boolean(value && value.trim().length > 0);
}

export const platformCapabilities = {
  telegramLogin: hasValue(Config.data.api.telegram.twaURL),
  browserRedirects: true,
  nativeFilePersistence: true,
};
