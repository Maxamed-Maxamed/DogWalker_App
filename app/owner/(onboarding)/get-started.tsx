import { Icons8DogPaw } from "@/components/Icons8Icon";
import { Colors } from "@/constants/theme";
import { saveOnboardingCompleted } from "@/utils/storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

export default function GetStarted() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale and rotate animation for the paw
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-10deg", "0deg"],
  });

  const handleGetStarted = async () => {
    await saveOnboardingCompleted("owner");
    router.replace("/owner/(auth)/signup");
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-8">
        {/* Animated Dog Paw Icon */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }, { rotate: rotation }],
            opacity: fadeAnim,
          }}
          className="mb-8"
        >
          <LinearGradient
            colors={[Colors.owner.primary, "#0891b2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-36 h-36 rounded-full items-center justify-center"
            style={{
              shadowColor: Colors.owner.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <Icons8DogPaw size={72} color="ffffff" platform="ios_filled" />
          </LinearGradient>
        </Animated.View>

        {/* Header Text */}
        <Text
          className="text-4xl font-bold text-center mb-4"
          style={{ color: Colors.owner.primary }}
        >
          Ready to Get Started?
        </Text>
        <Text className="text-lg text-center text-gray-600 mb-8 leading-relaxed">
          Create your account and find the perfect walker for your dog
        </Text>

        {/* Feature Highlights */}
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="w-full space-y-3 mb-8"
        >
          {[
            "🐕 Find trusted walkers near you",
            "📍 Track walks in real-time",
            "💬 Direct messaging with walkers",
          ].map((text, index) => (
            <View key={index} className="flex-row items-center">
              <View
                className="w-2 h-2 rounded-full mr-3"
                style={{ backgroundColor: Colors.owner.primary }}
              />
              <Text className="text-gray-700 text-base">{text}</Text>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Bottom Actions */}
      <View className="px-8 pb-12">
        <TouchableOpacity
          onPress={handleGetStarted}
          className="rounded-full py-4"
          style={{
            backgroundColor: Colors.owner.primary,
            shadowColor: Colors.owner.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-bold text-center">
            Create Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/owner/(auth)/login")}
          className="rounded-full py-4 mt-4"
        >
          <Text className="text-center text-gray-600 text-base">
            Already have an account?{" "}
            <Text style={{ color: Colors.owner.primary }} className="font-bold">
              Log In
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Progress Dots */}
        <View className="flex-row justify-center mt-6">
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
          <View
            className="w-2 h-2 rounded-full mx-1"
            style={{ backgroundColor: Colors.owner.primary }}
          />
        </View>
      </View>
    </View>
  );
}
