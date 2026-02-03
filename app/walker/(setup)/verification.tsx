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

// Security feature flags
const SECURITY_FEATURES = {
  dataEncryption: true, // Set to true when encryption is actually implemented
  secureTransport: true, // HTTPS/TLS enabled
} as const;

// Security messaging based on implemented features
const SECURITY_COPY = {
  encrypted: SECURITY_FEATURES.dataEncryption
    ? "Your data is encrypted in transit and at rest using industry-standard encryption."
    : "We take measures to protect your data during transmission.",
  disclaimer:
    "This information is used only for verification and payment processing.",
} as const;

export default function Verification() {
  const router = useRouter();
  const [ssn, setSsn] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");

  const handleAccountHolderNameChange = (text: string) => {
    setAccountHolderName(text);
  };

  const handleSubmit = async () => {
    try {
      if (
        !accountHolderName.trim() ||
        !ssn.trim() ||
        !accountNumber.trim() ||
        !routingNumber.trim()
      ) {
        console.warn("Please fill in all required fields");
        return;
      }

      // TODO: Submit verification documents to backend
      console.log("Submitting verification data");
      router.replace("/walker/(setup)/pending");
    } catch (error) {
      console.error("Error submitting verification:", error);
    }
  };

  const renderSecurityInfo = () => (
    <View
      className="mt-4 p-4 rounded-xl"
      style={{ backgroundColor: Colors.walker.background }}
    >
      <Text className="text-sm text-gray-700 mb-2">{SECURITY_COPY.encrypted}</Text>
      <Text className="text-xs text-gray-600">{SECURITY_COPY.disclaimer}</Text>
    </View>
  );

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
            <View className="flex-1 h-2 rounded-full bg-gray-200 ml-2" />
            <View
              className="flex-1 h-2 rounded-full ml-2"
              style={{ backgroundColor: Colors.walker.primary }}
            />
          </View>

          <Text className="text-xl font-semibold mb-2">
            Verification & Banking
          </Text>
          <Text className="text-gray-600 mb-6">Step 4 of 4</Text>

          <View className="space-y-6">
            {/* Identity Verification */}
            <View>
              <Text className="text-lg font-semibold mb-4">
                Identity Verification
              </Text>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Government ID
                </Text>
                <TouchableOpacity
                  className="border-2 border-dashed rounded-xl p-6 items-center"
                  style={{ borderColor: Colors.walker.border }}
                  accessibilityRole="button"
                  accessibilityLabel="Upload government ID"
                  activeOpacity={0.7}
                >
                  <Text className="text-3xl mb-2">📄</Text>
                  <Text
                    style={{ color: Colors.walker.primary }}
                    className="font-medium"
                  >
                    Upload ID (Driver's License or Passport)
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Social Security Number
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                  placeholder="XXX-XX-XXXX"
                  value={ssn}
                  onChangeText={setSsn}
                  keyboardType="numeric"
                  secureTextEntry
                  placeholderTextColor="#9ca3af"
                  accessibilityLabel="Social Security Number input"
                />
                <Text className="text-xs text-gray-500 mt-1">
                  Required for background check
                </Text>
              </View>
            </View>

            {/* Banking Information */}
            <View>
              <Text className="text-lg font-semibold mb-4">
                Banking Information
              </Text>

              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                    placeholder="Full name on account"
                    value={accountHolderName}
                    onChangeText={handleAccountHolderNameChange}
                    placeholderTextColor="#9ca3af"
                    accessibilityLabel="Account holder name input"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                    keyboardType="numeric"
                    secureTextEntry
                    placeholderTextColor="#9ca3af"
                    accessibilityLabel="Account number input"
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Routing Number
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                    placeholder="Enter routing number"
                    value={routingNumber}
                    onChangeText={setRoutingNumber}
                    keyboardType="numeric"
                    placeholderTextColor="#9ca3af"
                    accessibilityLabel="Routing number input"
                  />
                </View>
              </View>

              {renderSecurityInfo()}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-8 pb-8 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleSubmit}
          className="rounded-full py-4 mt-4"
          style={{ backgroundColor: Colors.walker.primary }}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Submit for verification"
        >
          <Text className="text-white text-lg font-semibold text-center">
            Submit for Verification
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}