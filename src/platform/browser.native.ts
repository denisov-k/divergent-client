import { Alert, Linking, Share } from "react-native";

import i18n from "@/i18n";

export function openExternalLink(url: string) {
  void Linking.openURL(url);
}

export function redirectToUrl(url: string) {
  void Linking.openURL(url);
}

export async function shareLink(url: string) {
  try {
    await Share.share({ url, message: url });
  } catch {
    Alert.alert(
      i18n.t("common.share_failed_title"),
      i18n.t("common.share_failed_description"),
    );
  }
}
