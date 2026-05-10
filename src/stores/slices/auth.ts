import * as api from "@/shared/api/client";
import { loadAppData } from "@/shared/app/loadAppData";
import { clearSessionToken } from "@/platform/session";
import type { AuthSlice, StoreSlice } from "@/stores/types";

async function hydrateAppData(set: Parameters<StoreSlice<AuthSlice>>[0]) {
  try {
    set(await loadAppData());
  } catch (err) {
    console.error(err);
  }
}

async function finalizeAuthenticatedState(set: Parameters<StoreSlice<AuthSlice>>[0]) {
  const user = await api.fetchUser();

  set({
    user,
    token: null,
    initialized: true,
  });

  await hydrateAppData(set);
}

export const createAuthSlice: StoreSlice<AuthSlice> = (set, get) => ({
  signup: async (email, password, name, referrerId, referrerLinkId) => {
    void referrerId;
    void referrerLinkId;

    set({ loading: true });
    try {
      await api.register(email, password, name);
      await finalizeAuthenticatedState(set);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  loginWithCredentials: async (email: string, password: string) => {
    set({ loading: true });
    try {
      await api.loginWithCredentials(email, password);
      await finalizeAuthenticatedState(set);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  loginWithTelegramIdToken: async (idToken: string) => {
    set({ loading: true });
    try {
      await api.loginWithTelegramIdToken(idToken);
      await finalizeAuthenticatedState(set);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await api.logout();
    } catch (err) {
      console.error(err);
    } finally {
      get().logout();
      set({ initialized: true, loading: false });
    }
  },

  updateUser: async (patch) => {
    const updated = await api.updateUser(patch);
    set({ user: updated });
  },

  setCredentials: async (password, email, currentPassword) => {
    set({ loading: true });
    try {
      const user = await api.setCredentials(password, email, currentPassword);
      set({ user });
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  passwordReset: async (email) => {
    return api.requestPasswordReset(email);
  },

  confirmPasswordReset: async (token, password) => {
    await api.confirmPasswordReset(token, password);
  },

  logout: () => {
    set({ user: null, token: null, goals: [], rewards: [], reminders: [] });
    void clearSessionToken();
  },

  refreshUser: async () => {
    set({ loading: true });
    try {
      const user = await api.fetchUser();
      set({ user });
    } catch (err) {
      console.error(err);
      get().logout();
    } finally {
      set({ loading: false });
    }
  },

  refreshAppData: async () => {
    await hydrateAppData(set);
  },

  initialize: async () => {
    set({ loading: true });
    try {
      const user = await api.fetchUser();
      set({ user, initialized: true });

      if (user) {
        await hydrateAppData(set);
      }
    } catch (err) {
      console.error(err);
      set({ user: null });
      void clearSessionToken();
    } finally {
      set({ initialized: true, loading: false });
    }
  },
});
