import { useFonts } from "expo-font";

import { NativeRuntimeRoot } from "@/app/native/NativeRuntimeRoot";

export default function NativeAppRoot() {
  const [fontsLoaded] = useFonts({
    Montserrat: require("@/assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  return <NativeRuntimeRoot mode="standalone" ready={fontsLoaded} />;
}
