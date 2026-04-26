import { Alert, Linking, Share } from "react-native";

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
    Alert.alert("Share failed", "Unable to share the link on this device.");
  }
}
