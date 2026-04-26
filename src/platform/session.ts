const TOKEN_KEY = "token";

export function readSessionToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function writeSessionToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearSessionToken() {
  localStorage.removeItem(TOKEN_KEY);
}
