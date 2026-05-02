import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "divergent.session.token";

let token: string | null = null;

export async function readSessionToken() {
  if (token) {
    return token;
  }

  token = await SecureStore.getItemAsync(TOKEN_KEY);
  return token;
}

export async function writeSessionToken(nextToken: string) {
  token = nextToken;
  await SecureStore.setItemAsync(TOKEN_KEY, nextToken);
}

export async function clearSessionToken() {
  token = null;
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
