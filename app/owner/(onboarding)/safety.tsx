import { Icons8Icon } from "@/components/Icons8Icon";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

export default function Safety() {
  const router = useRouter();

  // Animation values for each safety feature
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;

  const slideAnim1 = useRef(new Animated.Value(50)).current;
  const slideAnim2 = useRef(new Animated.Value(50)).current;
  const slideAnim3 = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Stagger the animations for a cascading effect
    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(fadeAnim1, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim1, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim2, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim2, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim3, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim3, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const safetyFeatures = [
    {
      iconId: "80396", // Shield icon from Icons8 (ios7)
      title: "Verified Walkers",
      description:
        "Background checks and identity verification for all walkers",
      fadeAnim: fadeAnim1,
      slideAnim: slideAnim1,
    },
    {
      iconId: "41445", // Map Pin/GPS icon from Icons8 (ios7)
      title: "Live GPS Tracking",
      description: "Real-time location tracking during every walk",
      fadeAnim: fadeAnim2,
      slideAnim: slideAnim2,
    },
    {
      iconId: "74241", // Insurance/Document icon from Icons8 (ios7)
      title: "Insurance Protection",
      description: "Comprehensive coverage for every walk",
      fadeAnim: fadeAnim3,
      slideAnim: slideAnim3,
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-8">
        {/* Header */}
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: Colors.owner.background }}
        >
          <Icons8Icon
            iconId="80396"
            size={48}
            color={Colors.owner.primary.replace("#", "")}
            platform="ios7"
          />
        </View>

        <Text
          className="text-4xl font-bold text-center mb-3"
          style={{ color: Colors.owner.primary }}
        >
          Safety First
        </Text>
        <Text className="text-lg text-center text-gray-600 mb-12">
          Your dog's safety is our top priority
        </Text>

        {/* Safety Features */}
        <View className="w-full space-y-4 mb-12">
          {safetyFeatures.map((feature, index) => (
            <Animated.View
              key={index}
              style={{
                opacity: feature.fadeAnim,
                transform: [{ translateX: feature.slideAnim }],
                backgroundColor: Colors.owner.background,
              }}
              className="flex-row items-start p-5 rounded-2xl"
            >
              <View
                className="w-14 h-14 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: "white" }}
              >
                <Icons8Icon
                  iconId={feature.iconId}
                  size={28}
                  color={Colors.owner.primary.replace("#", "")}
                  platform="ios7"
                />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold mb-1 text-gray-900">
                  {feature.title}
                </Text>
                <Text className="text-sm text-gray-600">
                  {feature.description}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Bottom Navigation */}
      <View className="px-8 pb-12">
        <TouchableOpacity
          onPress={() => router.push("/owner/(onboarding)/get-started")}
          className="rounded-full py-4"
          style={{ backgroundColor: Colors.owner.primary }}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Continue
          </Text>
        </TouchableOpacity>

        {/* Progress Dots */}
        <View className="flex-row justify-center mt-6">
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
          <View
            className="w-2 h-2 rounded-full mx-1"
            style={{ backgroundColor: Colors.owner.primary }}
          />
          <View className="w-2 h-2 rounded-full mx-1 bg-gray-300" />
        </View>
      </View>
    </View>
  );
}
