import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const STEPS = [
  {
    number: 1,
    icon: "search",
    title: "Browse & Filter",
    description: "Find verified walkers by location, rating, and availability",
    color: "#0ea5e9",
  },
  {
    number: 2,
    icon: "calendar",
    title: "Book Instantly",
    description: "Schedule walks that fit your dog's routine and your schedule",
    color: "#3b82f6",
  },
  {
    number: 3,
    icon: "navigate",
    title: "Track Live",
    description:
      "Follow your dog's walk in real-time with GPS and get photo updates",
    color: "#8b5cf6",
  },
];

export default function HowItWorks() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#ffffff", Colors.owner.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8 pt-20 pb-8">
          {/* Header */}
          <View className="mb-12">
            <Text
              className="text-4xl font-bold text-center mb-3"
              style={{ color: Colors.owner.primary }}
            >
              How It Works
            </Text>
            <Text className="text-base text-center text-gray-600 px-4">
              Three simple steps to finding the perfect walker for your furry
              friend
            </Text>
          </View>

          {/* Steps */}
          <View className="space-y-6">
            {STEPS.map((step, index) => (
              <View key={step.number} className="flex-row items-start">
                {/* Icon Circle */}
                <View className="items-center mr-4">
                  <View
                    className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                    style={{
                      backgroundColor: step.color,
                      shadowColor: step.color,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <Ionicons name={step.icon as any} size={28} color="white" />
                  </View>
                  {/* Connecting Line */}
                  {index < STEPS.length - 1 && (
                    <View
                      className="w-0.5 h-12"
                      style={{ backgroundColor: Colors.owner.border }}
                    />
                  )}
                </View>

                {/* Content */}
                <View className="flex-1 pt-1">
                  <View className="flex-row items-center mb-2">
                    <View
                      className="w-6 h-6 rounded-full items-center justify-center mr-2"
                      style={{ backgroundColor: Colors.owner.background }}
                    >
                      <Text
                        className="text-xs font-bold"
                        style={{ color: Colors.owner.primary }}
                      >
                        {step.number}
                      </Text>
                    </View>
                    <Text className="text-xl font-bold text-gray-900">
                      {step.title}
                    </Text>
                  </View>
                  <Text className="text-base text-gray-600 leading-6">
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Trust Badge */}
          <View
            className="mt-8 p-4 rounded-2xl flex-row items-center"
            style={{ backgroundColor: "rgba(10, 126, 164, 0.08)" }}
          >
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: Colors.owner.primary }}
            >
              <Ionicons name="shield-checkmark" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-gray-900 mb-1">
                100% Verified & Insured
              </Text>
              <Text className="text-sm text-gray-600">
                Every walker is background-checked and fully insured
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Section */}
        <View className="px-8 pb-12">
          <TouchableOpacity
            onPress={() => router.push("/owner/(onboarding)/safety")}
            className="rounded-2xl py-4 mb-6 flex-row items-center justify-center"
            style={{
              backgroundColor: Colors.owner.primary,
              shadowColor: Colors.owner.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
            activeOpacity={0.9}
          >
            <Text className="text-white text-lg font-bold mr-2">Continue</Text>
            <Ionicons name="arrow-forward-circle" size={24} color="white" />
          </TouchableOpacity>

          {/* Progress Dots */}
          <View className="flex-row justify-center">
            <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
            <View
              className="w-10 h-2 rounded-full mx-1"
              style={{ backgroundColor: Colors.owner.primary }}
            />
            <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
            <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
