const TOKEN_KEY = "divergent.session.token";

let token: string | null = null;

async function loadSecureStore() {
  try {
    const importer = new Function("specifier", "return import(specifier);") as (
      specifier: string
    ) => Promise<{
      getItemAsync?: (key: string) => Promise<string | null>;
      setItemAsync?: (key: string, value: string) => Promise<void>;
      deleteItemAsync?: (key: string) => Promise<void>;
    }>;

    return await importer("expo-secure-store");
  } catch {
    return null;
  }
}

export async function readSessionToken() {
  if (token) {
    return token;
  }

  const secureStore = await loadSecureStore();
  if (!secureStore?.getItemAsync) {
    return token;
  }

  token = await secureStore.getItemAsync(TOKEN_KEY);
  return token;
}

export async function writeSessionToken(nextToken: string) {
  token = nextToken;

  const secureStore = await loadSecureStore();
  if (secureStore?.setItemAsync) {
    await secureStore.setItemAsync(TOKEN_KEY, nextToken);
  }
}

export async function clearSessionToken() {
  token = null;

  const secureStore = await loadSecureStore();
  if (secureStore?.deleteItemAsync) {
    await secureStore.deleteItemAsync(TOKEN_KEY);
  }
}
