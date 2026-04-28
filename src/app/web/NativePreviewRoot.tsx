import { useEffect } from "react";

import NativeAppRoot from "@/app/native/NativeAppRoot";
import { webCssVariables } from "@/theme/palette";

export default function NativePreviewRoot() {
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(webCssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, []);

  return <NativeAppRoot />;
}
