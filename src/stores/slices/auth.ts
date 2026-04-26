import * as api from "@/shared/api/client";
import { loadAppData } from "@/shared/app/loadAppData";
import {
  clearSessionToken,
  readSessionToken,
  writeSessionToken,
} from "@/platform/session";
import type { AuthSlice, StoreSlice } from "@/stores/types";

export const createAuthSlice: StoreSlice<AuthSlice> = (set, get) => ({
  login: async (tgData: string) => {
    set({ loading: true });
    try {
      const token = "";
      const user = await api.login(tgData);

      set({ user, token });
      writeSessionToken(token);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  signup: async (email, password, name, referrerId, referrerLinkId) => {
    console.log(email, password, name, referrerId, referrerLinkId);
  },

  signOut: async () => {},

  updateUser: async (patch) => {
    const updated = await api.updateUser(patch);
    set({ user: updated });
  },

  passwordReset: async (email) => {
    console.log(email);
  },

  logout: () => {
    set({ user: null, token: null, goals: [], rewards: [], reminders: [] });
    clearSessionToken();
  },

  refreshUser: async () => {
    const token = get().token || readSessionToken();
    if (!token) return;

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
