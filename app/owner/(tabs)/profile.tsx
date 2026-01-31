import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { clearAllData } from "@/utils/storage";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function OwnerProfile() {
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
            style={{ backgroundColor: Colors.owner.background }}
          />
          <Text className="text-2xl font-bold">Your Name</Text>
          <Text className="text-gray-600">your.email@example.com</Text>
        </View>

        {/* My Dogs */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">My Dogs</Text>
          <View className="bg-white border border-gray-200 rounded-xl p-4">
            <View className="flex-row items-center">
              <View
                className="w-16 h-16 rounded-full mr-4"
                style={{ backgroundColor: Colors.owner.background }}
              />
              <View className="flex-1">
                <Text className="font-semibold text-lg">Buddy</Text>
                <Text className="text-gray-600">
                  Golden Retriever · 3 years · 45 lbs
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={{ color: Colors.owner.primary }}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            className="border rounded-xl p-4 items-center mt-3"
            style={{ borderColor: Colors.owner.primary }}
          >
            <Text
              style={{ color: Colors.owner.primary }}
              className="font-semibold"
            >
              + Add Another Dog
            </Text>
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4">Account Settings</Text>
          <View className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {[
              { icon: "👤", title: "Edit Profile" },
              { icon: "📍", title: "Location" },
              { icon: "💳", title: "Payment Methods" },
              { icon: "🔔", title: "Notifications" },
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
