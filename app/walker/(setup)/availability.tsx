import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Availability() {
  const router = useRouter();

  const handleContinue = async () => {
    // TODO: Save availability to backend
    router.push("/walker/(setup)/verification");
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const timeSlots = [
    "Morning (6AM-12PM)",
    "Afternoon (12PM-6PM)",
    "Evening (6PM-9PM)",
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-8 py-6">
        {/* Progress Indicator */}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-2 rounded-full bg-gray-200" />
          <View className="flex-1 h-2 rounded-full bg-gray-200 ml-2" />
          <View
            className="flex-1 h-2 rounded-full ml-2"
            style={{ backgroundColor: Colors.walker.primary }}
          />
          <View className="flex-1 h-2 rounded-full bg-gray-200 ml-2" />
        </View>

        <Text className="text-xl font-semibold mb-2">Your Availability</Text>
        <Text className="text-gray-600 mb-6">Step 3 of 4</Text>

        <Text className="text-sm text-gray-600 mb-6">
          Select the days and times you're available to walk dogs. You can
          always update this later.
        </Text>

        {days.map((day, dayIndex) => (
          <View key={dayIndex} className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-semibold text-base">{day}</Text>
              <TouchableOpacity
                className="px-4 py-2 rounded-full border"
                style={{ borderColor: Colors.walker.primary }}
              >
                <Text
                  className="text-sm"
                  style={{ color: Colors.walker.primary }}
                >
                  Set All
                </Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-2">
              {timeSlots.map((slot, slotIndex) => (
                <TouchableOpacity
                  key={slotIndex}
                  className="border border-gray-300 rounded-xl p-4 flex-row items-center justify-between"
                >
                  <Text className="text-gray-700">{slot}</Text>
                  <View className="w-6 h-6 border-2 border-gray-300 rounded" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View className="px-8 pb-8 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleContinue}
          className="rounded-full py-4 mt-4"
          style={{ backgroundColor: Colors.walker.primary }}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
