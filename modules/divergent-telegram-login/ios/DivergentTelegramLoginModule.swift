import ExpoModulesCore

public final class DivergentTelegramLoginModule: Module {
  public func definition() -> ModuleDefinition {
    Name("DivergentTelegramLogin")

    AsyncFunction("configure") { (clientId: String, redirectUri: String, scopes: [String], fallbackScheme: String?) in
      TelegramNativeLoginController.shared.configure(
        clientId: clientId,
        redirectUri: redirectUri,
        scopes: scopes,
        fallbackScheme: fallbackScheme
      )
    }
    .runOnQueue(.main)

    AsyncFunction("loginAsync") { (promise: Promise) in
      TelegramNativeLoginController.shared.login(promise: promise)
    }
    .runOnQueue(.main)
  }
}

final class TelegramNativeLoginController {
  static let shared = TelegramNativeLoginController()

  private(set) var redirectUriHost: String?

  private init() {}

  func configure(clientId: String, redirectUri: String, scopes: [String], fallbackScheme: String?) {
    redirectUriHost = URLComponents(string: redirectUri)?.host
    TelegramLogin.configure(
      clientId: clientId,
      redirectUri: redirectUri,
      scopes: scopes,
      fallbackScheme: fallbackScheme
    )
  }

  func login(promise: Promise) {
    Task { @MainActor in
      TelegramLogin.login { result in
        switch result {
        case .success(let loginData):
          promise.resolve(["idToken": loginData.idToken])
        case .failure(let error):
          promise.reject(error)
        }
      }
    }
  }

  @MainActor
  func handleCallbackIfNeeded(_ url: URL) -> Bool {
    guard let host = redirectUriHost, url.host == host else {
      return false
    }

    TelegramLogin.handle(url)
    return true
  }
}
