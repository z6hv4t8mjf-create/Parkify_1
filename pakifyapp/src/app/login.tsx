import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Bitte E-Mail und Passwort eingeben.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.replace('/home');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header: Parkify & Stadt Gummersbach */}
        <View style={styles.header}>
          <Text style={styles.logo}>Parkify</Text>
          <View style={styles.cityBadge}>
            <Text style={styles.cityText}>Stadt{'\n'}Gummersbach</Text>
          </View>
        </View>

        {/* Blaue Überschrift */}
        <Text style={styles.title}>Login</Text>

        {/* Benutzername / E-Mail */}
        <View style={styles.fieldGroup}>
          <View style={styles.yellowTag}>
            <Text style={styles.yellowTagText}>Benutzername / E-Mail</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="z. B. max@beispiel.de"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Passwort */}
        <View style={styles.fieldGroup}>
          <View style={styles.yellowTag}>
            <Text style={styles.yellowTagText}>Passwort</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Text style={styles.forgotText}>Passwort vergessen?</Text>
        </View>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        {/* Registrierungs-Hinweis aus Figma */}
        <View style={styles.registerBox}>
          <Text style={styles.registerHint}>Noch nicht angemeldet?</Text>
          <Pressable
            style={styles.registerButton}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.registerButtonText}>Jetzt Registrieren!</Text>
          </Pressable>
        </View>

        {/* Unterer Einloggen-Button */}
        <Pressable
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Lädt...' : 'Einloggen'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },
  logo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#D9383A',
  },
  cityBadge: {
    alignItems: 'flex-end',
  },
  cityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'right',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B7DDD',
    marginBottom: 22,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  yellowTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8C547',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  yellowTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  input: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#111827',
  },
  forgotText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 5,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
  },
  registerBox: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 28,
    gap: 6,
  },
  registerHint: {
    fontSize: 12,
    color: '#4B5563',
  },
  registerButton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  registerButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  loginButton: {
    backgroundColor: '#E8C547',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 'auto',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
});