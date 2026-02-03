import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Welcome() {
  const router = useRouter();

  return (
    <View className="flex-1">
      {/* Gradient Background */}
      <LinearGradient
        colors={["#ffffff", Colors.owner.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center px-8">
          {/* Hero Icon */}
          <View className="mb-8">
            <View
              className="w-32 h-32 rounded-full items-center justify-center"
              style={{
                backgroundColor: Colors.owner.primary,
                shadowColor: Colors.owner.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Ionicons name="paw" size={64} color="white" />
            </View>
            {/* Decorative circles */}
            <View
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full"
              style={{ backgroundColor: Colors.owner.primaryLight }}
            />
            <View
              className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full"
              style={{ backgroundColor: Colors.owner.secondary }}
            />
          </View>

          {/* Welcome Text */}
          <View className="items-center mb-12">
            <Text
              className="text-5xl font-bold text-center mb-3"
              style={{ color: Colors.owner.primary }}
            >
              Welcome
            </Text>
            <Text
              className="text-2xl font-semibold text-center mb-4"
              style={{ color: Colors.owner.text }}
            >
              to DogWalker
            </Text>
            <Text className="text-base text-center text-gray-600 leading-6 px-4">
              Your trusted companion for finding the perfect dog walker in your
              neighborhood
            </Text>
          </View>

          {/* Feature Highlights */}
          <View className="w-full">
            {[
              {
                icon: "shield-checkmark",
                title: "Verified Walkers",
                desc: "Background-checked professionals",
              },
              {
                icon: "location",
                title: "Nearby & Available",
                desc: "Find walkers close to you",
              },
              {
                icon: "heart",
                title: "Peace of Mind",
                desc: "Real-time updates & GPS tracking",
              },
            ].map((feature, index) => (
              <View
                key={index}
                className="flex-row items-center mb-4 bg-white rounded-2xl p-4"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: Colors.owner.background }}
                >
                  <Ionicons
                    name={feature.icon as any}
                    size={24}
                    color={Colors.owner.primary}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-900 mb-1">
                    {feature.title}
                  </Text>
                  <Text className="text-sm text-gray-600">{feature.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Section */}
        <View className="px-8 pb-12">
          <TouchableOpacity
            onPress={() => router.push("/owner/(onboarding)/how-it-works")}
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
            <Text className="text-white text-lg font-bold mr-2">
              Get Started
            </Text>
            <Ionicons name="arrow-forward-circle" size={24} color="white" />
          </TouchableOpacity>

          {/* Progress Dots */}
          <View className="flex-row justify-center">
            <View
              className="w-10 h-2 rounded-full mx-1"
              style={{ backgroundColor: Colors.owner.primary }}
            />
            <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
            <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
            <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
