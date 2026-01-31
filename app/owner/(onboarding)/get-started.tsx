import { Colors } from "@/constants/theme";
import { saveOnboardingCompleted } from "@/utils/storage";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function GetStarted() {
  const router = useRouter();

  const handleGetStarted = async () => {
    await saveOnboardingCompleted("owner");
    router.replace("/owner/(auth)/signup");
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-8">
        <Text
          className="text-4xl font-bold text-center mb-6"
          style={{ color: Colors.owner.primary }}
        >
          Ready to Get Started?
        </Text>
        <Text className="text-lg text-center text-gray-600 mb-12">
          Create your account and find the perfect walker for your dog
        </Text>

        <View
          className="w-40 h-40 rounded-full mb-12"
          style={{ backgroundColor: Colors.owner.background }}
        >
          {/* Add illustration here */}
        </View>
      </View>

      <View className="px-8 pb-12">
        <TouchableOpacity
          onPress={handleGetStarted}
          className="rounded-full py-4"
          style={{ backgroundColor: Colors.owner.primary }}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Create Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/owner/(auth)/login")}
          className="rounded-full py-4 mt-4"
        >
          <Text className="text-center text-gray-600 text-base">
            Already have an account?{" "}
            <Text
              style={{ color: Colors.owner.primary }}
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
            style={{ backgroundColor: Colors.owner.primary }}
          />
        </View>
      </View>
    </View>
  );
}
