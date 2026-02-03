import { Colors } from "@/constants/theme";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function WalkerHome() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-16 pb-6">
        <Text className="text-3xl font-bold mb-2 text-gray-900">
          Welcome Back!
        </Text>
        <Text className="text-gray-600 mb-6">Ready to walk some dogs?</Text>

        {/* Earnings Card */}
        <View
          className="rounded-2xl p-6 mb-6"
          style={{ backgroundColor: Colors.walker.primary }}
        >
          <Text className="text-white text-lg mb-2">This Week's Earnings</Text>
          <Text className="text-white text-4xl font-bold mb-4">$245.00</Text>
          <View className="flex-row items-center">
            <Text className="text-white opacity-90">6 walks completed</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">Quick Actions</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              className="flex-1 rounded-xl p-6 items-center"
              style={{ backgroundColor: Colors.walker.background }}
            >
              <Text className="text-3xl mb-2">👁️</Text>
              <Text
                className="font-medium"
                style={{ color: Colors.walker.primary }}
              >
                View Requests
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 rounded-xl p-6 items-center"
              style={{ backgroundColor: Colors.walker.background }}
            >
              <Text className="text-3xl mb-2">📍</Text>
              <Text
                className="font-medium"
                style={{ color: Colors.walker.primary }}
              >
                Start Walk
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pending Requests */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold">Pending Requests</Text>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: Colors.walker.primary }}
            >
              <Text className="text-white font-semibold text-xs">3 New</Text>
            </View>
          </View>

          {[1, 2, 3].map((i) => (
            <View
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
            >
              <View className="flex-row items-center mb-3">
                <View
                  className="w-12 h-12 rounded-full mr-3"
                  style={{ backgroundColor: Colors.walker.background }}
                />
                <View className="flex-1">
                  <Text className="font-semibold text-lg">Owner Name</Text>
                  <Text className="text-gray-600 text-sm">0.3 miles away</Text>
                </View>
                <Text
                  className="font-bold text-lg"
                  style={{ color: Colors.walker.primary }}
                >
                  $25
                </Text>
              </View>

              <View className="border-t border-gray-100 pt-3 mb-3">
                <View className="flex-row items-center mb-2">
                  <Text className="text-gray-600 mr-2">🐕</Text>
                  <Text className="text-gray-700">
                    Golden Retriever · Buddy
                  </Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Text className="text-gray-600 mr-2">📅</Text>
                  <Text className="text-gray-700">Tomorrow at 2:00 PM</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-gray-600 mr-2">⏱️</Text>
                  <Text className="text-gray-700">30 minutes</Text>
                </View>
              </View>

              <View className="flex-row space-x-2">
                <TouchableOpacity
                  className="flex-1 border rounded-lg py-3"
                  style={{ borderColor: Colors.walker.primary }}
                >
                  <Text
                    className="text-center font-semibold"
                    style={{ color: Colors.walker.primary }}
                  >
                    Decline
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 rounded-lg py-3"
                  style={{ backgroundColor: Colors.walker.primary }}
                >
                  <Text className="text-white text-center font-semibold">
                    Accept
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
