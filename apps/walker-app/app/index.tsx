import { StyleSheet, Text, View } from 'react-native';

export default function WalkerAppPlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐕 DogWalker Walker</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
      <Text style={styles.description}>
        This app is for dog walkers to accept bookings and track walks.
      </Text>
      <Text style={styles.note}>
        Build walker-specific features here in the future.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
    color: '#ccc',
    fontStyle: 'italic',
  },
});
