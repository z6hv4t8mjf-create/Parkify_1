import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

type Profile = {
  first_name: string;
  last_name: string;
  license_plate: string;
};

type ParkingSpot = {
  id: string;
  title: string;
  address: string;
  status: 'free' | 'paid' | 'occupied';
  price_per_hour: number;
  lat: number;
  lng: number;
};

export default function HomeScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [activeSpot, setActiveSpot] = useState<ParkingSpot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [onlyFree, setOnlyFree] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();

    if (userData.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, license_plate')
        .eq('id', userData.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }
    }

    const { data: spotsData } = await supabase
      .from('parking_spots')
      .select('*')
      .order('title', { ascending: true });

    if (spotsData) {
      setSpots(spotsData as ParkingSpot[]);
    }
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  const filteredSpots = spots.filter((spot) => {
    const matchesSearch =
      spot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFree = !onlyFree || spot.status === 'free';
    return matchesSearch && matchesFree;
  });

  function getStatusMeta(status: ParkingSpot['status']) {
    if (status === 'free') return { label: 'Frei', bg: '#DCFCE7', color: '#166534', dot: '#22C55E' };
    if (status === 'paid') return { label: 'Gebühr', bg: '#FEF9C3', color: '#854D0E', dot: '#EAB308' };
    return { label: 'Belegt', bg: '#FEE2E2', color: '#991B1B', dot: '#EF4444' };
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Parkify</Text>
            <Text style={styles.citySub}>Stadt Gummersbach</Text>
          </View>
          <View style={styles.headerRight}>
            {profile?.license_plate ? (
              <View style={styles.plateBadge}>
                <Text style={styles.plateText}>{profile.license_plate}</Text>
              </View>
            ) : null}
            <Pressable style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Abmelden</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.greeting}>
          Hallo{profile?.first_name ? `, ${profile.first_name}` : ''}!
        </Text>

        <View style={styles.ticketBanner}>
          <View style={styles.ticketTopRow}>
            <Text style={styles.ticketTag}>AKTIVES TICKET</Text>
            <Text style={styles.ticketPlate}>
              {profile?.license_plate ?? 'GM XX 0000'}
            </Text>
          </View>
          {activeSpot ? (
            <View>
              <Text style={styles.ticketTitle}>{activeSpot.title}</Text>
              <Text style={styles.ticketAddress}>{activeSpot.address}</Text>
              <Pressable
                style={styles.stopTicketBtn}
                onPress={() => setActiveSpot(null)}
              >
                <Text style={styles.stopTicketText}>Parkvorgang beenden</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.ticketEmpty}>
              Kein aktiver Parkvorgang – wähle unten einen Parkplatz aus.
            </Text>
          )}
        </View>

        <View style={styles.actionRow}>
          <Pressable
            style={[styles.actionCard, onlyFree && styles.actionCardActive]}
            onPress={() => setOnlyFree(!onlyFree)}
          >
            <Text style={styles.actionTitle}>Parken</Text>
            <Text style={styles.actionSub}>
              {onlyFree ? 'Filter: Nur freie Plätze' : 'Alle Plätze anzeigen'}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.actionCard, showSearch && styles.actionCardActive]}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Text style={styles.actionTitle}>Adresse</Text>
            <Text style={styles.actionSub}>Straße / Ort suchen</Text>
          </Pressable>
        </View>

        {showSearch ? (
          <TextInput
            style={styles.searchInput}
            placeholder="Straße oder Parkplatz in Gummersbach suchen..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        ) : null}

        <View style={styles.mapPreviewCard}>
          <View style={styles.mapHeaderRow}>
            <Text style={styles.sectionTitle}>Karte · Gummersbach Zentrum</Text>
            <Text style={styles.mapCoords}>51.0265° N, 7.5648° E</Text>
          </View>
          <View style={styles.mapCanvas}>
            {filteredSpots.map((spot, index) => {
              const meta = getStatusMeta(spot.status);
              return (
                <Pressable
                  key={spot.id}
                  style={[
                    styles.mapPin,
                    {
                      top: 22 + ((index * 37) % 110),
                      left: 24 + ((index * 71) % 210),
                      backgroundColor: meta.dot,
                    },
                  ]}
                  onPress={() => spot.status !== 'occupied' && setActiveSpot(spot)}
                >
                  <Text style={styles.mapPinText}>P</Text>
                </Pressable>
              );
            })}
            <Text style={styles.mapHint}>
              Tippe auf einen grünen/gelben Pin oder wähle unten einen Platz
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Verfügbare Parkplätze ({filteredSpots.length})
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#3B7DDD" style={{ marginTop: 20 }} />
        ) : (
          filteredSpots.map((spot) => {
            const meta = getStatusMeta(spot.status);
            const isSelected = activeSpot?.id === spot.id;

            return (
              <View key={spot.id} style={styles.spotCard}>
                <View style={styles.spotInfo}>
                  <View style={styles.spotTitleRow}>
                    <Text style={styles.spotTitle}>{spot.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                      <Text style={[styles.statusText, { color: meta.color }]}>
                        {meta.label}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.spotAddress}>{spot.address}</Text>
                  <Text style={styles.spotPrice}>
                    {spot.price_per_hour === 0
                      ? 'Kostenlos'
                      : `${spot.price_per_hour.toFixed(2).replace('.', ',')} € / Std.`}
                  </Text>
                </View>

                <Pressable
                  style={[
                    styles.parkBtn,
                    spot.status === 'occupied' && styles.parkBtnDisabled,
                    isSelected && styles.parkBtnActive,
                  ]}
                  disabled={spot.status === 'occupied'}
                  onPress={() => setActiveSpot(spot)}
                >
                  <Text style={styles.parkBtnText}>
                    {isSelected
                      ? 'Aktiv'
                      : spot.status === 'occupied'
                      ? 'Belegt'
                      : 'Parken'}
                  </Text>
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  logo: { fontSize: 28, fontWeight: '800', color: '#D9383A' },
  citySub: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  plateBadge: {
    borderWidth: 1.5,
    borderColor: '#1F2937',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  plateText: { fontSize: 12, fontWeight: '800', color: '#111827' },
  logoutBtn: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  greeting: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 14 },
  ticketBanner: {
    backgroundColor: '#3B7DDD',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  ticketTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ticketTag: {
    backgroundColor: '#E8C547',
    color: '#1F2937',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ticketPlate: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  ticketTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800', marginTop: 4 },
  ticketAddress: { color: '#DBEAFE', fontSize: 13, marginTop: 2 },
  ticketEmpty: { color: '#EFF6FF', fontSize: 13, marginTop: 4 },
  stopTicketBtn: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    marginTop: 10,
  },
  stopTicketText: { color: '#D9383A', fontWeight: '700', fontSize: 12 },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  actionCard: {
    flex: 1,
    backgroundColor: '#E8C547',
    borderRadius: 14,
    padding: 16,
  },
  actionCardActive: {
    borderWidth: 2,
    borderColor: '#1F2937',
  },
  actionTitle: { fontSize: 17, fontWeight: '800', color: '#1F2937' },
  actionSub: { fontSize: 12, color: '#374151', marginTop: 3 },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#111827',
    marginBottom: 14,
  },
  mapPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapCoords: { fontSize: 11, color: '#6B7280' },
  mapCanvas: {
    height: 170,
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 10,
    overflow: 'hidden',
  },
  mapPin: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  mapPinText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  mapHint: {
    fontSize: 11,
    color: '#1E3A8A',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 10 },
  spotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  spotInfo: { flex: 1, paddingRight: 10 },
  spotTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  spotTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '700' },
  spotAddress: { fontSize: 12, color: '#6B7280', marginTop: 3 },
  spotPrice: { fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 4 },
  parkBtn: {
    backgroundColor: '#E8C547',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  parkBtnDisabled: { backgroundColor: '#E5E7EB' },
  parkBtnActive: { backgroundColor: '#22C55E' },
  parkBtnText: { fontSize: 13, fontWeight: '700', color: '#1F2937' },
});
