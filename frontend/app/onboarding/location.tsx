import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../../src/constants/colors';
import { VOICE_TEXTS, BUTTON_TEXTS } from '../../src/constants/voiceTexts';
import { useVoice } from '../../src/hooks/useVoice';
import { BigButton } from '../../src/components/BigButton';
import { VoiceButton } from '../../src/components/VoiceButton';
import { AvatarAnimation } from '../../src/components/AvatarAnimation';
import { LocationCard } from '../../src/components/LocationCard';
import { useUserStore } from '../../src/store/userStore';
import { getLocations, Location } from '../../src/utils/api';

export default function LocationScreen() {
  const router = useRouter();
  const { speak, stop, isSpeaking } = useVoice();
  const { location, setLocation } = useUserStore();
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSpoken, setHasSpoken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    if (!loading && !hasSpoken) {
      const timer = setTimeout(() => {
        speak(VOICE_TEXTS.location.main);
        setHasSpoken(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = locations.filter(
        (loc) =>
          loc.city_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.city_hi.includes(searchQuery)
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations);
    }
  }, [searchQuery, locations]);

  const loadLocations = async () => {
    try {
      const data = await getLocations();
      setLocations(data);
      setFilteredLocations(data);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplay = () => {
    speak(VOICE_TEXTS.location.main);
  };

  const handleLocationSelect = (locationId: string, cityHi: string) => {
    setSelectedLocation(locationId);
    speak(`आपने ${cityHi} चुना`);
  };

  const handleNext = () => {
    if (selectedLocation) {
      setLocation(selectedLocation);
      stop();
      router.push('/onboarding/success');
    }
  };

  const handleBack = () => {
    stop();
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primaryOrange} />
          <Text style={styles.loadingText}>लोड हो रहा है...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color={COLORS.primaryBlue} />
        </TouchableOpacity>
        <Text style={styles.stepText}>Step 5/5</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '100%' }]} />
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <AvatarAnimation isSpeaking={isSpeaking} size={80} />
        <View style={styles.titleTextContainer}>
          <Text style={styles.title}>शहर चुनें</Text>
          <Text style={styles.subtitle}>Select your city</Text>
        </View>
        <VoiceButton
          onPress={handleReplay}
          isSpeaking={isSpeaking}
          size="small"
        />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="शहर खोजें / Search city"
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Locations List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredLocations.map((loc) => (
          <LocationCard
            key={loc.id}
            cityHi={loc.city_hi}
            cityEn={loc.city_en}
            stateHi={loc.state_hi}
            isSelected={selectedLocation === loc.id}
            onPress={() => handleLocationSelect(loc.id, loc.city_hi)}
          />
        ))}
      </ScrollView>

      {/* Button */}
      <View style={styles.buttonSection}>
        <BigButton
          title={BUTTON_TEXTS.finish}
          onPress={handleNext}
          disabled={!selectedLocation}
          icon="check"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backButton: {
    padding: SPACING.sm,
  },
  stepText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  placeholder: {
    width: 44,
  },
  progressContainer: {
    height: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.accentGreen,
    borderRadius: 2,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  titleTextContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  buttonSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.md,
  },
});
