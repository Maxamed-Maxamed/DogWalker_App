import { Colors } from "@/constants/theme";
import { useRole } from "@/contexts/RoleContext";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  RotateInDownLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Animated components
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function RoleSelection() {
  const router = useRouter();
  const { setRole } = useRole();
  const ownerCardScale = useSharedValue(1);
  const walkerCardScale = useSharedValue(1);

  const handleRoleSelect = async (role: "owner" | "walker") => {
    // Haptic feedback on press
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setRole(role);
    router.replace(`/${role}/splash`);
  };

  const handlePressIn = (cardType: "owner" | "walker") => {
    const scale = cardType === "owner" ? ownerCardScale : walkerCardScale;
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = (cardType: "owner" | "walker") => {
    const scale = cardType === "owner" ? ownerCardScale : walkerCardScale;
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
  };

  const ownerCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ownerCardScale.value }],
  }));

  const walkerCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: walkerCardScale.value }],
  }));

  return (
    <LinearGradient colors={["#2563eb", "#3b82f6"]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View className="flex-1 justify-center items-center px-6">
          {/* Logo Circle */}
          <Animated.View
            entering={RotateInDownLeft.duration(600).springify().damping(20)}
            style={styles.logoCircle}
          >
            <View className="w-28 h-28 rounded-full bg-white items-center justify-center mb-8">
              <Image
                source={require("@/assets/images/applogo.png")}
                className="w-16 h-16"
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          {/* Headings */}
          <Animated.View entering={FadeInUp.delay(200).duration(500).springify()}>
            <Text className="text-white text-4xl font-bold text-center mb-3">
              Choose Your Role
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300).duration(500).springify()}>
            <Text className="text-white text-base text-center mb-10" style={styles.subtitle}>
              Select how you want to use DogWalker
            </Text>
          </Animated.View>

          {/* Role Cards */}
          <View className="w-full max-w-md px-2">
            {/* Dog Owner Card */}
            <Animated.View
              entering={FadeInDown.delay(400).duration(500).springify()}
              style={styles.cardWrapper}
            >
              <Animated.View style={ownerCardAnimatedStyle}>
                <AnimatedPressable
                  onPress={() => handleRoleSelect("owner")}
                  onPressIn={() => handlePressIn("owner")}
                  onPressOut={() => handlePressOut("owner")}
                  className="bg-white rounded-3xl p-6 mb-4"
                  style={styles.card}
                >
                  <View className="flex-row items-start">
                    {/* Icon */}
                    <View
                      className="w-14 h-14 rounded-full items-center justify-center mr-4"
                      style={[
                        styles.iconCircle,
                        { backgroundColor: `${Colors.owner.primary}15` },
                      ]}
                    >
                      <MaterialIcons
                        name="person"
                        size={28}
                        color={Colors.owner.primary}
                      />
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-gray-900 mb-1">
                        Dog Owner
                      </Text>
                      <Text
                        className="text-sm font-semibold mb-3"
                        style={{ color: Colors.owner.primary }}
                      >
                        Find & book dog walkers
                      </Text>
                      <Text className="text-sm text-gray-600 leading-5">
                        Book trusted dog walkers, track walks in real-time, and keep
                        your furry friend happy and healthy.
                      </Text>
                    </View>
                  </View>
                </AnimatedPressable>
              </Animated.View>
            </Animated.View>

            {/* Dog Walker Card */}
            <Animated.View
              entering={FadeInDown.delay(550).duration(500).springify()}
              style={styles.cardWrapper}
            >
              <Animated.View style={walkerCardAnimatedStyle}>
                <AnimatedPressable
                  onPress={() => handleRoleSelect("walker")}
                  onPressIn={() => handlePressIn("walker")}
                  onPressOut={() => handlePressOut("walker")}
                  className="bg-white rounded-3xl p-6"
                  style={styles.card}
                >
                  <View className="flex-row items-start">
                    {/* Icon */}
                    <View
                      className="w-14 h-14 rounded-full items-center justify-center mr-4"
                      style={[
                        styles.iconCircle,
                        { backgroundColor: `${Colors.walker.primary}15` },
                      ]}
                    >
                      <MaterialIcons
                        name="pets"
                        size={28}
                        color={Colors.walker.primary}
                      />
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-gray-900 mb-1">
                        Dog Walker
                      </Text>
                      <Text
                        className="text-sm font-semibold mb-3"
                        style={{ color: Colors.walker.primary }}
                      >
                        Earn money walking dogs
                      </Text>
                      <Text className="text-sm text-gray-600 leading-5">
                        Set your schedule, walk adorable dogs, earn money, and build
                        a reputation as a trusted professional.
                      </Text>
                    </View>
                  </View>
                </AnimatedPressable>
              </Animated.View>
            </Animated.View>
          </View>

          {/* Bottom Note */}
          <Animated.View entering={FadeIn.delay(700).duration(400)}>
            <Text className="text-white text-center text-sm mt-8" style={styles.bottomNote}>
              You can switch roles anytime in settings
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  logoCircle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  subtitle: {
    opacity: 0.9,
  },
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardWrapper: {
    width: "100%",
  },
  iconCircle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomNote: {
    opacity: 0.8,
  },
});