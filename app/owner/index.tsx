import { useAuth } from "@/contexts/AuthContext";
import { getOnboardingCompleted, getSetupCompleted } from "@/utils/storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function OwnerIndex() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const checkStatus = async () => {
      const onboardingComplete = await getOnboardingCompleted("owner");
      const setupComplete = await getSetupCompleted("owner");

      if (!onboardingComplete) {
        router.replace("/owner/(onboarding)/welcome");
      } else if (!isAuthenticated) {
        router.replace("/owner/(auth)/login");
      } else if (!setupComplete) {
        router.replace("/owner/(setup)/personal-info");
      } else {
        router.replace("/owner/(tabs)/home");
      }
    };

    checkStatus();
  }, [isAuthenticated]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#0a7ea4" />
    </View>
  );
}
