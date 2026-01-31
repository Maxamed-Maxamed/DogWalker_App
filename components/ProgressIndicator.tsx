import { Text, View } from "react-native";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  color?: string;
  label?: string;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  color = "#0a7ea4",
  label,
}: ProgressIndicatorProps) {
  return (
    <View className="mb-8">
      <View className="flex-row items-center mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            className={`flex-1 h-2 rounded-full ${index > 0 ? "ml-2" : ""}`}
            style={{
              backgroundColor: index < currentStep ? color : "#E5E7EB",
            }}
          />
        ))}
      </View>
      {label && <Text className="text-gray-600 text-sm">{label}</Text>}
    </View>
  );
}
