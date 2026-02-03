import type { TextInputProps } from "react-native";
import { Text, TextInput, View } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
}

export function Input({
  label,
  helperText,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      )}
      <TextInput
        className={`border rounded-xl px-4 py-3 text-base ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}
      {helperText && !error && (
        <Text className="text-xs text-gray-500 mt-1">{helperText}</Text>
      )}
    </View>
  );
}
