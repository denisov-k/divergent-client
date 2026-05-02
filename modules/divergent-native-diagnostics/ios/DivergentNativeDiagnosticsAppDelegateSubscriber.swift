import ExpoModulesCore

public final class DivergentNativeDiagnosticsAppDelegateSubscriber: ExpoAppDelegateSubscriber {
  public func subscriberDidRegister() {
    DivergentNativeDiagnosticsStore.shared.installIfNeeded()
  }
}
