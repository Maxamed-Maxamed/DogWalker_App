import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LegalScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Terms & Privacy</ThemedText>
        <ThemedText style={styles.body}>
          This is a placeholder for the Terms & Privacy page. Replace this content with the actual legal text or an embedded webview as appropriate.
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20 },
  body: { marginTop: 16, lineHeight: 20 },
});
