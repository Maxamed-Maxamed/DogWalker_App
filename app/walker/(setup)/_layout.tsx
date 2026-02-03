import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function WalkerSetupLayout() {
  return (
    <>
      <View className="bg-white pt-16 px-8 pb-4">
        <Text
          className="text-2xl font-bold mb-4"
          style={{ color: Colors.walker.primary }}
        >
          Complete Your Profile
        </Text>
      </View>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="personal-info" />
        <Stack.Screen name="experience" />
        <Stack.Screen name="availability" />
        <Stack.Screen name="verification" />
        <Stack.Screen name="pending" />
      </Stack>
    </>
  );
}
