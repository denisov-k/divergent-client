import { useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, Dimensions, PanResponder, View } from "react-native";

import { appPalette } from "@/theme/palette";

export function useSheetDragToClose(open: boolean, onClose: () => void) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!open) {
      return;
    }

    translateY.stopAnimation();
    translateY.setValue(0);
  }, [open, translateY]);

  const closeAnimated = useCallback(() => {
    Animated.timing(translateY, {
      toValue: Dimensions.get("window").height,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      translateY.setValue(0);
      if (finished) {
        onClose();
      }
    });
  }, [onClose, translateY]);

  const resetAnimated = useCallback(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [translateY]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 6 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onMoveShouldSetPanResponderCapture: (_, gestureState) => gestureState.dy > 6 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderMove: (_, gestureState) => {
          translateY.setValue(Math.max(0, gestureState.dy));
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 90 || gestureState.vy > 1.2) {
            closeAnimated();
            return;
          }

          resetAnimated();
        },
        onPanResponderTerminate: () => {
          resetAnimated();
        },
      }),
    [closeAnimated, resetAnimated, translateY],
  );

  return {
    sheetStyle: {
      transform: [{ translateY }],
    },
    headerPanHandlers: panResponder.panHandlers,
  };
}

export function SheetDragHandle() {
  return (
    <View style={{ alignItems: "center", paddingTop: 2, paddingBottom: 10 }}>
      <View
        style={{
          width: 42,
          height: 4,
          borderRadius: 999,
          backgroundColor: appPalette.semantic.borderSubtle,
        }}
      />
    </View>
  );
}
