import { useEffect } from "react";
import { Alert } from "react-native";

import { useAppBootstrap } from "@/app/useAppBootstrap";
import { NativeToastHost } from "@/components/native/NativeToastHost";
import { AppLoader } from "@/components/shared/AppLoader";
import { consumeLastNativeFatalError } from "@/platform/nativeDiagnostics";
import NativeAppShell from "@/views/native/AppShell";
import NativeAuthRoot from "@/views/native/auth/NativeAuthRoot";

type NativeRuntimeMode = "preview" | "standalone";

function NativeLoadingScreen({ mode }: { mode: NativeRuntimeMode }) {
  void mode;

  return <AppLoader fullScreen />;
}

function NativeAuthScreen() {
  return <NativeAuthRoot />;
}

export function NativeRuntimeRoot({
  mode,
  ready = true,
}: {
  mode: NativeRuntimeMode;
  ready?: boolean;
}) {
  const { initialized, user } = useAppBootstrap();

  useEffect(() => {
    if (!ready || !initialized) {
      return;
    }

    void (async () => {
      const lastFatalError = await consumeLastNativeFatalError();
      if (!lastFatalError) {
        return;
      }

      Alert.alert("Last native fatal error", lastFatalError);
    })();
  }, [initialized, ready]);

  if (!ready || !initialized) {
    return <NativeLoadingScreen mode={mode} />;
  }

  const content = !user ? <NativeAuthScreen /> : <NativeAppShell mode={mode} />;

  return (
    <>
      {content}
      <NativeToastHost />
    </>
  );
}
