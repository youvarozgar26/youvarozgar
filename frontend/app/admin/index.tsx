import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../../src/constants/colors';
import { getUsers, getStats, getJobCategories, getLocations, createJob, User, JobCategory, Location } from '../../src/utils/api';
import { Picker } from '@react-native-picker/picker';

export default function AdminScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [showJobModal, setShowJobModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'jobs'>('users');

  // Job form state
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    salary_min: '',
    salary_max: '',
    employer_name: '',
    employer_mobile: '',
  });

  useEffect(() => {
    loadData();
  }, [filterCategory, filterLocation]);

  const loadData = async () => {
    try {
      const [usersData, statsData, categoriesData, locationsData] = await Promise.all([
        getUsers({ category: filterCategory || undefined, location: filterLocation || undefined }),
        getStats(),
        getJobCategories(),
        getLocations(),
      ]);
      setUsers(usersData);
      setStats(statsData);
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

  const handleCreateJob = async () => {
    if (!jobForm.title || !jobForm.category || !jobForm.location || !jobForm.employer_name || !jobForm.employer_mobile) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      await createJob({
        ...jobForm,
        salary_min: parseInt(jobForm.salary_min) || 0,
        salary_max: parseInt(jobForm.salary_max) || 0,
      });
      Alert.alert('Success', 'Job posted successfully!');
      setShowJobModal(false);
      setJobForm({
        title: '',
        description: '',
        category: '',
        location: '',
        salary_min: '',
        salary_max: '',
        employer_name: '',
        employer_mobile: '',
      });
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to create job');
    }
  };

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? `${cat.name_hi} (${cat.name_en})` : categoryId;
  };

  const getLocationName = (locationId: string) => {
    const loc = locations.find((l) => l.id === locationId);
    return loc ? `${loc.city_hi} (${loc.city_en})` : locationId;
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color={COLORS.primaryBlue} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <TouchableOpacity onPress={() => setShowJobModal(true)} style={styles.addButton}>
          <MaterialIcons name="add" size={28} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: COLORS.primaryBlue }]}>
            <MaterialIcons name="people" size={32} color={COLORS.white} />
            <Text style={styles.statNumber}>{stats.total_users}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: COLORS.primaryOrange }]}>
            <MaterialIcons name="work" size={32} color={COLORS.white} />
            <Text style={styles.statNumber}>{stats.total_jobs}</Text>
            <Text style={styles.statLabel}>Active Jobs</Text>
          </View>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Users ({users.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'jobs' && styles.activeTab]}
          onPress={() => setActiveTab('jobs')}
        >
          <Text style={[styles.tabText, activeTab === 'jobs' && styles.activeTabText]}>
            Post Job
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Category:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filterCategory}
              onValueChange={setFilterCategory}
              style={styles.picker}
            >
              <Picker.Item label="All" value="" />
              {categories.map((cat) => (
                <Picker.Item key={cat.id} label={cat.name_en} value={cat.id} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Location:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filterLocation}
              onValueChange={setFilterLocation}
              style={styles.picker}
            >
              <Picker.Item label="All" value="" />
              {locations.map((loc) => (
                <Picker.Item key={loc.id} label={loc.city_en} value={loc.id} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Users List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primaryOrange]} />
        }
      >
        {users.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="people-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        ) : (
          users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userAvatar}>
                <MaterialIcons name="person" size={24} color={COLORS.white} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userMobile}>+91 {user.mobile}</Text>
                <View style={styles.userMeta}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{getCategoryName(user.job_category)}</Text>
                  </View>
                  <View style={[styles.badge, styles.locationBadge]}>
                    <Text style={styles.badgeText}>{getLocationName(user.location)}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.userStatus}>
                <MaterialIcons
                  name={user.is_verified ? 'verified' : 'pending'}
                  size={24}
                  color={user.is_verified ? COLORS.accentGreen : COLORS.warning}
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Create Job Modal */}
      <Modal visible={showJobModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Post New Job</Text>
              <TouchableOpacity onPress={() => setShowJobModal(false)}>
                <MaterialIcons name="close" size={28} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.inputLabel}>Job Title *</Text>
              <TextInput
                style={styles.input}
                value={jobForm.title}
                onChangeText={(text) => setJobForm({ ...jobForm, title: text })}
                placeholder="e.g., Waiter needed"
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={jobForm.description}
                onChangeText={(text) => setJobForm({ ...jobForm, description: text })}
                placeholder="Job description"
                multiline
                numberOfLines={3}
              />

              <Text style={styles.inputLabel}>Category *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={jobForm.category}
                  onValueChange={(value) => setJobForm({ ...jobForm, category: value })}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Category" value="" />
                  {categories.map((cat) => (
                    <Picker.Item key={cat.id} label={`${cat.name_hi} (${cat.name_en})`} value={cat.id} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.inputLabel}>Location *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={jobForm.location}
                  onValueChange={(value) => setJobForm({ ...jobForm, location: value })}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Location" value="" />
                  {locations.map((loc) => (
                    <Picker.Item key={loc.id} label={`${loc.city_hi} (${loc.city_en})`} value={loc.id} />
                  ))}
                </Picker>
              </View>

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Min Salary</Text>
                  <TextInput
                    style={styles.input}
                    value={jobForm.salary_min}
                    onChangeText={(text) => setJobForm({ ...jobForm, salary_min: text })}
                    placeholder="10000"
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Max Salary</Text>
                  <TextInput
                    style={styles.input}
                    value={jobForm.salary_max}
                    onChangeText={(text) => setJobForm({ ...jobForm, salary_max: text })}
                    placeholder="20000"
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Employer Name *</Text>
              <TextInput
                style={styles.input}
                value={jobForm.employer_name}
                onChangeText={(text) => setJobForm({ ...jobForm, employer_name: text })}
                placeholder="Company/Person name"
              />

              <Text style={styles.inputLabel}>Employer Mobile *</Text>
              <TextInput
                style={styles.input}
                value={jobForm.employer_mobile}
                onChangeText={(text) => setJobForm({ ...jobForm, employer_mobile: text })}
                placeholder="10-digit mobile"
                keyboardType="phone-pad"
                maxLength={10}
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleCreateJob}>
                <Text style={styles.submitButtonText}>Post Job</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  addButton: {
    backgroundColor: COLORS.primaryOrange,
    padding: SPACING.sm,
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  activeTab: {
    borderBottomColor: COLORS.primaryOrange,
  },
  tabText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  activeTabText: {
    color: COLORS.primaryOrange,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  filterItem: {
    flex: 1,
  },
  filterLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  pickerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  picker: {
    height: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  userName: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  userMobile: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  userMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  badge: {
    backgroundColor: COLORS.primaryBlue,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  locationBadge: {
    backgroundColor: COLORS.primaryOrange,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
  },
  userStatus: {
    marginLeft: SPACING.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  modalScroll: {
    padding: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfInput: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: COLORS.primaryOrange,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  submitButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});
