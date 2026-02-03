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
  Alert,
} from "react-native";

interface ExperienceLevel {
  label: string;
  desc: string;
}

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  { label: "Beginner", desc: "New to professional dog walking" },
  { label: "Intermediate", desc: "1-2 years of experience" },
  { label: "Expert", desc: "3+ years of professional experience" },
];

interface ExperienceLevelButtonProps {
  level: ExperienceLevel;
  selected: boolean;
  onSelect: () => void;
}

const ExperienceLevelButton = ({
  level,
  selected,
  onSelect,
}: ExperienceLevelButtonProps) => {
  const borderClass = selected ? `border-2 border-[${Colors.walker.primary}]` : "border border-gray-300";
  const bgClass = selected ? `bg-[${Colors.walker.primary}]/10` : "bg-transparent";

  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`rounded-xl p-4 ${borderClass} ${bgClass}`}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${level.label} - ${level.desc}`}
      activeOpacity={0.7}
    >
      <Text className="font-semibold text-base mb-1 text-gray-900">{level.label}</Text>
      <Text className="text-gray-600 text-sm">{level.desc}</Text>
    </TouchableOpacity>
  );
};

export default function Experience() {
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (selectedLevel === null) {
      Alert.alert("Validation Error", "Please select an experience level");
      return;
    }
    if (!bio.trim() || !experience.trim()) {
      Alert.alert("Validation Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const selectedLevelData = EXPERIENCE_LEVELS[selectedLevel];

      // TODO: Save experience data to backend
      console.log("Selected level:", selectedLevelData.label);
      console.log("Bio:", bio);
      console.log("Experience:", experience);

      router.push("/walker/(setup)/availability");
    } catch (error) {
      console.error("Error saving experience:", error);
      Alert.alert("Error", "Failed to save your experience. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white">
        <View className="px-8 py-6">
          {/* Progress Indicator */}
          <View className="flex-row items-center mb-8 space-x-2">
            <View className="flex-1 h-2 rounded-full bg-gray-200" />
            <View className={`flex-1 h-2 rounded-full`} style={{ backgroundColor: Colors.walker.primary }} />
            <View className="flex-1 h-2 rounded-full bg-gray-200" />
            <View className="flex-1 h-2 rounded-full bg-gray-200" />
          </View>

          <Text className="text-xl font-semibold mb-2">Your Experience</Text>
          <Text className="text-gray-600 mb-6">Step 2 of 4</Text>

          <View className="space-y-4">
            {/* About You */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">About You</Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base min-h-[100px] text-gray-900"
                placeholder="Tell dog owners about yourself..."
                placeholderTextColor="#9ca3af"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text className="text-xs text-gray-500 mt-1">
                Share your passion for dogs and what makes you a great walker
              </Text>
            </View>

            {/* Experience with Dogs */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Experience with Dogs</Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base min-h-[100px] text-gray-900"
                placeholder="Describe your experience..."
                placeholderTextColor="#9ca3af"
                value={experience}
                onChangeText={setExperience}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text className="text-xs text-gray-500 mt-1">
                Include any relevant experience, training, or certifications
              </Text>
            </View>

            {/* Experience Level */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-3">Experience Level</Text>
              <View className="space-y-3" accessibilityRole="radiogroup">
                {EXPERIENCE_LEVELS.map((level, index) => (
                  <ExperienceLevelButton
                    key={index}
                    level={level}
                    selected={selectedLevel === index}
                    onSelect={() => setSelectedLevel(index)}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View className="px-8 pb-8 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handleContinue}
          className={`rounded-full py-4 mt-4 ${loading ? "opacity-70" : ""}`}
          style={{ backgroundColor: Colors.walker.primary }}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Continue to next step"
          disabled={loading}
        >
          <Text className="text-white text-lg font-semibold text-center">
            {loading ? "Saving..." : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
