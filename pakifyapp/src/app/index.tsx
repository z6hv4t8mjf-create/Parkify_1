import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';


export default function StartScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Oberer weißer Bereich mit Logo */}
      <View style={styles.topSection}>
        <Text style={styles.brandTitle}>Parkify</Text>
        <Text style={styles.citySubtitle}>Stadt Gummersbach</Text>
      </View>

      {/* Unterer blauer Bereich mit schräger Kante */}
      <View style={styles.bottomBlue}>
        <View style={styles.diagonalCut} />

        {/* Zentrierte weiß-gelbe Auto-Karte aus Figma */}
        <Pressable
          style={styles.centerCard}
          onPress={() => router.push('/login')}
        >
          <View style={styles.cardYellowTriangle} />
          <Ionicons name="car-sport" size={58} color="#DC2626" />
        </Pressable>

        {/* Direkte Einstiegs-Buttons */}
        <View style={styles.actionArea}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.primaryButtonText}>Einloggen</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.secondaryButtonText}>Jetzt Registrieren</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    flex: 0.42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brandTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: '#D9383A',
    letterSpacing: 0.5,
  },
  citySubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginTop: 4,
  },
  bottomBlue: {
    flex: 0.58,
    backgroundColor: '#3B7DDD',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 36,
    position: 'relative',
  },
  diagonalCut: {
    position: 'absolute',
    top: -38,
    left: -20,
    right: -20,
    height: 76,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '9deg' }],
  },
  centerCard: {
    width: 124,
    height: 124,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: -24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardYellowTriangle: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 124,
    height: 64,
    backgroundColor: '#E8C547',
    transform: [{ rotate: '12deg' }, { translateY: -12 }],
  },
  actionArea: {
    width: '100%',
    paddingHorizontal: 28,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#E8C547',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#1F2937',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});