import { createContext, useContext } from "react";

type NativeNavigationValue = {
  navigateToPath: (path: string) => void;
};

const NativeNavigationContext = createContext<NativeNavigationValue | null>(null);

export function NativeNavigationProvider({
  value,
  children,
}: {
  value: NativeNavigationValue;
  children: React.ReactNode;
}) {
  return <NativeNavigationContext.Provider value={value}>{children}</NativeNavigationContext.Provider>;
}

export function useNativeNavigation() {
  const value = useContext(NativeNavigationContext);

  if (!value) {
    throw new Error("useNativeNavigation must be used inside NativeNavigationProvider");
  }

  return value;
}
