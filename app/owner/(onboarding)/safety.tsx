import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Safety() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-8">
        <Text
          className="text-4xl font-bold text-center mb-6"
          style={{ color: Colors.owner.primary }}
        >
          Safety First
        </Text>
        <Text className="text-lg text-center text-gray-600 mb-12">
          Your dog's safety is our top priority
        </Text>

        <View className="w-full space-y-6 mb-12">
          <View
            className="p-6 rounded-2xl"
            style={{ backgroundColor: Colors.owner.background }}
          >
            <Text className="text-lg font-semibold mb-2">Verified Walkers</Text>
            <Text className="text-gray-600">
              All walkers are background checked and verified
            </Text>
          </View>

          <View
            className="p-6 rounded-2xl"
            style={{ backgroundColor: Colors.owner.background }}
          >
            <Text className="text-lg font-semibold mb-2">GPS Tracking</Text>
            <Text className="text-gray-600">
              Track your dog's walk in real-time
            </Text>
          </View>

          <View
            className="p-6 rounded-2xl"
            style={{ backgroundColor: Colors.owner.background }}
          >
            <Text className="text-lg font-semibold mb-2">
              Insurance Coverage
            </Text>
            <Text className="text-gray-600">
              All walks are covered by insurance
            </Text>
          </View>
        </View>
      </View>

      <View className="px-8 pb-12">
        <TouchableOpacity
          onPress={() => router.push("/owner/(onboarding)/get-started")}
          className="rounded-full py-4"
          style={{ backgroundColor: Colors.owner.primary }}
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
            style={{ backgroundColor: Colors.owner.primary }}
          />
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
        </View>
      </View>
    </View>
  );
}
