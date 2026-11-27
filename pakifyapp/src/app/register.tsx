import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';


export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [street, setStreet] = useState('');
  const [cityZip, setCityZip] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setErrorMsg(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !licensePlate.trim()) {
      setErrorMsg('Bitte fülle alle Pflichtfelder aus.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMsg('Bitte stimme den AGB zu.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      setErrorMsg(error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        license_plate: licensePlate.trim().toUpperCase(),
        street: street.trim(),
        city_zip: cityZip.trim(),
        phone: phone.trim(),
      });

      if (profileError) {
        setLoading(false);
        setErrorMsg('Profil konnte nicht gespeichert werden: ' + profileError.message);
        return;
      }
    }

    setLoading(false);
    router.replace('/home');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Parkify</Text>
          <View style={styles.cityBadge}>
            <Text style={styles.cityText}>Stadt{'\n'}Gummersbach</Text>
          </View>
        </View>

        <Text style={styles.title}>Registrieren</Text>

        <TextInput
          style={styles.input}
          placeholder="Vorname (z. B. Max)"
          placeholderTextColor="#9CA3AF"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nachname (z. B. Mustermann)"
          placeholderTextColor="#9CA3AF"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-Mail-Adresse"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Passwort (min. 6 Zeichen)"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="KFZ-Kennzeichen (z. B. GM XX 0000)"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="characters"
          value={licensePlate}
          onChangeText={setLicensePlate}
        />
        <TextInput
          style={styles.input}
          placeholder="Straße & Hausnummer"
          placeholderTextColor="#9CA3AF"
          value={street}
          onChangeText={setStreet}
        />
        <TextInput
          style={styles.input}
          placeholder="PLZ & Ort (z. B. 51643 Gummersbach)"
          placeholderTextColor="#9CA3AF"
          value={cityZip}
          onChangeText={setCityZip}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefonnummer"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Pressable
          style={styles.checkboxRow}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
            {acceptedTerms ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={styles.checkboxLabel}>Ich stimme hiermit den AGB zu!</Text>
        </Pressable>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <Pressable
          style={styles.submitButton}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Speichert...' : 'Weiter'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { paddingHorizontal: 24, paddingTop: 14, paddingBottom: 36 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: { fontSize: 30, fontWeight: '800', color: '#D9383A' },
  cityBadge: { alignItems: 'flex-end' },
  cityText: { fontSize: 11, fontWeight: '600', color: '#374151', textAlign: 'right' },
  title: { fontSize: 24, fontWeight: '700', color: '#3B7DDD', marginBottom: 16 },
  input: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#3B7DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#3B7DDD' },
  checkmark: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  checkboxLabel: { fontSize: 13, color: '#374151' },
  errorText: { color: '#DC2626', fontSize: 13, marginBottom: 10, textAlign: 'center' },
  submitButton: {
    backgroundColor: '#E8C547',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  submitButtonText: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
});