import { Text, TextInput, View } from "react-native";

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
      <Text style={{ fontSize: 14, fontWeight: "600", color: "#334155" }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        editable={editable}
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: "#cbd5e1",
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          backgroundColor: editable ? "#ffffff" : "#f8fafc",
          color: "#0f172a",
        }}
        placeholderTextColor="#94a3b8"
      />
    </View>
  );
}
