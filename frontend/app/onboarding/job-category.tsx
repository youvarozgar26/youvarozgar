import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../../src/constants/colors';
import { VOICE_TEXTS, BUTTON_TEXTS } from '../../src/constants/voiceTexts';
import { useVoice } from '../../src/hooks/useVoice';
import { BigButton } from '../../src/components/BigButton';
import { VoiceButton } from '../../src/components/VoiceButton';
import { AvatarAnimation } from '../../src/components/AvatarAnimation';
import { JobCategoryCard } from '../../src/components/JobCategoryCard';
import { useUserStore } from '../../src/store/userStore';
import { getJobCategories, JobCategory } from '../../src/utils/api';

export default function JobCategoryScreen() {
  const router = useRouter();
  const { speak, stop, isSpeaking } = useVoice();
  const { jobCategory, setJobCategory } = useUserStore();
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(jobCategory);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (!loading && !hasSpoken) {
      const timer = setTimeout(() => {
        speak(VOICE_TEXTS.jobCategory.main);
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

  const loadCategories = async () => {
    try {
      const data = await getJobCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplay = () => {
    speak(VOICE_TEXTS.jobCategory.main);
  };

  const handleCategorySelect = (categoryId: string, categoryHi: string) => {
    setSelectedCategory(categoryId);
    speak(`आपने ${categoryHi} चुना`);
  };

  const handleNext = () => {
    if (selectedCategory) {
      setJobCategory(selectedCategory);
      stop();
      router.push('/onboarding/location');
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
        <Text style={styles.stepText}>Step 4/5</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: '80%' }]} />
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <AvatarAnimation isSpeaking={isSpeaking} size={80} />
        <View style={styles.titleTextContainer}>
          <Text style={styles.title}>काम चुनें</Text>
          <Text style={styles.subtitle}>Select your job type</Text>
        </View>
        <VoiceButton
          onPress={handleReplay}
          isSpeaking={isSpeaking}
          size="small"
        />
      </View>

      {/* Categories Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {categories.map((category) => (
            <View key={category.id} style={styles.gridItem}>
              <JobCategoryCard
                id={category.id}
                nameHi={category.name_hi}
                nameEn={category.name_en}
                icon={category.icon}
                isSelected={selectedCategory === category.id}
                onPress={() => handleCategorySelect(category.id, category.name_hi)}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Button */}
      <View style={styles.buttonSection}>
        <BigButton
          title={BUTTON_TEXTS.next}
          onPress={handleNext}
          disabled={!selectedCategory}
          icon="arrow-forward"
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
    backgroundColor: COLORS.primaryOrange,
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
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: SPACING.md,
  },
  buttonSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.md,
  },
});
