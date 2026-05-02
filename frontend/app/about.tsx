import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../src/constants/colors';
import { LOGO_URL, FOUNDER, APP_CONFIG, VOICE_GUIDE } from '../src/constants/appData';
import { useVoice } from '../src/hooks/useVoice';

export default function AboutScreen() {
  const router = useRouter();
  const { speak, isSpeaking } = useVoice();

  useEffect(() => {
    // Auto-play about voice
    const timer = setTimeout(() => {
      speak(VOICE_GUIDE.aboutUs);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const openWhatsApp = () => {
    const url = `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent(APP_CONFIG.whatsappMessage)}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="contain" />
        <TouchableOpacity onPress={() => speak(VOICE_GUIDE.aboutUs)} style={styles.voiceButton}>
          <MaterialIcons 
            name={isSpeaking ? "volume-up" : "record-voice-over"} 
            size={22} 
            color={COLORS.white} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Founder Section */}
        <View style={styles.founderSection}>
          <Image source={{ uri: FOUNDER.image }} style={styles.founderImage} />
          <Text style={styles.founderName}>{FOUNDER.name}</Text>
          <View style={styles.founderBadge}>
            <MaterialIcons name="verified" size={16} color={COLORS.white} />
            <Text style={styles.founderTitle}>{FOUNDER.title}</Text>
          </View>
          <View style={styles.founderEmail}>
            <MaterialIcons name="email" size={16} color="rgba(255,255,255,0.9)" />
            <Text style={styles.founderEmailText}>youvarozgar@gmail.com</Text>
          </View>
        </View>

        {/* About Content */}
        <View style={styles.content}>
          <Text style={styles.sectionTag}>ABOUT US</Text>
          <Text style={styles.title}>Youvarozgar के बारे में</Text>
          
          <View style={styles.messageCard}>
            <MaterialIcons name="format-quote" size={32} color={COLORS.primaryOrange} />
            <Text style={styles.message}>{FOUNDER.message}</Text>
          </View>

          {/* Mission Points */}
          <Text style={styles.missionTitle}>हमारा मिशन</Text>
          
          <View style={styles.missionItem}>
            <View style={styles.missionIcon}>
              <MaterialIcons name="people" size={24} color={COLORS.primaryOrange} />
            </View>
            <View style={styles.missionText}>
              <Text style={styles.missionItemTitle}>No Middleman</Text>
              <Text style={styles.missionItemDesc}>Workers और Employers को सीधे जोड़ना — कोई बिचौलिया नहीं</Text>
            </View>
          </View>

          <View style={styles.missionItem}>
            <View style={styles.missionIcon}>
              <MaterialIcons name="verified-user" size={24} color={COLORS.primaryOrange} />
            </View>
            <View style={styles.missionText}>
              <Text style={styles.missionItemTitle}>Verified Jobs</Text>
              <Text style={styles.missionItemDesc}>हर job और worker verified — बिना धोखा</Text>
            </View>
          </View>

          <View style={styles.missionItem}>
            <View style={styles.missionIcon}>
              <MaterialIcons name="location-on" size={24} color={COLORS.primaryOrange} />
            </View>
            <View style={styles.missionText}>
              <Text style={styles.missionItemTitle}>Maharashtra Focused</Text>
              <Text style={styles.missionItemDesc}>मुंबई से पुणे तक — local jobs, local workers</Text>
            </View>
          </View>

          <View style={styles.missionItem}>
            <View style={styles.missionIcon}>
              <MaterialIcons name="flash-on" size={24} color={COLORS.primaryOrange} />
            </View>
            <View style={styles.missionText}>
              <Text style={styles.missionItemTitle}>Fast Response</Text>
              <Text style={styles.missionItemDesc}>24 घंटे में call — तेज़ और भरोसेमंद</Text>
            </View>
          </View>

          {/* Contact Section */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>संपर्क करें</Text>
            <TouchableOpacity style={styles.whatsappButton} onPress={openWhatsApp}>
              <MaterialIcons name="chat" size={24} color={COLORS.white} />
              <Text style={styles.whatsappButtonText}>WhatsApp पर बात करें</Text>
            </TouchableOpacity>
          </View>
        </View>

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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.sm,
  },
  logo: {
    width: 120,
    height: 40,
  },
  voiceButton: {
    backgroundColor: COLORS.primaryOrange,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  founderSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.primaryBlue,
  },
  founderImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: COLORS.white,
    marginBottom: SPACING.md,
  },
  founderName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  founderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryOrange,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },
  founderTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  founderEmail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  founderEmailText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FONT_SIZES.sm,
  },
  content: {
    padding: SPACING.lg,
  },
  sectionTag: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primaryOrange,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  messageCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primaryOrange,
  },
  message: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    lineHeight: 26,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
  missionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  missionItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  missionIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.featureIconBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  missionText: {
    flex: 1,
  },
  missionItemTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  missionItemDesc: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  contactSection: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.sm,
  },
  whatsappButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
});
