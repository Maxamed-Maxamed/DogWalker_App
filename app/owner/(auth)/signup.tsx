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

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    // TODO: Implement signup with your backend
    // For now, navigate to setup after "signup"
    router.replace("/owner/(setup)/personal-info");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 px-8 pt-16">
          <Text
            className="text-3xl font-bold mb-2"
            style={{ color: Colors.owner.primary }}
          >
            Create Account
          </Text>
          <Text className="text-gray-600 mb-8">Sign up to get started</Text>

          <View className="space-y-4">
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

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Password
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSignup}
            className="rounded-full py-4 mt-8"
            style={{ backgroundColor: Colors.owner.primary }}
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} className="mt-6">
            <Text className="text-center text-gray-600 text-base">
              Already have an account?{" "}
              <Text
                style={{ color: Colors.owner.primary }}
                className="font-semibold"
              >
                Log In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
