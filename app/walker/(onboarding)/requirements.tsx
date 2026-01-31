import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Requirements() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-8">
        <Text
          className="text-4xl font-bold text-center mb-6"
          style={{ color: Colors.walker.primary }}
        >
          Requirements
        </Text>
        <Text className="text-lg text-center text-gray-600 mb-12">
          What you need to become a walker
        </Text>

        <View className="w-full space-y-4 mb-12">
          <View
            className="p-6 rounded-2xl"
            style={{ backgroundColor: Colors.walker.background }}
          >
            <Text className="text-lg font-semibold mb-2">✓ 18+ Years Old</Text>
            <Text className="text-gray-600">
              Must be at least 18 years of age
            </Text>
          </View>

          <View
            className="p-6 rounded-2xl"
            style={{ backgroundColor: Colors.walker.background }}
          >
            <Text className="text-lg font-semibold mb-2">✓ Love for Dogs</Text>
            <Text className="text-gray-600">
              Experience with and passion for dogs
            </Text>
          </View>

          <View
            className="p-6 rounded-2xl"
            style={{ backgroundColor: Colors.walker.background }}
          >
            <Text className="text-lg font-semibold mb-2">
              ✓ Background Check
            </Text>
            <Text className="text-gray-600">
              Pass a background verification
            </Text>
          </View>

          <View
            className="p-6 rounded-2xl"
            style={{ backgroundColor: Colors.walker.background }}
          >
            <Text className="text-lg font-semibold mb-2">✓ Smartphone</Text>
            <Text className="text-gray-600">
              For GPS tracking and communication
            </Text>
          </View>
        </View>
      </View>

      <View className="px-8 pb-12">
        <TouchableOpacity
          onPress={() => router.push("/walker/(onboarding)/get-started")}
          className="rounded-full py-4"
          style={{ backgroundColor: Colors.walker.primary }}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Continue
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
          <View
            className="w-2 h-2 rounded-full mx-1"
            style={{ backgroundColor: Colors.walker.primary }}
          />
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
        </View>
      </View>
    </View>
  );
}
