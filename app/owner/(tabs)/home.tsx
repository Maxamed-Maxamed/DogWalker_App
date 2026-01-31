import { Colors } from "@/constants/theme";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function OwnerHome() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-16 pb-6">
        <Text className="text-3xl font-bold mb-2 text-gray-900">
          Find a Walker
        </Text>
        <Text className="text-gray-600 mb-6">
          Book trusted walkers near you
        </Text>

        {/* Search Bar */}
        <TouchableOpacity className="border border-gray-300 rounded-xl px-4 py-4 mb-6">
          <Text className="text-gray-400">Search for walkers...</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">Quick Actions</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              className="flex-1 rounded-xl p-6 items-center"
              style={{ backgroundColor: Colors.owner.background }}
            >
              <Text className="text-3xl mb-2">📅</Text>
              <Text
                className="font-medium"
                style={{ color: Colors.owner.primary }}
              >
                Book Walk
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 rounded-xl p-6 items-center"
              style={{ backgroundColor: Colors.owner.background }}
            >
              <Text className="text-3xl mb-2">⭐</Text>
              <Text
                className="font-medium"
                style={{ color: Colors.owner.primary }}
              >
                Top Rated
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Walkers */}
        <View>
          <Text className="text-lg font-semibold mb-4">Featured Walkers</Text>
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-4 mb-3 flex-row items-center"
            >
              <View
                className="w-16 h-16 rounded-full mr-4"
                style={{ backgroundColor: Colors.owner.background }}
              />
              <View className="flex-1">
                <Text className="font-semibold text-lg">Walker Name</Text>
                <Text className="text-gray-600">⭐ 4.9 · 120 walks</Text>
                <Text className="text-sm text-gray-500">0.5 miles away</Text>
              </View>
              <TouchableOpacity
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: Colors.owner.primary }}
              >
                <Text className="text-white font-semibold">Book</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
