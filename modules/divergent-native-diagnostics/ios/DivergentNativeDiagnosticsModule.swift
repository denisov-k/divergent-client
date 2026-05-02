import ExpoModulesCore

public final class DivergentNativeDiagnosticsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("DivergentNativeDiagnostics")

    AsyncFunction("consumeLastFatalError") { () -> String? in
      return DivergentNativeDiagnosticsStore.shared.consumeLastFatalError()
    }
  }
}
