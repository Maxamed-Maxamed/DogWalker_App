import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as Clipboard from 'expo-clipboard';
import React, { useCallback, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
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

  const [webViewError, setWebViewError] = useState(false);
  const [webviewKey, setWebviewKey] = useState(0);

  const handleOpenURL = useCallback(async () => {
    const url = 'https://dogwalker.app/legal';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot open link', url);
      }
    } catch (error) {
      console.error('Failed to open URL:', error);
      Alert.alert('Unable to open link');
    }
  }, []);

  const handleCopy = useCallback(async () => {
    const url = 'https://dogwalker.app/legal';
    try {
      await Clipboard.setStringAsync(url);
      Alert.alert('Copied', 'Link copied to clipboard');
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  }, []);

  const handleRetry = useCallback(() => {
    setWebViewError(false);
    setWebviewKey((k) => k + 1);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Terms & Privacy</ThemedText>
        {WebViewComp && !webViewError ? (
          <WebViewComp
            key={webviewKey}
            source={{ uri: 'https://dogwalker.app/legal' }}
            style={{ flex: 1 }}
            onError={(syntheticEvent: any) => {
              console.error('WebView error:', syntheticEvent.nativeEvent);
              setWebViewError(true);
            }}
            accessible={true}
            accessibilityLabel="Terms and Privacy policy"
          />
        ) : (
          <View style={{ flex: 1 }}>
            <Pressable onPress={handleOpenURL} onLongPress={handleCopy} accessibilityRole="link" accessibilityLabel="Open Terms and Privacy page">
              <ThemedText type="subtitle" style={[styles.body, styles.link]}>
                Tap here to view the full Terms & Privacy at https://dogwalker.app/legal
              </ThemedText>
            </Pressable>

            {WebViewComp && webViewError ? (
              <View style={styles.fallbackActions}>
                <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
                  <ThemedText style={styles.retryText}>Retry</ThemedText>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20 },
  body: { marginTop: 16, lineHeight: 20 },
  link: { textDecorationLine: 'underline' },
  fallbackActions: { marginTop: 16, alignItems: 'center' },
  retryButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#E5E7EB' },
  retryText: { fontWeight: '600' },
});
