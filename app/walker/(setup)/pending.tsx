import { Colors } from "@/constants/theme";
import { saveSetupCompleted } from "@/utils/storage";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Pending() {
  const router = useRouter();

  const handleContinue = async () => {
    // Save setup as completed even though pending approval
    await saveSetupCompleted("walker");
    router.replace("/walker/(tabs)/home");
  };

  return (
    <View className="flex-1 bg-white justify-center px-8">
      <View className="items-center mb-12">
        <View
          className="w-32 h-32 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: Colors.walker.background }}
        >
          <Text className="text-6xl">⏳</Text>
        </View>

        <Text
          className="text-3xl font-bold text-center mb-4"
          style={{ color: Colors.walker.primary }}
        >
          Verification Pending
        </Text>
        <Text className="text-lg text-center text-gray-600 mb-8">
          Your application is being reviewed
        </Text>
      </View>

      <View className="space-y-4 mb-12">
        <View
          className="p-6 rounded-2xl"
          style={{ backgroundColor: Colors.walker.background }}
        >
          <Text className="font-semibold text-base mb-2">
            What happens next?
          </Text>
          <Text className="text-gray-600">
            Our team will review your application and verify your documents.
            This typically takes 1-2 business days.
          </Text>
        </View>

        <View
          className="p-6 rounded-2xl"
          style={{ backgroundColor: Colors.walker.background }}
        >
          <Text className="font-semibold text-base mb-2">We'll notify you</Text>
          <Text className="text-gray-600">
            You'll receive an email once your application is approved and you're
            ready to start walking!
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleContinue}
        className="rounded-full py-4"
        style={{ backgroundColor: Colors.walker.primary }}
        activeOpacity={0.8}
      >
        <Text className="text-white text-lg font-semibold text-center">
          View Dashboard
        </Text>
      </TouchableOpacity>

      <Text className="text-center text-gray-500 text-sm mt-6">
        Questions? Contact support@dogwalker.com
      </Text>
    </View>
  );
}
