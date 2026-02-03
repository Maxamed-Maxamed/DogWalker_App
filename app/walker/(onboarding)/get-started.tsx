import { Colors } from "@/constants/theme";
import { saveOnboardingCompleted } from "@/utils/storage";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function GetStarted() {
  const router = useRouter();

  const handleGetStarted = async () => {
    await saveOnboardingCompleted("walker");
    router.replace("/walker/(auth)/signup");
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-8">
        <Text
          className="text-4xl font-bold text-center mb-6"
          style={{ color: Colors.walker.primary }}
        >
          Ready to Start Earning?
        </Text>
        <Text className="text-lg text-center text-gray-600 mb-12">
          Create your account and complete verification to start walking dogs
        </Text>

        <View
          className="w-40 h-40 rounded-full mb-12"
          style={{ backgroundColor: Colors.walker.background }}
        >
          {/* Add illustration here */}
        </View>

        <View className="w-full space-y-4 mb-8">
          <View className="flex-row items-center">
            <Text
              className="text-2xl mr-3"
              style={{ color: Colors.walker.primary }}
            >
              💰
            </Text>
            <Text className="text-gray-700">Earn $15-30 per walk</Text>
          </View>
          <View className="flex-row items-center">
            <Text
              className="text-2xl mr-3"
              style={{ color: Colors.walker.primary }}
            >
              📅
            </Text>
            <Text className="text-gray-700">Flexible schedule</Text>
          </View>
          <View className="flex-row items-center">
            <Text
              className="text-2xl mr-3"
              style={{ color: Colors.walker.primary }}
            >
              🐕
            </Text>
            <Text className="text-gray-700">Meet adorable dogs</Text>
          </View>
        </View>
      </View>

      <View className="px-8 pb-12">
        <TouchableOpacity
          onPress={handleGetStarted}
          className="rounded-full py-4"
          style={{ backgroundColor: Colors.walker.primary }}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Create Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/walker/(auth)/login")}
          className="rounded-full py-4 mt-4"
        >
          <Text className="text-center text-gray-600 text-base">
            Already have an account?{" "}
            <Text
              style={{ color: Colors.walker.primary }}
              className="font-semibold"
            >
              Log In
            </Text>
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
          <View
            className="w-2 h-2 rounded-full mx-1"
            style={{ backgroundColor: Colors.walker.primary }}
          />
        </View>
      </View>
    </View>
  );
}
