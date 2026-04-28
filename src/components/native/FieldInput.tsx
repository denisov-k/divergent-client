import { Text, TextInput, View } from "react-native";

import { appPalette } from "@/theme/palette";

export function FieldInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  editable?: boolean;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 14, fontWeight: "600", color: appPalette.semantic.text }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        editable={editable}
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: appPalette.semantic.borderStrong,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          backgroundColor: editable ? appPalette.surface.background : appPalette.ui.inputBackground,
          color: appPalette.semantic.textStrong,
        }}
        placeholderTextColor={appPalette.semantic.textSubtle}
      />
    </View>
  );
}
