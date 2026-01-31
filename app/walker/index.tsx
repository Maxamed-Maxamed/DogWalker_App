import { useAuth } from "@/contexts/AuthContext";
import { getOnboardingCompleted, getSetupCompleted } from "@/utils/storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function WalkerIndex() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const checkStatus = async () => {
      const onboardingComplete = await getOnboardingCompleted("walker");
      const setupComplete = await getSetupCompleted("walker");

      if (!onboardingComplete) {
        router.replace("/walker/(onboarding)/welcome");
      } else if (!isAuthenticated) {
        router.replace("/walker/(auth)/login");
      } else if (!setupComplete) {
        router.replace("/walker/(setup)/personal-info");
      } else {
        router.replace("/walker/(tabs)/home");
      }
    };

    checkStatus();
  }, [isAuthenticated]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#10b981" />
    </View>
  );
}
