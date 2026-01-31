import { Colors } from "@/constants/theme";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function OwnerWalks() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-16 pb-6">
        <Text className="text-3xl font-bold mb-2 text-gray-900">
          Your Walks
        </Text>
        <Text className="text-gray-600 mb-6">
          Manage and track your scheduled walks
        </Text>

        {/* Filter Tabs */}
        <View className="flex-row mb-6 border-b border-gray-200">
          <TouchableOpacity
            className="flex-1 pb-3 border-b-2"
            style={{ borderBottomColor: Colors.owner.primary }}
          >
            <Text
              className="text-center font-semibold"
              style={{ color: Colors.owner.primary }}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 pb-3">
            <Text className="text-center text-gray-500">Past</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Walks */}
        <View>
          {[1, 2].map((i) => (
            <View
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-4 mb-4"
            >
              <View className="flex-row items-center mb-3">
                <View
                  className="w-12 h-12 rounded-full mr-3"
                  style={{ backgroundColor: Colors.owner.background }}
                />
                <View className="flex-1">
                  <Text className="font-semibold text-lg">Walker Name</Text>
                  <Text className="text-gray-600 text-sm">⭐ 4.9</Text>
                </View>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: Colors.owner.background }}
                >
                  <Text
                    className="text-xs font-medium"
                    style={{ color: Colors.owner.primary }}
                  >
                    Upcoming
                  </Text>
                </View>
              </View>

              <View className="border-t border-gray-100 pt-3">
                <View className="flex-row items-center mb-2">
                  <Text className="text-gray-600 mr-2">📅</Text>
                  <Text className="text-gray-700">Today at 3:00 PM</Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Text className="text-gray-600 mr-2">🐕</Text>
                  <Text className="text-gray-700">Buddy</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-gray-600 mr-2">⏱️</Text>
                  <Text className="text-gray-700">30 minutes</Text>
                </View>
              </View>

              <View className="flex-row mt-4 space-x-2">
                <TouchableOpacity
                  className="flex-1 border rounded-lg py-3"
                  style={{ borderColor: Colors.owner.primary }}
                >
                  <Text
                    className="text-center font-semibold"
                    style={{ color: Colors.owner.primary }}
                  >
                    View Details
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 rounded-lg py-3"
                  style={{ backgroundColor: Colors.owner.primary }}
                >
                  <Text className="text-white text-center font-semibold">
                    Track Walk
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Empty State */}
        {/* <View className="items-center py-12">
          <Text className="text-5xl mb-4">📅</Text>
          <Text className="text-lg font-semibold text-gray-900 mb-2">No upcoming walks</Text>
          <Text className="text-gray-600 text-center mb-6">
            Schedule a walk with a trusted walker
          </Text>
          <TouchableOpacity
            className="px-8 py-3 rounded-full"
            style={{ backgroundColor: Colors.owner.primary }}
          >
            <Text className="text-white font-semibold">Book a Walk</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </ScrollView>
  );
}
