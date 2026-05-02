import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/constants/colors';
import { getUsers, getJobs, getStats, User, Job } from '../../src/utils/api';
import { JOB_CATEGORIES, MAHARASHTRA_LOCATIONS } from '../../src/constants/appData';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'seekers' | 'employers'>('seekers');
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    const isLoggedIn = await AsyncStorage.getItem('admin_logged_in');
    if (isLoggedIn !== 'true') {
      router.replace('/admin');
    }
  };

  const loadData = async () => {
    try {
      const [usersData, jobsData, statsData] = await Promise.all([
        getUsers(),
        getJobs(),
        getStats(),
      ]);
      setUsers(usersData);
      setJobs(jobsData);
      setStats(statsData);
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

  const handleLogout = async () => {
    Alert.alert('Logout', 'Kya aap logout karna chahte hain?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.removeItem('admin_logged_in');
          router.replace('/');
        },
      },
    ]);
  };

  const getCategoryName = (id: string) => {
    const cat = JOB_CATEGORIES.find(c => c.id === id);
    return cat ? `${cat.nameHi} (${cat.name})` : id;
  };

  const getLocationName = (id: string) => {
    const loc = MAHARASHTRA_LOCATIONS.find(l => l.id === id);
    return loc ? `${loc.nameHi} (${loc.name})` : id;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Youvarozgar</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: COLORS.primaryBlue }]}>
            <MaterialIcons name="people" size={28} color={COLORS.white} />
            <Text style={styles.statNumber}>{stats.total_users}</Text>
            <Text style={styles.statLabel}>Job Seekers</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: COLORS.primaryOrange }]}>
            <MaterialIcons name="business" size={28} color={COLORS.white} />
            <Text style={styles.statNumber}>{stats.total_jobs}</Text>
            <Text style={styles.statLabel}>Employers</Text>
          </View>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'seekers' && styles.activeTab]}
          onPress={() => setActiveTab('seekers')}
        >
          <MaterialIcons 
            name="person-search" 
            size={20} 
            color={activeTab === 'seekers' ? COLORS.primaryOrange : COLORS.textMuted} 
          />
          <Text style={[styles.tabText, activeTab === 'seekers' && styles.activeTabText]}>
            Job Seekers ({users.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'employers' && styles.activeTab]}
          onPress={() => setActiveTab('employers')}
        >
          <MaterialIcons 
            name="business-center" 
            size={20} 
            color={activeTab === 'employers' ? COLORS.primaryOrange : COLORS.textMuted} 
          />
          <Text style={[styles.tabText, activeTab === 'employers' && styles.activeTabText]}>
            Employers ({jobs.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primaryOrange]} />
        }
      >
        {activeTab === 'seekers' ? (
          // Job Seekers List
          users.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="person-search" size={64} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>Koi Job Seeker nahi mila</Text>
            </View>
          ) : (
            users.map((user, index) => (
              <View key={user.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardAvatar}>
                    <MaterialIcons name="person" size={24} color={COLORS.white} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{user.name}</Text>
                    <Text style={styles.cardMobile}>📱 +91 {user.mobile}</Text>
                  </View>
                  <Text style={styles.cardIndex}>#{index + 1}</Text>
                </View>
                
                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="work" size={18} color={COLORS.primaryOrange} />
                    <Text style={styles.detailLabel}>Job Category:</Text>
                    <Text style={styles.detailValue}>{getCategoryName(user.job_category)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="location-on" size={18} color={COLORS.primaryOrange} />
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailValue}>{getLocationName(user.location)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="access-time" size={18} color={COLORS.textMuted} />
                    <Text style={styles.detailLabel}>Applied:</Text>
                    <Text style={styles.detailValue}>{formatDate(user.created_at)}</Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.callButton}
                    onPress={() => Alert.alert('Call', `Call +91 ${user.mobile}`)}
                  >
                    <MaterialIcons name="phone" size={18} color={COLORS.white} />
                    <Text style={styles.callButtonText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.whatsappButton}
                    onPress={() => Alert.alert('WhatsApp', `WhatsApp +91 ${user.mobile}`)}
                  >
                    <MaterialIcons name="chat" size={18} color={COLORS.white} />
                    <Text style={styles.whatsappButtonText}>WhatsApp</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )
        ) : (
          // Employers List
          jobs.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="business" size={64} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>Koi Employer nahi mila</Text>
            </View>
          ) : (
            jobs.map((job, index) => (
              <View key={job.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardAvatar, { backgroundColor: COLORS.primaryOrange }]}>
                    <MaterialIcons name="business" size={24} color={COLORS.white} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardName}>{job.employer_name}</Text>
                    <Text style={styles.cardMobile}>📱 +91 {job.employer_mobile}</Text>
                  </View>
                  <Text style={styles.cardIndex}>#{index + 1}</Text>
                </View>
                
                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="work" size={18} color={COLORS.primaryOrange} />
                    <Text style={styles.detailLabel}>Staff Chahiye:</Text>
                    <Text style={styles.detailValue}>{getCategoryName(job.category)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="location-on" size={18} color={COLORS.primaryOrange} />
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailValue}>{getLocationName(job.location)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="currency-rupee" size={18} color={COLORS.accentGreen} />
                    <Text style={styles.detailLabel}>Salary:</Text>
                    <Text style={styles.detailValue}>₹{job.salary_min.toLocaleString()} - ₹{job.salary_max.toLocaleString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="access-time" size={18} color={COLORS.textMuted} />
                    <Text style={styles.detailLabel}>Posted:</Text>
                    <Text style={styles.detailValue}>{formatDate(job.created_at)}</Text>
                  </View>
                </View>

                {job.description && (
                  <View style={styles.descriptionBox}>
                    <Text style={styles.descriptionText}>{job.description}</Text>
                  </View>
                )}

                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.callButton}
                    onPress={() => Alert.alert('Call', `Call +91 ${job.employer_mobile}`)}
                  >
                    <MaterialIcons name="phone" size={18} color={COLORS.white} />
                    <Text style={styles.callButtonText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.whatsappButton}
                    onPress={() => Alert.alert('WhatsApp', `WhatsApp +91 ${job.employer_mobile}`)}
                  >
                    <MaterialIcons name="chat" size={18} color={COLORS.white} />
                    <Text style={styles.whatsappButtonText}>WhatsApp</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )
        )}

        <View style={{ height: 40 }} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  logoutButton: {
    padding: SPACING.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
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
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  activeTab: {
    backgroundColor: COLORS.featureIconBg,
  },
  tabText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  activeTabText: {
    color: COLORS.primaryOrange,
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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  cardName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  cardMobile: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardIndex: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  cardDetails: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detailLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  detailValue: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  descriptionBox: {
    backgroundColor: COLORS.featureIconBg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  descriptionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryBlue,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  callButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  whatsappButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
});
