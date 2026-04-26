import { useAppStore } from "@/stores/useAppStore";

export function useFrensScreen() {
  const { friends } = useAppStore();

  return {
    friends,
  };
}
