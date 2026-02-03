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

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // TODO: Implement login with your backend
    router.replace("/walker/(tabs)/home");
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
        <View className="flex-1 justify-center px-8">
          <Text
            className="text-3xl font-bold mb-2"
            style={{ color: Colors.walker.primary }}
          >
            Welcome Back
          </Text>
          <Text className="text-gray-600 mb-8">Log in to continue</Text>

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
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/walker/(auth)/forgot-password")}
            className="self-end mt-4"
          >
            <Text
              style={{ color: Colors.walker.primary }}
              className="text-sm font-medium"
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            className="rounded-full py-4 mt-8"
            style={{ backgroundColor: Colors.walker.primary }}
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Log In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/walker/(auth)/signup")}
            className="mt-6"
          >
            <Text className="text-center text-gray-600 text-base">
              Don't have an account?{" "}
              <Text
                style={{ color: Colors.walker.primary }}
                className="font-semibold"
              >
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
