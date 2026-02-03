import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { clearAllData } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

  const stats = [
    { label: "Total Walks", value: "24", icon: "walk" as const },
    { label: "This Month", value: "8", icon: "calendar" as const },
    { label: "Favorites", value: "3", icon: "star" as const },
  ];

  const dogs = [
    {
      id: 1,
      name: "Buddy",
      breed: "Golden Retriever",
      age: "3 years",
      weight: "45 lbs",
    },
    {
      id: 2,
      name: "Max",
      breed: "Labrador",
      age: "5 years",
      weight: "60 lbs",
    },
  ];

  const accountSettings = [
    {
      icon: "person-outline" as const,
      title: "Edit Profile",
      color: Colors.owner.primary,
    },
    {
      icon: "location-outline" as const,
      title: "Location",
      color: Colors.owner.primary,
    },
    {
      icon: "card-outline" as const,
      title: "Payment Methods",
      color: Colors.owner.primary,
    },
    {
      icon: "notifications-outline" as const,
      title: "Notifications",
      color: Colors.owner.primary,
    },
  ];

  const supportItems = [
    {
      icon: "help-circle-outline" as const,
      title: "Help Center",
      color: "#6b7280",
    },
    {
      icon: "mail-outline" as const,
      title: "Contact Support",
      color: "#6b7280",
    },
    {
      icon: "document-text-outline" as const,
      title: "Terms & Privacy",
      color: "#6b7280",
    },
  ];

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: Colors.owner.background }}
    >
      {/* Profile Header with Gradient */}
      <LinearGradient
        colors={[Colors.owner.primary, "#0891b2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-16 pb-8 px-6"
      >
        <View className="items-center">
          <View
            className="w-28 h-28 rounded-full items-center justify-center mb-4 border-4 border-white"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          >
            <Ionicons name="person" size={56} color="white" />
          </View>
          <Text className="text-2xl font-bold text-white mb-1">John Smith</Text>
          <Text className="text-white/90 mb-4">john.smith@example.com</Text>

          <TouchableOpacity className="px-6 py-2.5 rounded-full bg-white/20 border border-white/40">
            <Text className="text-white font-semibold">Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View className="px-6 -mt-6 mb-4">
        <View
          className="bg-white rounded-3xl p-5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
            elevation: 5,
          }}
        >
          <View className="flex-row justify-around">
            {stats.map((stat, index) => (
              <View key={index} className="items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: Colors.owner.background }}
                >
                  <Ionicons
                    name={stat.icon}
                    size={22}
                    color={Colors.owner.primary}
                  />
                </View>
                <Text className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="px-6">
        {/* My Dogs Section */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-900">My Dogs</Text>
            <TouchableOpacity>
              <Ionicons
                name="add-circle"
                size={28}
                color={Colors.owner.primary}
              />
            </TouchableOpacity>
          </View>

          {dogs.map((dog) => (
            <View
              key={dog.id}
              className="bg-white rounded-2xl p-4 mb-3"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="w-16 h-16 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: Colors.owner.background }}
                >
                  <Ionicons name="paw" size={28} color={Colors.owner.primary} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-lg text-gray-900">
                    {dog.name}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {dog.breed} · {dog.age} · {dog.weight}
                  </Text>
                </View>
                <TouchableOpacity
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: Colors.owner.background }}
                >
                  <Ionicons
                    name="pencil"
                    size={18}
                    color={Colors.owner.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Account Settings */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Account Settings
          </Text>
          <View
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {accountSettings.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center p-4"
                style={{
                  borderBottomWidth: index < accountSettings.length - 1 ? 1 : 0,
                  borderBottomColor: "#f3f4f6",
                }}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: Colors.owner.background }}
                >
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text className="flex-1 text-base font-medium text-gray-700">
                  {item.title}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Support</Text>
          <View
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {supportItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center p-4"
                style={{
                  borderBottomWidth: index < supportItems.length - 1 ? 1 : 0,
                  borderBottomColor: "#f3f4f6",
                }}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: "#f3f4f6" }}
                >
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text className="flex-1 text-base font-medium text-gray-700">
                  {item.title}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-white border-2 border-red-500 rounded-2xl p-4 items-center mb-4"
          style={{
            shadowColor: "#ef4444",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View className="flex-row items-center">
            <Ionicons name="log-out-outline" size={22} color="#ef4444" />
            <Text className="text-red-500 font-bold text-base ml-2">
              Log Out
            </Text>
          </View>
        </TouchableOpacity>

        <Text className="text-center text-gray-400 text-sm mb-8">
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}
