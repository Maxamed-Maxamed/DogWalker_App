import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Mock walker data with realistic details
const FEATURED_WALKERS = [
  {
    id: 1,
    name: "Sarah Mitchell",
    rating: 4.9,
    walks: 247,
    distance: 0.3,
    hourlyRate: 25,
    experience: "5+ years",
    specialties: ["Large Dogs", "Puppies"],
    availability: "Available Today",
    verified: true,
    photo: "SM",
  },
  {
    id: 2,
    name: "James Rodriguez",
    rating: 5.0,
    walks: 189,
    distance: 0.5,
    hourlyRate: 30,
    experience: "3 years",
    specialties: ["Small Dogs", "Senior Dogs"],
    availability: "Tomorrow 9 AM",
    verified: true,
    photo: "JR",
  },
  {
    id: 3,
    name: "Emily Chen",
    rating: 4.8,
    walks: 312,
    distance: 0.8,
    hourlyRate: 28,
    experience: "7+ years",
    specialties: ["All Sizes", "Reactive Dogs"],
    availability: "Available Today",
    verified: true,
    photo: "EC",
  },
  {
    id: 4,
    name: "Marcus Thompson",
    rating: 4.9,
    walks: 156,
    distance: 1.2,
    hourlyRate: 22,
    experience: "2 years",
    specialties: ["High Energy", "Training"],
    availability: "Tomorrow 2 PM",
    verified: true,
    photo: "MT",
  },
];

const QUICK_FILTERS = [
  { label: "Available Now", icon: "time-outline" },
  { label: "Top Rated", icon: "star" },
  { label: "Nearby", icon: "location" },
  { label: "Budget Friendly", icon: "cash-outline" },
];

export default function OwnerHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Gradient */}
      <LinearGradient
        colors={[Colors.owner.primary, Colors.owner.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-16 pb-8 px-6"
      >
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1">
            <Text className="text-white text-3xl font-bold mb-1">
              Find Your Walker
            </Text>
            <Text className="text-white/80 text-base">
              Trusted care for your best friend
            </Text>
          </View>
          <TouchableOpacity
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-white rounded-2xl flex-row items-center px-4 py-3 shadow-sm">
          <Ionicons name="search" size={20} color={Colors.owner.textLight} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name, location, or specialty..."
            placeholderTextColor={Colors.owner.textLight}
            className="flex-1 ml-3 text-base"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Quick Filters */}
        <View className="px-6 py-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row -mx-6 px-6"
          >
            {QUICK_FILTERS.map((filter, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  setSelectedFilter(
                    selectedFilter === filter.label ? null : filter.label,
                  )
                }
                className="mr-3 px-4 py-3 rounded-full flex-row items-center"
                style={{
                  backgroundColor:
                    selectedFilter === filter.label
                      ? Colors.owner.primary
                      : Colors.owner.card,
                  borderWidth: 1,
                  borderColor:
                    selectedFilter === filter.label
                      ? Colors.owner.primary
                      : Colors.owner.border,
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={filter.icon as any}
                  size={18}
                  color={
                    selectedFilter === filter.label
                      ? "white"
                      : Colors.owner.primary
                  }
                />
                <Text
                  className="ml-2 font-semibold"
                  style={{
                    color:
                      selectedFilter === filter.label
                        ? "white"
                        : Colors.owner.primary,
                  }}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Banner */}
        <View
          className="mx-6 mb-6 bg-gradient-to-r rounded-2xl p-5 flex-row items-center justify-between shadow-sm"
          style={{ backgroundColor: Colors.owner.background }}
        >
          <View className="items-center flex-1">
            <Text
              className="text-2xl font-bold"
              style={{ color: Colors.owner.primary }}
            >
              850+
            </Text>
            <Text className="text-xs text-gray-600 mt-1">Verified Walkers</Text>
          </View>
          <View className="w-px h-10 bg-gray-300" />
          <View className="items-center flex-1">
            <Text
              className="text-2xl font-bold"
              style={{ color: Colors.owner.primary }}
            >
              4.9★
            </Text>
            <Text className="text-xs text-gray-600 mt-1">Avg Rating</Text>
          </View>
          <View className="w-px h-10 bg-gray-300" />
          <View className="items-center flex-1">
            <Text
              className="text-2xl font-bold"
              style={{ color: Colors.owner.primary }}
            >
              12K+
            </Text>
            <Text className="text-xs text-gray-600 mt-1">Happy Dogs</Text>
          </View>
        </View>

        {/* Featured Walkers Header */}
        <View className="px-6 mb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-gray-900">
              Available Walkers Near You
            </Text>
            <Text className="text-sm text-gray-600 mt-1">
              {FEATURED_WALKERS.length} walkers in your area
            </Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center"
            activeOpacity={0.7}
          >
            <Text
              className="text-sm font-semibold mr-1"
              style={{ color: Colors.owner.primary }}
            >
              Filters
            </Text>
            <Ionicons
              name="options-outline"
              size={18}
              color={Colors.owner.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Walker Cards */}
        <View className="px-6">
          {FEATURED_WALKERS.map((walker, index) => (
            <TouchableOpacity
              key={walker.id}
              className="bg-white rounded-3xl p-5 mb-4 shadow-lg"
              style={{
                shadowColor: Colors.owner.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 5,
              }}
              activeOpacity={0.95}
            >
              {/* Walker Header */}
              <View className="flex-row items-start mb-4">
                {/* Avatar */}
                <View
                  className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                  style={{ backgroundColor: Colors.owner.background }}
                >
                  <Text
                    className="text-2xl font-bold"
                    style={{ color: Colors.owner.primary }}
                  >
                    {walker.photo}
                  </Text>
                </View>

                {/* Info */}
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-lg font-bold text-gray-900 mr-2">
                      {walker.name}
                    </Text>
                    {walker.verified && (
                      <View className="bg-blue-500 rounded-full p-1">
                        <Ionicons name="checkmark" size={10} color="white" />
                      </View>
                    )}
                  </View>
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="star" size={14} color="#fbbf24" />
                    <Text className="text-sm font-semibold text-gray-700 ml-1">
                      {walker.rating}
                    </Text>
                    <Text className="text-sm text-gray-500 ml-1">
                      ({walker.walks} walks)
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons
                      name="location"
                      size={14}
                      color={Colors.owner.textLight}
                    />
                    <Text className="text-sm text-gray-600 ml-1">
                      {walker.distance} mi away
                    </Text>
                    <Text className="text-sm text-gray-400 mx-2">•</Text>
                    <Text className="text-sm text-gray-600">
                      {walker.experience}
                    </Text>
                  </View>
                </View>

                {/* Price Tag */}
                <View className="items-end">
                  <Text
                    className="text-2xl font-bold"
                    style={{ color: Colors.owner.primary }}
                  >
                    ${walker.hourlyRate}
                  </Text>
                  <Text className="text-xs text-gray-500">per hour</Text>
                </View>
              </View>

              {/* Specialties */}
              <View className="flex-row mb-4">
                {walker.specialties.map((specialty, idx) => (
                  <View
                    key={idx}
                    className="px-3 py-1.5 rounded-full mr-2"
                    style={{ backgroundColor: Colors.owner.background }}
                  >
                    <Text
                      className="text-xs font-medium"
                      style={{ color: Colors.owner.primary }}
                    >
                      {specialty}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Availability & Book Button */}
              <View className="flex-row items-center justify-between pt-4 border-t border-gray-100">
                <View className="flex-row items-center">
                  <View
                    className="w-2 h-2 rounded-full mr-2"
                    style={{
                      backgroundColor: walker.availability.includes("Today")
                        ? "#10b981"
                        : "#f59e0b",
                    }}
                  />
                  <Text className="text-sm font-medium text-gray-700">
                    {walker.availability}
                  </Text>
                </View>
                <TouchableOpacity
                  className="px-6 py-3 rounded-xl flex-row items-center"
                  style={{ backgroundColor: Colors.owner.primary }}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-bold mr-2">Book Now</Text>
                  <Ionicons name="arrow-forward" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Load More */}
        <TouchableOpacity
          className="mx-6 mt-2 py-4 rounded-2xl border-2 items-center"
          style={{ borderColor: Colors.owner.border }}
          activeOpacity={0.7}
        >
          <Text
            className="font-semibold"
            style={{ color: Colors.owner.primary }}
          >
            Load More Walkers
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
