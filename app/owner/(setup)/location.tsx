import { Colors } from "@/constants/theme";
import { saveSetupCompleted } from "@/utils/storage";
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

export default function Location() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleFinish = async () => {
    // TODO: Save location to backend
    await saveSetupCompleted("owner");
    router.replace("/owner/(tabs)/home");
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
            <View className="flex-1 h-2 rounded-full bg-gray-200" />
            <View className="flex-1 h-2 rounded-full bg-gray-200 ml-2" />
            <View
              className="flex-1 h-2 rounded-full ml-2"
              style={{ backgroundColor: Colors.owner.primary }}
            />
          </View>

          <Text className="text-xl font-semibold mb-2">Your Location</Text>
          <Text className="text-gray-600 mb-6">Step 3 of 3</Text>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Street Address
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholder="123 Main Street"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                City
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholder="San Francisco"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  State
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                  placeholder="CA"
                  value={state}
                  onChangeText={setState}
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                  placeholder="94102"
                  value={zipCode}
                  onChangeText={setZipCode}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
            </View>

            <TouchableOpacity
              className="border rounded-xl p-4 items-center mt-4"
              style={{ borderColor: Colors.owner.primary }}
            >
              <Text
                style={{ color: Colors.owner.primary }}
                className="font-semibold"
              >
                📍 Use Current Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View className="px-8 pb-8 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleFinish}
          className="rounded-full py-4 mt-4"
          style={{ backgroundColor: Colors.owner.primary }}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Finish Setup
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
