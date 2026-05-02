import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../src/constants/colors';
import { APP_CONFIG, LOGO_URL, STATS, WHY_YOUVAROZGAR, TESTIMONIALS, FOUNDER } from '../src/constants/appData';
import { useVoice } from '../src/hooks/useVoice';
import { VOICE_GUIDE } from '../src/constants/appData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { speak, stop, isSpeaking } = useVoice();
  const [hasSpoken, setHasSpoken] = useState(false);

  useEffect(() => {
    // Auto-play welcome voice
    const timer = setTimeout(() => {
      if (!hasSpoken) {
        speak(VOICE_GUIDE.welcome);
        setHasSpoken(true);
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, []);

  const openWhatsApp = () => {
    const url = `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent(APP_CONFIG.whatsappMessage)}`;
    Linking.openURL(url);
  };

  const handleVoiceGuide = () => {
    speak(VOICE_GUIDE.welcome);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="contain" />
          <TouchableOpacity onPress={handleVoiceGuide} style={styles.voiceButton}>
            <MaterialIcons 
              name={isSpeaking ? "volume-up" : "record-voice-over"} 
              size={24} 
              color={COLORS.white} 
            />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.tagline}>{APP_CONFIG.tagline}</Text>
          <Text style={styles.heroTitle}>नौकरियाँ ढूंढना{"\n"}अब हुआ आसान</Text>
          <Text style={styles.heroSubtitle}>
            मुंबई और महाराष्ट्र में <Text style={styles.highlight}>jobs</Text> और <Text style={styles.highlight}>workers</Text> अब एक क्लिक दूर। बिना middleman, सीधे आप तक।
          </Text>

          {/* CTA Buttons */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push('/job-seeker')}
            >
              <MaterialIcons name="work" size={20} color={COLORS.white} />
              <Text style={styles.primaryButtonText}>मुझे नौकरी चाहिए</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/employer')}
            >
              <MaterialIcons name="people" size={20} color={COLORS.primaryBlue} />
              <Text style={styles.secondaryButtonText}>मुझे वर्कर चाहिए</Text>
            </TouchableOpacity>
          </View>

          {/* Trust Badges */}
          <View style={styles.trustBadges}>
            <View style={styles.badge}>
              <MaterialIcons name="block" size={16} color={COLORS.accentGreen} />
              <Text style={styles.badgeText}>No Middleman</Text>
            </View>
            <View style={styles.badge}>
              <MaterialIcons name="check-circle" size={16} color={COLORS.accentGreen} />
              <Text style={styles.badgeText}>Free Registration</Text>
            </View>
            <View style={styles.badge}>
              <MaterialIcons name="verified" size={16} color={COLORS.accentGreen} />
              <Text style={styles.badgeText}>Verified Jobs</Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{STATS.workers}</Text>
            <Text style={styles.statLabel}>{STATS.workersLabel}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{STATS.companies}</Text>
            <Text style={styles.statLabel}>{STATS.companiesLabel}</Text>
          </View>
        </View>

        {/* Why Youvarozgar Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTag}>WHY YOUVAROZGAR</Text>
          <Text style={styles.sectionTitle}>हम क्यों अलग हैं?</Text>
          <Text style={styles.sectionSubtitle}>6 reasons जो हमें Maharashtra का सबसे trusted platform बनाते हैं</Text>
          
          <View style={styles.featuresGrid}>
            {WHY_YOUVAROZGAR.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <MaterialIcons name={feature.icon as any} size={28} color={COLORS.primaryOrange} />
                </View>
                <Text style={styles.featureTitle}>{feature.titleHi}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Testimonials Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTag}>TESTIMONIALS</Text>
          <Text style={styles.sectionTitle}>हमारे खुश users की कहानी</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.testimonialScroll}>
            {TESTIMONIALS.map((testimonial, index) => (
              <View key={index} style={styles.testimonialCard}>
                <Text style={styles.testimonialText}>"{testimonial.message}"</Text>
                <View style={styles.testimonialAuthor}>
                  <Image source={{ uri: testimonial.image }} style={styles.testimonialImage} />
                  <View>
                    <Text style={styles.testimonialName}>{testimonial.name}</Text>
                    <Text style={styles.testimonialRole}>{testimonial.role}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* About / Founder Section */}
        <TouchableOpacity style={styles.founderSection} onPress={() => router.push('/about')}>
          <View style={styles.founderContent}>
            <Image source={{ uri: FOUNDER.image }} style={styles.founderImage} />
            <View style={styles.founderInfo}>
              <Text style={styles.founderName}>{FOUNDER.name}</Text>
              <Text style={styles.founderTitle}>{FOUNDER.title}</Text>
              <Text style={styles.founderMessage} numberOfLines={2}>{FOUNDER.message}</Text>
            </View>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Bottom CTA */}
        <View style={styles.bottomCta}>
          <Text style={styles.bottomCtaTitle}>Ready to grow with Youvarozgar?</Text>
          <Text style={styles.bottomCtaSubtitle}>आज ही शुरू करें — चाहे नौकरी ढूंढनी हो या worker चाहिए</Text>
          
          <View style={styles.bottomCtaButtons}>
            <TouchableOpacity 
              style={styles.ctaButtonSmall}
              onPress={() => router.push('/job-seeker')}
            >
              <Text style={styles.ctaButtonSmallText}>Apply Job</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.ctaButtonSmall, styles.ctaButtonOutline]}
              onPress={() => router.push('/employer')}
            >
              <Text style={[styles.ctaButtonSmallText, styles.ctaButtonOutlineText]}>Hire Worker</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* WhatsApp FAB */}
      <TouchableOpacity style={styles.whatsappFab} onPress={openWhatsApp}>
        <MaterialIcons name="chat" size={28} color={COLORS.white} />
      </TouchableOpacity>
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
  logo: {
    width: 140,
    height: 45,
  },
  voiceButton: {
    backgroundColor: COLORS.primaryOrange,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  tagline: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primaryOrange,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  heroTitle: {
    fontSize: FONT_SIZES.hero,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    lineHeight: 44,
    marginBottom: SPACING.md,
  },
  heroSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  highlight: {
    color: COLORS.primaryOrange,
    fontWeight: '600',
  },
  ctaContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  primaryButton: {
    backgroundColor: COLORS.primaryOrange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primaryBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  secondaryButtonText: {
    color: COLORS.primaryBlue,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  badgeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  statsSection: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.primaryBlue,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZES.hero,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: SPACING.xs,
  },
  section: {
    padding: SPACING.lg,
  },
  sectionTag: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primaryOrange,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  featureCard: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.featureIconBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  featureTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  featureDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  testimonialScroll: {
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  testimonialCard: {
    width: width * 0.8,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  testimonialText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    lineHeight: 24,
    marginBottom: SPACING.md,
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  testimonialImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  testimonialName: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  testimonialRole: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  founderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  founderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  founderImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  founderInfo: {
    flex: 1,
  },
  founderName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  founderTitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primaryOrange,
    fontWeight: '600',
  },
  founderMessage: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  bottomCta: {
    backgroundColor: COLORS.primaryBlue,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  bottomCtaTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  bottomCtaSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  bottomCtaButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  ctaButtonSmall: {
    backgroundColor: COLORS.primaryOrange,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  ctaButtonSmallText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.md,
  },
  ctaButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  ctaButtonOutlineText: {
    color: COLORS.white,
  },
  whatsappFab: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: '#25D366',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
