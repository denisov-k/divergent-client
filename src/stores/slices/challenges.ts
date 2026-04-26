import * as api from "@/shared/api/client";
import { loadAppData } from "@/shared/app/loadAppData";
import { downloadReportFile } from "@/platform/files";
import { openTelegramInvoice } from "@/platform/telegram";
import type { AppStoreActions, StoreSlice } from "@/stores/types";

type ChallengesSlice = Pick<
  AppStoreActions,
  | "addChallenge"
  | "updateChallenge"
  | "getLeaderboard"
  | "acceptChallenge"
  | "leaveChallenge"
  | "payChallenge"
  | "redirectToTelegram"
  | "getReports"
  | "getParticipants"
  | "kickParticipant"
  | "sendMessageToParticipants"
  | "downloadReport"
>;

export const createChallengesSlice: StoreSlice<ChallengesSlice> = (set, get) => ({
  addChallenge: async (data) => {
    set({ loading: true });
    try {
      const challenge = await api.createChallenge(data);
      set({ challenges: [...get().challenges, challenge] });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateChallenge: async (data) => {
    set({ loading: true });
    try {
      const updated = await api.updateChallenge(data);
      const normalized = {
        ...updated,
        goals: updated.goals.map((challengeGoal) => challengeGoal.goal),
      };

      set({
        challenges: get().challenges.map((challenge) =>
          challenge.id === normalized.id ? normalized : challenge
        ),
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  getLeaderboard: async (id) => {
    set({ loading: true });
    try {
      return await api.fetchLeaderboard(id);
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      set({ loading: false });
    }
  },

  acceptChallenge: async (challenge) => {
    set({ loading: true });
    try {
      await api.acceptChallenge(challenge.id);
      await get().initialize();
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  leaveChallenge: async (id) => {
    set({ loading: true });
    try {
      await api.leaveChallenge(id);
      await get().initialize();
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  payChallenge: async (challenge, method) => {
    set({ loading: true });
    try {
      const res = await api.payChallenge(challenge.id, method);
      get().redirectToTelegram(res.invoiceLink);
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  redirectToTelegram: (link) => {
    void openTelegramInvoice(link, async () => {
      set(await loadAppData());
    });
  },

  getReports: async (challengeId) => {
    set({ loading: true });
    try {
      return await api.getReports(challengeId);
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      set({ loading: false });
    }
  },

  getParticipants: async (challengeId) => {
    set({ loading: true });
    try {
      return await api.getParticipants(challengeId);
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      set({ loading: false });
    }
  },

  kickParticipant: async (challengeId, userId) => {
    set({ loading: true });
    try {
      await api.kickParticipant(challengeId, userId);
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  sendMessageToParticipants: async (challengeId, text) => {
    set({ loading: true });
    try {
      await api.sendMessageToParticipants(challengeId, text);
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  downloadReport: async (report) => {
    try {
      await downloadReportFile(report);
    } catch (err) {
      console.error("Download failed", err);
    }
  },
});
