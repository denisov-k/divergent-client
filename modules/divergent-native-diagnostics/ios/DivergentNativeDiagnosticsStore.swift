import Foundation
import React

private let lastFatalErrorKey = "divergent.nativeDiagnostics.lastFatalError"

final class DivergentNativeDiagnosticsStore {
  static let shared = DivergentNativeDiagnosticsStore()

  private var installed = false

  private init() {}

  func installIfNeeded() {
    guard !installed else {
      return
    }

    installed = true

    let previousFatalHandler = RCTGetFatalHandler()
    RCTSetFatalHandler { error in
      self.persistFatalError(error: error)
      previousFatalHandler?(error)
    }

    let previousExceptionHandler = RCTGetFatalExceptionHandler()
    RCTSetFatalExceptionHandler { exception in
      self.persistFatalException(exception)
      previousExceptionHandler?(exception)
    }
  }

  func consumeLastFatalError() -> String? {
    let defaults = UserDefaults.standard
    let value = defaults.string(forKey: lastFatalErrorKey)
    defaults.removeObject(forKey: lastFatalErrorKey)
    return value
  }

  private func persistFatalError(error: NSError) {
    var parts = [
      "type=NSError",
      "domain=\(error.domain)",
      "code=\(error.code)",
      "message=\(error.localizedDescription)"
    ]

    if let jsStack = error.userInfo[RCTJSRawStackTraceKey] as? String, !jsStack.isEmpty {
      parts.append("jsStack=\(jsStack)")
    } else if let stackFrames = error.userInfo[RCTJSStackTraceKey] as? [[String: Any]], !stackFrames.isEmpty {
      parts.append("jsStack=\(RCTFormatStackTrace(stackFrames))")
    }

    if let extraData = error.userInfo[RCTJSExtraDataKey] as? String, !extraData.isEmpty {
      parts.append("extraData=\(extraData)")
    }

    UserDefaults.standard.set(parts.joined(separator: "\n\n"), forKey: lastFatalErrorKey)
  }

  private func persistFatalException(_ exception: NSException) {
    var parts = [
      "type=NSException",
      "name=\(exception.name.rawValue)",
      "reason=\(exception.reason ?? "Unknown exception")"
    ]

    let callStack = exception.callStackSymbols.joined(separator: "\n")
    if !callStack.isEmpty {
      parts.append("callStack=\(callStack)")
    }

    UserDefaults.standard.set(parts.joined(separator: "\n\n"), forKey: lastFatalErrorKey)
  }
}
