import { useAppStore } from "@/stores/useAppStore";

export function useFrensScreen() {
  const { friends, addFriend, loading } = useAppStore();

  return {
    friends,
    addFriend,
    loading,
  };
}
