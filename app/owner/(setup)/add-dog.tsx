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

export default function AddDog() {
  const router = useRouter();
  const [dogName, setDogName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");

  const handleContinue = async () => {
    // TODO: Save dog info to backend
    router.push("/owner/(setup)/location");
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
            <View
              className="flex-1 h-2 rounded-full ml-2"
              style={{ backgroundColor: Colors.owner.primary }}
            />
            <View className="flex-1 h-2 rounded-full bg-gray-200 ml-2" />
          </View>

          <Text className="text-xl font-semibold mb-2">Add Your Dog</Text>
          <Text className="text-gray-600 mb-6">Step 2 of 3</Text>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Dog's Name
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholder="Enter dog's name"
                value={dogName}
                onChangeText={setDogName}
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Breed
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholder="e.g., Golden Retriever"
                value={breed}
                onChangeText={setBreed}
              />
            </View>

            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Age (years)
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                  placeholder="3"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Weight (lbs)
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                  placeholder="45"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View className="mt-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Dog Photo (Optional)
              </Text>
              <TouchableOpacity
                className="border-2 border-dashed rounded-xl p-8 items-center"
                style={{ borderColor: Colors.owner.border }}
              >
                <Text
                  style={{ color: Colors.owner.primary }}
                  className="font-medium"
                >
                  Upload Photo
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="border rounded-xl p-4 items-center mt-4"
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
        </View>
      </ScrollView>

      <View className="px-8 pb-8 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleContinue}
          className="rounded-full py-4 mt-4"
          style={{ backgroundColor: Colors.owner.primary }}
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
