import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function PersonalInfo() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const handleContinue = async () => {
    // TODO: Save personal info to backend
    router.push("/walker/(setup)/experience");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white">
        <View className="px-8 py-6">
          {/* Progress Indicator */}
          <View className="flex-row items-center mb-8">
            <View
              className="flex-1 h-2 rounded-full"
              style={{ backgroundColor: Colors.walker.primary }}
            />
            <View className="flex-1 h-2 rounded-full bg-gray-200 ml-2" />
            <View className="flex-1 h-2 rounded-full bg-gray-200 ml-2" />
            <View className="flex-1 h-2 rounded-full bg-gray-200 ml-2" />
          </View>

          <Text className="text-xl font-semibold mb-2">
            Personal Information
          </Text>
          <Text className="text-gray-600 mb-6">Step 1 of 4</Text>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                First Name
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Last Name
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholder="(555) 123-4567"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholder="MM/DD/YYYY"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                keyboardType="numeric"
              />
            </View>

            <View className="mt-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </Text>
              <TouchableOpacity
                className="border-2 border-dashed rounded-xl p-8 items-center"
                style={{ borderColor: Colors.walker.border }}
              >
                <Text
                  style={{ color: Colors.walker.primary }}
                  className="font-medium"
                >
                  Upload Photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-8 pb-8 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleContinue}
          className="rounded-full py-4 mt-4"
          style={{ backgroundColor: Colors.walker.primary }}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
