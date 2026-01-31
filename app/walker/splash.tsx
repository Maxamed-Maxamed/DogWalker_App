import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function WalkerSplash() {
  const router = useRouter();

  return (
    <View
      className="flex-1 justify-center items-center px-8"
      style={{ backgroundColor: Colors.walker.background }}
    >
      <View className="items-center mb-12">
        <Text
          className="text-5xl font-bold text-center mb-4"
          style={{ color: Colors.walker.primary }}
        >
          DogWalker
        </Text>
        <Text
          className="text-xl text-center"
          style={{ color: Colors.walker.textLight }}
        >
          For Dog Walkers
        </Text>
      </View>

      <View className="items-center mb-16">
        <Text className="text-lg text-center text-gray-700 mb-2">
          Start earning by walking dogs
        </Text>
        <Text className="text-lg text-center text-gray-700">
          in your neighborhood
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/walker/(onboarding)/welcome")}
        className="rounded-full px-12 py-4 w-full max-w-xs"
        style={{ backgroundColor: Colors.walker.primary }}
        activeOpacity={0.8}
      >
        <Text className="text-white text-lg font-semibold text-center">
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
}
