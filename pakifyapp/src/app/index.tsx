import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase'; // ggf. '../lib/supabase'

export default function HomeScreen() {
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ error }) => {
      setConnected(!error);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Parkify</Text>
        <Text style={styles.subtitle}>
          {connected === null
            ? 'Verbinde...'
            : connected
              ? 'Backend bereit'
              : 'Verbindungsfehler'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
});