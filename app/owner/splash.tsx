import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function OwnerSplash() {
  const router = useRouter();

  return (
    <View
      className="flex-1 justify-center items-center px-8"
      style={{ backgroundColor: Colors.owner.background }}
    >
      <View className="items-center mb-12">
        <Text
          className="text-5xl font-bold text-center mb-4"
          style={{ color: Colors.owner.primary }}
        >
          DogWalker
        </Text>
        <Text
          className="text-xl text-center"
          style={{ color: Colors.owner.textLight }}
        >
          For Dog Owners
        </Text>
      </View>

      <View className="items-center mb-16">
        <Text className="text-lg text-center text-gray-700 mb-2">
          Find trusted, verified dog walkers
        </Text>
        <Text className="text-lg text-center text-gray-700">
          in your neighborhood
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/owner/(onboarding)/welcome")}
        className="rounded-full px-12 py-4 w-full max-w-xs"
        style={{ backgroundColor: Colors.owner.primary }}
        activeOpacity={0.8}
      >
        <Text className="text-white text-lg font-semibold text-center">
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
}
