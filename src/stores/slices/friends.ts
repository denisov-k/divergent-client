import * as api from "@/shared/api/client";
import type { AppStoreActions, StoreSlice } from "@/stores/types";

type FriendsSlice = Pick<AppStoreActions, "addFriend">;

export const createFriendsSlice: StoreSlice<FriendsSlice> = (set, get) => ({
  addFriend: async (friend) => {
    set({ loading: true });
    try {
      const createdFriend = await api.createFriend(friend);
      set({ friends: [...get().friends, createdFriend] });
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },
});
