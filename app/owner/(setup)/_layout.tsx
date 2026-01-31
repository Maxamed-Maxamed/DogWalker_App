import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function OwnerSetupLayout() {
  return (
    <>
      <View className="bg-white pt-16 px-8 pb-4">
        <Text
          className="text-2xl font-bold mb-4"
          style={{ color: Colors.owner.primary }}
        >
          Complete Your Profile
        </Text>
      </View>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="personal-info" />
        <Stack.Screen name="add-dog" />
        <Stack.Screen name="location" />
      </Stack>
    </>
  );
}
