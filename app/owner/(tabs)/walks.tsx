import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function OwnerWalks() {
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "past">(
    "upcoming",
  );
  const [selectedDate, setSelectedDate] = useState(2); // Today
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Pulse animation for live tracking
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const weekDays = [
    { day: "Mon", date: 20, isToday: false },
    { day: "Tue", date: 21, isToday: false },
    { day: "Today", date: 22, isToday: true },
    { day: "Thu", date: 23, isToday: false },
    { day: "Fri", date: 24, isToday: false },
  ];

  const upcomingWalks = [
    {
      id: 1,
      walker: "Sarah Johnson",
      rating: 4.9,
      reviews: 247,
      dog: "Buddy",
      time: "3:00 PM",
      duration: 30,
      status: "in-progress" as const,
      location: "Central Park Area",
    },
    {
      id: 2,
      walker: "Mike Chen",
      rating: 4.8,
      reviews: 189,
      dog: "Max",
      time: "5:30 PM",
      duration: 45,
      status: "confirmed" as const,
      location: "Riverside Walk",
    },
  ];

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: Colors.owner.background }}
    >
      {/* Header */}
      <View className="px-6 pt-16 pb-4">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-3xl font-bold text-gray-900">Your Walks</Text>
          <TouchableOpacity
            className="w-11 h-11 items-center justify-center rounded-full"
            style={{ backgroundColor: "white" }}
          >
            <Ionicons
              name="calendar-outline"
              size={22}
              color={Colors.owner.primary}
            />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-600">Track active and upcoming walks</Text>
      </View>

      {/* Calendar Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        {weekDays.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedDate(index)}
            className="items-center justify-center mr-3 rounded-2xl"
            style={{
              width: 70,
              height: 85,
              backgroundColor: item.isToday ? Colors.owner.primary : "white",
            }}
          >
            <Text
              className="text-sm font-medium mb-1"
              style={{ color: item.isToday ? "white" : "#6b7280" }}
            >
              {item.day}
            </Text>
            <Text
              className="text-2xl font-bold"
              style={{ color: item.isToday ? "white" : "#111827" }}
            >
              {item.date}
            </Text>
            {item.isToday && (
              <View
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: "#ef4444" }}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tab Switcher */}
      <View className="px-6 mb-4">
        <View className="flex-row bg-white rounded-2xl p-1">
          <TouchableOpacity
            onPress={() => setSelectedTab("upcoming")}
            className="flex-1 py-3 rounded-xl items-center"
            style={{
              backgroundColor:
                selectedTab === "upcoming"
                  ? Colors.owner.primary
                  : "transparent",
            }}
          >
            <Text
              className="font-semibold"
              style={{
                color: selectedTab === "upcoming" ? "white" : "#6b7280",
              }}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab("past")}
            className="flex-1 py-3 rounded-xl items-center"
            style={{
              backgroundColor:
                selectedTab === "past" ? Colors.owner.primary : "transparent",
            }}
          >
            <Text
              className="font-semibold"
              style={{
                color: selectedTab === "past" ? "white" : "#6b7280",
              }}
            >
              Past
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Walk Cards */}
      <Animated.View style={{ opacity: fadeAnim }} className="px-6 pb-6">
        {upcomingWalks.map((walk) => (
          <View
            key={walk.id}
            className="bg-white rounded-3xl p-5 mb-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            {/* Status Banner */}
            {walk.status === "in-progress" && (
              <View
                className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                style={{ backgroundColor: "#10b981" }}
              />
            )}

            {/* Walker Info */}
            <View className="flex-row items-center mb-4">
              <View
                className="w-14 h-14 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: Colors.owner.background }}
              >
                <Ionicons
                  name="person"
                  size={26}
                  color={Colors.owner.primary}
                />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-lg text-gray-900">
                  {walk.walker}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={14} color="#fbbf24" />
                  <Text className="text-gray-600 text-sm ml-1">
                    {walk.rating} ({walk.reviews})
                  </Text>
                </View>
              </View>
              {walk.status === "in-progress" && (
                <Animated.View
                  style={{
                    transform: [{ scale: pulseAnim }],
                    backgroundColor: "#10b981",
                  }}
                  className="px-3 py-1.5 rounded-full"
                >
                  <Text className="text-white text-xs font-bold">Live</Text>
                </Animated.View>
              )}
              {walk.status === "confirmed" && (
                <View
                  className="px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: Colors.owner.background }}
                >
                  <Text
                    className="text-xs font-bold"
                    style={{ color: Colors.owner.primary }}
                  >
                    Confirmed
                  </Text>
                </View>
              )}
            </View>

            {/* Walk Details */}
            <View className="space-y-3 mb-4">
              <View className="flex-row items-center">
                <View
                  className="w-9 h-9 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: Colors.owner.background }}
                >
                  <Ionicons name="paw" size={16} color={Colors.owner.primary} />
                </View>
                <Text className="text-gray-700 font-medium flex-1">
                  {walk.dog}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View
                  className="w-9 h-9 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: Colors.owner.background }}
                >
                  <Ionicons
                    name="time"
                    size={16}
                    color={Colors.owner.primary}
                  />
                </View>
                <Text className="text-gray-700 flex-1">
                  {walk.time} • {walk.duration} min
                </Text>
              </View>

              <View className="flex-row items-center">
                <View
                  className="w-9 h-9 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: Colors.owner.background }}
                >
                  <Ionicons
                    name="location"
                    size={16}
                    color={Colors.owner.primary}
                  />
                </View>
                <Text className="text-gray-700 flex-1">{walk.location}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              {walk.status === "in-progress" ? (
                <>
                  <TouchableOpacity
                    className="flex-1 py-3.5 rounded-xl items-center"
                    style={{ backgroundColor: Colors.owner.primary }}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="navigate" size={18} color="white" />
                      <Text className="text-white font-bold ml-2">
                        Track Live
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-12 h-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: Colors.owner.background }}
                  >
                    <Ionicons
                      name="chatbubble"
                      size={18}
                      color={Colors.owner.primary}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    className="flex-1 py-3.5 rounded-xl items-center border-2"
                    style={{ borderColor: Colors.owner.primary }}
                  >
                    <Text
                      className="font-bold"
                      style={{ color: Colors.owner.primary }}
                    >
                      Details
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 py-3.5 rounded-xl items-center"
                    style={{ backgroundColor: Colors.owner.background }}
                  >
                    <Text
                      className="font-bold"
                      style={{ color: Colors.owner.primary }}
                    >
                      Message
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        ))}
      </Animated.View>
    </ScrollView>
  );
}
