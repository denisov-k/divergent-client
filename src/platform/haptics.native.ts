import * as Haptics from "expo-haptics";

export async function triggerSelectionHaptic() {
  await Haptics.selectionAsync();
}
