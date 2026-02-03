import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { clearAllData } from "@/utils/storage";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function WalkerProfile() {
  const router = useRouter();
  const { logout } = useAuth();
  const { clearRole } = useRole();

  const handleLogout = async () => {
    await logout();
    await clearRole();
    await clearAllData();
    router.replace("/role-selection");
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-16 pb-6">
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View
            className="w-24 h-24 rounded-full mb-4"
            style={{ backgroundColor: Colors.walker.background }}
          />
          <Text className="text-2xl font-bold">Your Name</Text>
          <Text className="text-gray-600 mb-2">your.email@example.com</Text>
          <View className="flex-row items-center">
            <Text className="text-yellow-500 text-lg mr-1">⭐</Text>
            <Text className="font-semibold text-lg">4.9</Text>
            <Text className="text-gray-500 ml-1">(48 reviews)</Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row mb-6">
          <View
            className="flex-1 items-center p-4 rounded-xl mr-2"
            style={{ backgroundColor: Colors.walker.background }}
          >
            <Text
              className="text-2xl font-bold mb-1"
              style={{ color: Colors.walker.primary }}
            >
              156
            </Text>
            <Text className="text-gray-600 text-sm">Total Walks</Text>
          </View>
          <View
            className="flex-1 items-center p-4 rounded-xl ml-2"
            style={{ backgroundColor: Colors.walker.background }}
          >
            <Text
              className="text-2xl font-bold mb-1"
              style={{ color: Colors.walker.primary }}
            >
              $2,340
            </Text>
            <Text className="text-gray-600 text-sm">Total Earned</Text>
          </View>
        </View>

        {/* Earnings */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">Earnings</Text>
          <View className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
              <Text className="text-2xl mr-4">💰</Text>
              <View className="flex-1">
                <Text className="text-base font-medium">Payment Methods</Text>
                <Text className="text-sm text-gray-500">
                  Bank account ending in •••• 4567
                </Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center p-4">
              <Text className="text-2xl mr-4">📊</Text>
              <Text className="flex-1 text-base">Earnings History</Text>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Availability */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">Availability</Text>
          <View className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
              <Text className="text-2xl mr-4">📅</Text>
              <Text className="flex-1 text-base">Set Weekly Schedule</Text>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center p-4">
              <Text className="text-2xl mr-4">💵</Text>
              <View className="flex-1">
                <Text className="text-base font-medium">Hourly Rate</Text>
                <Text className="text-sm text-gray-500">$25/hour</Text>
              </View>
              <Text className="text-gray-400">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Settings */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">Account Settings</Text>
          <View className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {[
              { icon: "👤", title: "Edit Profile" },
              { icon: "🔔", title: "Notifications" },
              { icon: "🌙", title: "Dark Mode" },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center p-4 border-b border-gray-100 last:border-b-0"
              >
                <Text className="text-2xl mr-4">{item.icon}</Text>
                <Text className="flex-1 text-base">{item.title}</Text>
                <Text className="text-gray-400">›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">Support</Text>
          <View className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {[
              { icon: "❓", title: "Help Center" },
              { icon: "📧", title: "Contact Support" },
              { icon: "📄", title: "Terms & Privacy" },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center p-4 border-b border-gray-100 last:border-b-0"
              >
                <Text className="text-2xl mr-4">{item.icon}</Text>
                <Text className="flex-1 text-base">{item.title}</Text>
                <Text className="text-gray-400">›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="border border-red-500 rounded-xl p-4 items-center mb-8"
        >
          <Text className="text-red-500 font-semibold text-base">Log Out</Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-400 text-sm">Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}
