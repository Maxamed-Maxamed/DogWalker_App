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

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleResetPassword = async () => {
    // TODO: Implement password reset with your backend
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View className="flex-1 bg-white justify-center px-8">
        <Text
          className="text-3xl font-bold text-center mb-4"
          style={{ color: Colors.walker.primary }}
        >
          Check Your Email
        </Text>
        <Text className="text-center text-gray-600 mb-8">
          We've sent password reset instructions to {email}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="rounded-full py-4"
          style={{ backgroundColor: Colors.walker.primary }}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 justify-center px-8">
          <Text
            className="text-3xl font-bold mb-2"
            style={{ color: Colors.walker.primary }}
          >
            Reset Password
          </Text>
          <Text className="text-gray-600 mb-8">
            Enter your email and we'll send you instructions to reset your
            password
          </Text>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Email
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <TouchableOpacity
            onPress={handleResetPassword}
            className="rounded-full py-4 mt-8"
            style={{ backgroundColor: Colors.walker.primary }}
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Send Instructions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} className="mt-6">
            <Text className="text-center text-gray-600 text-base">
              <Text
                style={{ color: Colors.walker.primary }}
                className="font-semibold"
              >
                ← Back to Login
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
