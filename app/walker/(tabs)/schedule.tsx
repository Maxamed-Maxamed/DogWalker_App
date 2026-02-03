import { Colors } from "@/constants/theme";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function WalkerSchedule() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-16 pb-6">
        <Text className="text-3xl font-bold mb-2 text-gray-900">
          Your Schedule
        </Text>
        <Text className="text-gray-600 mb-6">Manage your upcoming walks</Text>

        {/* Date Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          {[
            "Mon 27",
            "Tue 28",
            "Wed 29",
            "Thu 30",
            "Fri 31",
            "Sat 1",
            "Sun 2",
          ].map((date, index) => (
            <TouchableOpacity
              key={index}
              className={`mr-3 px-6 py-4 rounded-xl ${index === 3 ? "bg-" : "border border-gray-300"}`}
              style={
                index === 3 ? { backgroundColor: Colors.walker.primary } : {}
              }
            >
              <Text
                className={`text-center font-semibold ${index === 3 ? "text-white" : "text-gray-700"}`}
              >
                {date}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Today's Walks */}
        <View className="mb-4">
          <Text className="text-lg font-semibold mb-4">
            Today - Thursday, Jan 30
          </Text>

          {[1, 2].map((i) => (
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
                  className="font-bold"
                  style={{ color: Colors.walker.primary }}
                >
                  $25
                </Text>
              </View>

              <View className="border-t border-gray-100 pt-3 mb-3">
                <View className="flex-row items-center mb-2">
                  <Text className="text-gray-600 mr-2">🕐</Text>
                  <Text className="text-gray-700 font-semibold">
                    {i === 1 ? "2:00 PM - 2:30 PM" : "4:00 PM - 4:30 PM"}
                  </Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Text className="text-gray-600 mr-2">🐕</Text>
                  <Text className="text-gray-700">
                    Golden Retriever · Buddy
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-gray-600 mr-2">📍</Text>
                  <Text className="text-gray-700">
                    123 Main St, San Francisco
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                className="rounded-lg py-3"
                style={{ backgroundColor: Colors.walker.primary }}
              >
                <Text className="text-white text-center font-semibold">
                  {i === 1 ? "Start Walk" : "View Details"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View className="flex-row space-x-4 mt-4">
          <View
            className="flex-1 p-4 rounded-xl"
            style={{ backgroundColor: Colors.walker.background }}
          >
            <Text
              className="text-2xl font-bold mb-1"
              style={{ color: Colors.walker.primary }}
            >
              12
            </Text>
            <Text className="text-gray-600 text-sm">This Week</Text>
          </View>
          <View
            className="flex-1 p-4 rounded-xl"
            style={{ backgroundColor: Colors.walker.background }}
          >
            <Text
              className="text-2xl font-bold mb-1"
              style={{ color: Colors.walker.primary }}
            >
              48
            </Text>
            <Text className="text-gray-600 text-sm">This Month</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
