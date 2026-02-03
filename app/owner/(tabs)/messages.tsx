import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function OwnerMessages() {
  const [searchQuery, setSearchQuery] = useState("");

  const conversations = [
    {
      id: 1,
      walker: "Sarah Johnson",
      lastMessage: "Perfect! See you at 3 PM. Can't wait to take Buddy out! 🐕",
      time: "12m",
      unread: 2,
      online: true,
      avatar: "person",
    },
    {
      id: 2,
      walker: "Mike Chen",
      lastMessage: "Thanks for the booking! I've reviewed the route.",
      time: "2h",
      unread: 0,
      online: true,
      avatar: "person",
    },
    {
      id: 3,
      walker: "Emma Wilson",
      lastMessage: "Great walk today! Max had so much fun at the park 🎾",
      time: "1d",
      unread: 0,
      online: false,
      avatar: "person",
    },
    {
      id: 4,
      walker: "David Lee",
      lastMessage: "I'm available next Tuesday afternoon if that works?",
      time: "2d",
      unread: 0,
      online: false,
      avatar: "person",
    },
  ];

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: Colors.owner.background }}
    >
      {/* Header */}
      <View className="px-6 pt-16 pb-4 bg-white">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-bold text-gray-900">Messages</Text>
          <TouchableOpacity
            className="w-11 h-11 items-center justify-center rounded-full"
            style={{ backgroundColor: Colors.owner.background }}
          >
            <Ionicons
              name="create-outline"
              size={22}
              color={Colors.owner.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          className="flex-row items-center rounded-2xl px-4 py-3"
          style={{ backgroundColor: Colors.owner.background }}
        >
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            placeholder="Search conversations..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-base"
          />
        </View>
      </View>

      {/* Conversations List */}
      <ScrollView className="flex-1">
        <View className="px-4 pt-2">
          {conversations.map((conv, index) => (
            <TouchableOpacity
              key={conv.id}
              className="bg-white rounded-2xl p-4 mb-3"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center">
                {/* Avatar with Online Status */}
                <View className="relative mr-3">
                  <View
                    className="w-14 h-14 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: Colors.owner.background,
                      borderWidth: conv.unread > 0 ? 2 : 0,
                      borderColor: Colors.owner.primary,
                    }}
                  >
                    <Ionicons
                      name={conv.avatar as any}
                      size={28}
                      color={Colors.owner.primary}
                    />
                  </View>
                  {conv.online && (
                    <View
                      className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white"
                      style={{ backgroundColor: "#10b981" }}
                    />
                  )}
                </View>

                {/* Message Content */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text
                      className="font-bold text-base"
                      style={{
                        color: conv.unread > 0 ? "#111827" : "#4b5563",
                      }}
                    >
                      {conv.walker}
                    </Text>
                    <Text className="text-xs text-gray-500">{conv.time}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text
                      className="flex-1 text-sm"
                      numberOfLines={1}
                      style={{
                        color: conv.unread > 0 ? "#374151" : "#9ca3af",
                        fontWeight: conv.unread > 0 ? "600" : "400",
                      }}
                    >
                      {conv.lastMessage}
                    </Text>
                    {conv.unread > 0 && (
                      <View
                        className="ml-2 w-6 h-6 rounded-full items-center justify-center"
                        style={{ backgroundColor: Colors.owner.primary }}
                      >
                        <Text className="text-white text-xs font-bold">
                          {conv.unread}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-8">
          <Text className="text-sm font-semibold text-gray-500 mb-3">
            QUICK ACTIONS
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-white rounded-2xl p-4 items-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: Colors.owner.background }}
              >
                <Ionicons name="star" size={22} color="#fbbf24" />
              </View>
              <Text className="text-xs font-medium text-gray-700">
                Favorites
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-white rounded-2xl p-4 items-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: Colors.owner.background }}
              >
                <Ionicons
                  name="archive"
                  size={22}
                  color={Colors.owner.primary}
                />
              </View>
              <Text className="text-xs font-medium text-gray-700">
                Archived
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-white rounded-2xl p-4 items-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: Colors.owner.background }}
              >
                <Ionicons name="time" size={22} color={Colors.owner.primary} />
              </View>
              <Text className="text-xs font-medium text-gray-700">Recent</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
