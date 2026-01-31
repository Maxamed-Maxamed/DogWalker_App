import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Welcome() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-8">
        <Text
          className="text-4xl font-bold text-center mb-6"
          style={{ color: Colors.walker.primary }}
        >
          Become a Dog Walker
        </Text>
        <Text className="text-lg text-center text-gray-600 mb-12">
          Earn money while spending time with adorable dogs
        </Text>

        <View
          className="w-32 h-32 rounded-full mb-8"
          style={{ backgroundColor: Colors.walker.background }}
        >
          {/* Add illustration here */}
        </View>
      </View>

      <View className="px-8 pb-12">
        <TouchableOpacity
          onPress={() => router.push("/walker/(onboarding)/how-it-works")}
          className="rounded-full py-4"
          style={{ backgroundColor: Colors.walker.primary }}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Continue
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <View
            className="w-2 h-2 rounded-full mx-1"
            style={{ backgroundColor: Colors.walker.primary }}
          />
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
        </View>
      </View>
    </View>
  );
}
