import { Colors } from "@/constants/theme";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function WalkerMessages() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-16 pb-6">
        <Text className="text-3xl font-bold mb-6 text-gray-900">Messages</Text>

        {/* Conversations List */}
        <View>
          {[1, 2, 3].map((i) => (
            <TouchableOpacity
              key={i}
              className="flex-row items-center py-4 border-b border-gray-100"
            >
              <View
                className="w-14 h-14 rounded-full mr-4"
                style={{ backgroundColor: Colors.walker.background }}
              />
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="font-semibold text-lg">Owner Name</Text>
                  <Text className="text-xs text-gray-500">2h ago</Text>
                </View>
                <Text className="text-gray-600" numberOfLines={1}>
                  Thanks for accepting! See you tomorrow at 2PM...
                </Text>
              </View>
              {i === 1 && (
                <View
                  className="ml-2 w-6 h-6 rounded-full items-center justify-center"
                  style={{ backgroundColor: Colors.walker.primary }}
                >
                  <Text className="text-white text-xs font-bold">2</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty State */}
        {/* <View className="items-center py-12">
          <Text className="text-5xl mb-4">💬</Text>
          <Text className="text-lg font-semibold text-gray-900 mb-2">No messages yet</Text>
          <Text className="text-gray-600 text-center">
            Messages from dog owners will appear here
          </Text>
        </View> */}
      </View>
    </ScrollView>
  );
}
