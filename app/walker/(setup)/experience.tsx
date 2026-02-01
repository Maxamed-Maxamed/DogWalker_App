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

interface ExperienceLevel {
  label: string;
  desc: string;
}

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  {
    label: "Beginner",
    desc: "New to professional dog walking",
  },
  {
    label: "Intermediate",
    desc: "1-2 years of experience",
  },
  {
    label: "Expert",
    desc: "3+ years of professional experience",
  },
];

export default function Experience() {
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const handleLevelSelect = (index: number) => {
    setSelectedLevel(index);
  };

  const handleContinue = async () => {
    if (selectedLevel === null) {
      console.warn("Please select an experience level");
      return;
    }

    if (!bio.trim() || !experience.trim()) {
      console.warn("Please fill in all required fields");
      return;
    }

    try {
      const selectedLevelData = EXPERIENCE_LEVELS[selectedLevel];

      // TODO: Save experience data to backend
      console.log("Selected level:", selectedLevelData.label);
      console.log("Bio:", bio);
      console.log("Experience:", experience);

      router.push("/walker/(setup)/availability");
    } catch (error) {
      console.error("Error saving experience:", error);
    }
  };

  const renderExperienceLevel = (level: ExperienceLevel, index: number) => {
    const isSelected = selectedLevel === index;
    const borderColor = isSelected ? Colors.walker.primary : "#d1d5db";
    const backgroundColor = isSelected
      ? `${Colors.walker.primary}10`
      : "transparent";

    return (
      <TouchableOpacity
        key={`experience-level-${index}`}
        onPress={() => handleLevelSelect(index)}
        className="rounded-xl p-4"
        style={{
          borderWidth: isSelected ? 2 : 1,
          borderColor,
          backgroundColor,
        }}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${level.label} - ${level.desc}`}
        activeOpacity={0.7}
      >
        <Text className="font-semibold text-base mb-1 text-gray-900">
          {level.label}
        </Text>
        <Text className="text-gray-600 text-sm">{level.desc}</Text>
      </TouchableOpacity>
    );
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
              style={{ backgroundColor: Colors.walker.primary }}
            />
            <View className="flex-1 h-2 rounded-full bg-gray-200 ml-2" />
            <View className="flex-1 h-2 rounded-full bg-gray-200 ml-2" />
          </View>

          <Text className="text-xl font-semibold mb-2">Your Experience</Text>
          <Text className="text-gray-600 mb-6">Step 2 of 4</Text>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                About You
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholder="Tell dog owners about yourself..."
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{ minHeight: 100 }}
                placeholderTextColor="#9ca3af"
              />
              <Text className="text-xs text-gray-500 mt-1">
                Share your passion for dogs and what makes you a great walker
              </Text>
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Experience with Dogs
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholder="Describe your experience..."
                value={experience}
                onChangeText={setExperience}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{ minHeight: 100 }}
                placeholderTextColor="#9ca3af"
              />
              <Text className="text-xs text-gray-500 mt-1">
                Include any relevant experience, training, or certifications
              </Text>
            </View>

            <View className="mt-4">
              <Text className="text-sm font-medium text-gray-700 mb-3">
                Experience Level
              </Text>
              <View className="space-y-3">
                {EXPERIENCE_LEVELS.map((level, index) =>
                  renderExperienceLevel(level, index)
                )}
              </View>
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
          accessibilityRole="button"
          accessibilityLabel="Continue to next step"
        >
          <Text className="text-white text-lg font-semibold text-center">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}



// import { Colors } from "@/constants/theme";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import {
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";

// export default function Experience() {
//   const router = useRouter();
//   const [bio, setBio] = useState("");
//   const [experience, setExperience] = useState("");

//   const handleContinue = async () => {
//     // TODO: Save experience to backend
//     router.push("/walker/(setup)/availability");
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       className="flex-1"
//     >
//       <ScrollView className="flex-1 bg-white">
//         <View className="px-8 py-6">
//           {/* Progress Indicator */}
//           <View className="flex-row items-center mb-8">
//             <View className="flex-1 h-2 rounded-full bg-gray-200" />
//             <View
//               className="flex-1 h-2 rounded-full ml-2"
//               style={{ backgroundColor: Colors.walker.primary }}
//             />
//             <View className="flex-1 h-2 rounded-full bg-gray-200 ml-2" />
//             <View className="flex-1 h-2 rounded-full bg-gray-200 ml-2" />
//           </View>

//           <Text className="text-xl font-semibold mb-2">Your Experience</Text>
//           <Text className="text-gray-600 mb-6">Step 2 of 4</Text>

//           <View className="space-y-4">
//             <View>
//               <Text className="text-sm font-medium text-gray-700 mb-2">
//                 About You
//               </Text>
//               <TextInput
//                 className="border border-gray-300 rounded-xl px-4 py-3 text-base"
//                 placeholder="Tell dog owners about yourself..."
//                 value={bio}
//                 onChangeText={setBio}
//                 multiline
//                 numberOfLines={4}
//                 textAlignVertical="top"
//                 style={{ minHeight: 100 }}
//               />
//               <Text className="text-xs text-gray-500 mt-1">
//                 Share your passion for dogs and what makes you a great walker
//               </Text>
//             </View>

//             <View>
//               <Text className="text-sm font-medium text-gray-700 mb-2">
//                 Experience with Dogs
//               </Text>
//               <TextInput
//                 className="border border-gray-300 rounded-xl px-4 py-3 text-base"
//                 placeholder="Describe your experience..."
//                 value={experience}
//                 onChangeText={setExperience}
//                 multiline
//                 numberOfLines={4}
//                 textAlignVertical="top"
//                 style={{ minHeight: 100 }}
//               />
//               <Text className="text-xs text-gray-500 mt-1">
//                 Include any relevant experience, training, or certifications
//               </Text>
//             </View>

//             <View className="mt-4">
//               <Text className="text-sm font-medium text-gray-700 mb-3">
//                 Experience Level
//               </Text>
//               <View className="space-y-3">
//                 {[
//                   {
//                     label: "Beginner",
//                     desc: "New to professional dog walking",
//                   },
//                   { label: "Intermediate", desc: "1-2 years of experience" },
//                   {
//                     label: "Expert",
//                     desc: "3+ years of professional experience",
//                   },
//                 ].map((level, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     className="border border-gray-300 rounded-xl p-4"
//                   >
//                     <Text className="font-semibold text-base mb-1">
//                       {level.label}
//                     </Text>
//                     <Text className="text-gray-600 text-sm">{level.desc}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       <View className="px-8 pb-8 bg-white border-t border-gray-200">
//         <TouchableOpacity
//           onPress={handleContinue}
//           className="rounded-full py-4 mt-4"
//           style={{ backgroundColor: Colors.walker.primary }}
//           activeOpacity={0.8}
//         >
//           <Text className="text-white text-lg font-semibold text-center">
//             Continue
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }
