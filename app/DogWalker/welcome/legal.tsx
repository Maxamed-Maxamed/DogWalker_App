import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// react-native-webview is optional; require dynamically to avoid build-time errors

export default function LegalScreen() {
  // Try to require the WebView only at runtime; render fallback text if unavailable
  let WebViewComp: any = null;
  try {
    // allow dynamic require for an optional native module
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    WebViewComp = require('react-native-webview').WebView;
  } catch {
    WebViewComp = null;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Terms & Privacy</ThemedText>
        {WebViewComp ? (
          <WebViewComp source={{ uri: 'https://dogwalker.app/legal' }} style={{ flex: 1 }} />
        ) : (
          <ThemedText type="subtitle" style={styles.body}>
            You can view the full Terms & Privacy at https://dogwalker.app/legal
          </ThemedText>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20 },
  body: { marginTop: 16, lineHeight: 20 },
});
