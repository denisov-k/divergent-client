import { Component, type ErrorInfo, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { SurfaceCard } from "@/components/native/SurfaceCard";
import { appPalette } from "@/theme/palette";

type Props = {
  children: ReactNode;
  title: string;
  message: string;
  resetLabel: string;
  onReset: () => void;
};

type State = {
  hasError: boolean;
};

export class NativeScreenErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Native screen render failed", {
      error,
      componentStack: errorInfo.componentStack,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View style={{ flex: 1, paddingHorizontal: 8, paddingVertical: 8, backgroundColor: appPalette.surface.background }}>
        <SurfaceCard gap={12} padding={16} radius={12}>
          <Text style={{ color: appPalette.semantic.textStrong, fontSize: 16, fontWeight: "500", lineHeight: 24, fontFamily: "Montserrat" }}>
            {this.props.title}
          </Text>
          <Text style={{ color: appPalette.semantic.textMuted, fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Montserrat" }}>
            {this.props.message}
          </Text>
          <Pressable
            onPress={this.handleReset}
            style={{
              alignSelf: "flex-start",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: appPalette.semantic.infoBorder,
              backgroundColor: appPalette.semantic.infoSurface,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: appPalette.semantic.infoText, fontSize: 12, fontWeight: "500", lineHeight: 18, fontFamily: "Montserrat" }}>
              {this.props.resetLabel}
            </Text>
          </Pressable>
        </SurfaceCard>
      </View>
    );
  }
}
