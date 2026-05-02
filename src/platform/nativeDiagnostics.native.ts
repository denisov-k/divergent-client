import { requireOptionalNativeModule } from "expo-modules-core";

type NativeDiagnosticsModule = {
  consumeLastFatalError(): Promise<string | null> | string | null;
};

const moduleRef = requireOptionalNativeModule<NativeDiagnosticsModule>("DivergentNativeDiagnostics");

export async function consumeLastNativeFatalError() {
  if (!moduleRef) {
    return null;
  }

  return await moduleRef.consumeLastFatalError();
}
