const TOKEN_KEY = "token";

export async function readSessionToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export async function writeSessionToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export async function clearSessionToken() {
  localStorage.removeItem(TOKEN_KEY);
}
