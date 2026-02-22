import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../src/constants/colors';
import { useUserStore } from '../src/store/userStore';
import { getJobs, getJobCategories, getLocations, Job, JobCategory, Location } from '../src/utils/api';

const { width } = Dimensions.get('window');
const LOGO_URL = 'https://customer-assets.emergentagent.com/job_avtar-register/artifacts/cm8oh3le_davinci_create_a_clean__modern_and_professional_logo_for_a.png';

export default function HomeScreen() {
  const router = useRouter();
  const { name, jobCategory, location, clearUser } = useUserStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsData, categoriesData, locationsData] = await Promise.all([
        getJobs({ category: jobCategory, location }),
        getJobCategories(),
        getLocations(),
      ]);
      setJobs(jobsData);
      setCategories(categoriesData);
      setLocations(locationsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name_hi : categoryId;
  };

  const getLocationName = (locationId: string) => {
    const loc = locations.find((l) => l.id === locationId);
    return loc ? loc.city_hi : locationId;
  };

  const handleLogout = () => {
    clearUser();
    router.replace('/');
  };

  const selectedCategory = categories.find((c) => c.id === jobCategory);
  const selectedLocation = locations.find((l) => l.id === location);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="contain" />
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primaryOrange]}
          />
        }
      >
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <View style={styles.avatarCircle}>
              <MaterialIcons name="person" size={32} color={COLORS.white} />
            </View>
            <View style={styles.welcomeText}>
              <Text style={styles.greeting}>नमस्ते, {name}!</Text>
              <Text style={styles.welcomeSubtext}>Welcome back</Text>
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.profileItem}>
              <MaterialIcons name="work" size={20} color={COLORS.primaryOrange} />
              <Text style={styles.profileText}>
                {selectedCategory?.name_hi || jobCategory}
              </Text>
            </View>
            <View style={styles.profileItem}>
              <MaterialIcons name="location-on" size={20} color={COLORS.primaryOrange} />
              <Text style={styles.profileText}>
                {selectedLocation?.city_hi || location}
              </Text>
            </View>
          </View>
        </View>

        {/* Jobs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>आपके लिए नौकरियाँ</Text>
          <Text style={styles.sectionSubtitle}>Jobs for you</Text>

          {jobs.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="work-outline" size={64} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>अभी कोई नौकरी नहीं है</Text>
              <Text style={styles.emptySubtitle}>No jobs available right now</Text>
              <Text style={styles.emptyMessage}>
                जल्दी ही आपको नौकरी की जानकारी मिलेगी!
              </Text>
            </View>
          ) : (
            jobs.map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <View style={styles.salaryBadge}>
                    <Text style={styles.salaryText}>
                      ₹{job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.jobDescription} numberOfLines={2}>
                  {job.description}
                </Text>
                <View style={styles.jobMeta}>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="work" size={16} color={COLORS.textMuted} />
                    <Text style={styles.metaText}>{getCategoryName(job.category)}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="location-on" size={16} color={COLORS.textMuted} />
                    <Text style={styles.metaText}>{getLocationName(job.location)}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>आवेदन करें</Text>
                  <MaterialIcons name="arrow-forward" size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logo: {
    width: 150,
    height: 40,
  },
  logoutButton: {
    padding: SPACING.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  welcomeCard: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    marginLeft: SPACING.md,
  },
  greeting: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  welcomeSubtext: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  profileText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    marginLeft: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    backgroundColor: COLORS.white,
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  emptyMessage: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  jobCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  jobTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  salaryBadge: {
    backgroundColor: COLORS.accentGreen,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  salaryText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '600',
  },
  jobDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  jobMeta: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryOrange,
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  applyButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.white,
    marginRight: SPACING.sm,
  },
});
