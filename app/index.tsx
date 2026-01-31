import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { role, isLoading: roleLoading } = useRole();

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!role) {
        // No role selected - go to role selection
        router.replace("/role-selection");
      } else if (!isAuthenticated) {
        // Role selected but not authenticated - go to role-specific splash
        router.replace(`/${role}/splash`);
      } else {
        // Authenticated - go to role-specific main app
        router.replace(`/${role}/(tabs)/home`);
      }
    }
  }, [authLoading, roleLoading, role, isAuthenticated]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#0a7ea4" />
    </View>
  );
}
