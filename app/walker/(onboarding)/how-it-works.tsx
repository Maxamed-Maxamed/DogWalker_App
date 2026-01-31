import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HowItWorks() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-8">
        <Text
          className="text-4xl font-bold text-center mb-6"
          style={{ color: Colors.walker.primary }}
        >
          How It Works
        </Text>

        <View className="w-full space-y-6 mb-12">
          <View className="flex-row items-start">
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: Colors.walker.background }}
            >
              <Text
                className="text-xl font-bold"
                style={{ color: Colors.walker.primary }}
              >
                1
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold mb-1">Get Verified</Text>
              <Text className="text-gray-600">
                Complete background check and verification
              </Text>
            </View>
          </View>

          <View className="flex-row items-start">
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: Colors.walker.background }}
            >
              <Text
                className="text-xl font-bold"
                style={{ color: Colors.walker.primary }}
              >
                2
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold mb-1">
                Accept Requests
              </Text>
              <Text className="text-gray-600">
                Choose walks that fit your schedule
              </Text>
            </View>
          </View>

          <View className="flex-row items-start">
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: Colors.walker.background }}
            >
              <Text
                className="text-xl font-bold"
                style={{ color: Colors.walker.primary }}
              >
                3
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold mb-1">Get Paid</Text>
              <Text className="text-gray-600">
                Earn money for every walk completed
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="px-8 pb-12">
        <TouchableOpacity
          onPress={() => router.push("/walker/(onboarding)/requirements")}
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
          <View
            className="w-2 h-2 rounded-full mx-1"
            style={{ backgroundColor: Colors.walker.primary }}
          />
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
        </View>
      </View>
    </View>
  );
}
