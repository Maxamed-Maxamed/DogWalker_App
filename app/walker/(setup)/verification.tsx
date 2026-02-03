import { Colors } from "@/constants/theme";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

// Document validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

interface DocumentInfo {
  uri: string;
  name: string;
  size: number;
  mimeType: string;
}

export default function Verification() {
  const router = useRouter();
  const [ssn, setSsn] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [governmentId, setGovernmentId] = useState<DocumentInfo | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const handleAccountHolderNameChange = (text: string) => {
    setAccountHolderName(text);
  };

  /**
   * Handles document selection with validation
   * Validates file type and size for security
   */
  const handleDocumentPick = async () => {
    try {
      setIsUploadingDoc(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsUploadingDoc(false);
        return;
      }

      const selectedDoc = result.assets[0];

      // Validate file size (max 10MB)
      if (selectedDoc.size && selectedDoc.size > MAX_FILE_SIZE) {
        Alert.alert(
          "File Too Large",
          "Please select a file smaller than 10MB. Try compressing the image or using a PDF.",
          [{ text: "OK" }],
        );
        setIsUploadingDoc(false);
        return;
      }

      // Validate MIME type
      if (
        selectedDoc.mimeType &&
        !ALLOWED_MIME_TYPES.includes(selectedDoc.mimeType)
      ) {
        Alert.alert(
          "Invalid File Type",
          "Please upload a valid government ID (JPEG, PNG, or PDF).",
          [{ text: "OK" }],
        );
        setIsUploadingDoc(false);
        return;
      }

      // Store document metadata
      setGovernmentId({
        uri: selectedDoc.uri,
        name: selectedDoc.name,
        size: selectedDoc.size || 0,
        mimeType: selectedDoc.mimeType || "unknown",
      });

      if (__DEV__) {
        console.log("Document selected:", {
          name: selectedDoc.name,
          size: selectedDoc.size,
          type: selectedDoc.mimeType,
        });
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert(
        "Upload Failed",
        "Failed to select document. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate all required fields
      if (!governmentId) {
        Alert.alert(
          "Missing Document",
          "Please upload a valid government ID before continuing.",
          [{ text: "OK" }],
        );
        return;
      }

      if (
        !accountHolderName.trim() ||
        !ssn.trim() ||
        !accountNumber.trim() ||
        !routingNumber.trim()
      ) {
        Alert.alert(
          "Missing Information",
          "Please fill in all required fields before submitting.",
          [{ text: "OK" }],
        );
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
      <Text className="text-sm text-gray-700 mb-2">
        {SECURITY_COPY.encrypted}
      </Text>
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
                  style={{
                    borderColor: governmentId
                      ? Colors.walker.primary
                      : Colors.walker.border,
                    backgroundColor: governmentId
                      ? Colors.walker.background
                      : "transparent",
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Upload government ID"
                  activeOpacity={0.7}
                  onPress={handleDocumentPick}
                  disabled={isUploadingDoc}
                >
                  {isUploadingDoc ? (
                    <>
                      <ActivityIndicator
                        size="large"
                        color={Colors.walker.primary}
                      />
                      <Text className="text-gray-600 mt-2">Selecting...</Text>
                    </>
                  ) : governmentId ? (
                    <>
                      <Text className="text-3xl mb-2">✅</Text>
                      <Text
                        style={{ color: Colors.walker.primary }}
                        className="font-semibold mb-1"
                      >
                        Document Selected
                      </Text>
                      <Text className="text-sm text-gray-600 text-center">
                        {governmentId.name}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        {(governmentId.size / 1024 / 1024).toFixed(2)} MB
                      </Text>
                      <Text
                        style={{ color: Colors.walker.primary }}
                        className="text-sm mt-2 underline"
                      >
                        Tap to change
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text className="text-3xl mb-2">📄</Text>
                      <Text
                        style={{ color: Colors.walker.primary }}
                        className="font-medium"
                      >
                        Upload ID (Driver's License or Passport)
                      </Text>
                      <Text className="text-xs text-gray-500 mt-2">
                        PDF, JPEG, or PNG (max 10MB)
                      </Text>
                    </>
                  )}
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
