import * as api from "@/shared/api/client";
import { loadAppData } from "@/shared/app/loadAppData";
import { clearSessionToken } from "@/platform/session";
import type { AuthSlice, StoreSlice } from "@/stores/types";

async function finalizeAuthenticatedState(
  set: Parameters<StoreSlice<AuthSlice>>[0]
) {
  const user = await api.fetchUser();

  set({
    user,
    token: null,
    ...(await loadAppData()),
    initialized: true,
  });
  clearSessionToken();
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

  passwordReset: async (email) => {
    console.log(email);
    throw new Error("Password reset is not implemented yet");
  },

  logout: () => {
    set({ user: null, token: null, goals: [], rewards: [], reminders: [] });
    clearSessionToken();
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

  initialize: async () => {
    set({ loading: true });
    try {
      const user = await api.fetchUser();
      set({ user });

      if (user) {
        set(await loadAppData());
      }
    } catch (err) {
      console.error(err);
      set({ user: null });
    } finally {
      set({ initialized: true, loading: false });
    }
  },
});
