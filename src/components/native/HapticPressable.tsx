import { forwardRef, type ElementRef } from "react";
import { Pressable as NativePressable, type PressableProps } from "react-native";

import { triggerSelectionHaptic } from "@/platform/haptics";

type HapticPressableProps = PressableProps & {
  disableHaptics?: boolean;
};

export const HapticPressable = forwardRef<ElementRef<typeof NativePressable>, HapticPressableProps>(function HapticPressable(
  { onPress, disableHaptics = false, disabled, ...props },
  ref
) {
  const handlePress: PressableProps["onPress"] = (event) => {
    if (!disableHaptics && !disabled) {
      void triggerSelectionHaptic();
    }

    onPress?.(event);
  };

  return <NativePressable ref={ref} {...props} disabled={disabled} onPress={handlePress} />;
});
