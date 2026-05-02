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

const { width, height } = Dimensions.get('window');

// Worker image from website
const HERO_IMAGE = 'https://images.unsplash.com/photo-1706715201231-b703e7df3395?w=600&q=80';

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

        {/* Hero Section - Website Style */}
        <View style={styles.heroSection}>
          {/* Floating Stats Badge */}
          <View style={styles.floatingStatBadge}>
            <MaterialIcons name="business" size={20} color={COLORS.primaryOrange} />
            <View>
              <Text style={styles.floatingStatNumber}>500+</Text>
              <Text style={styles.floatingStatLabel}>Companies Hiring</Text>
            </View>
          </View>

          <View style={styles.heroContent}>
            {/* Left Content */}
            <View style={styles.heroLeft}>
              <View style={styles.tagBadge}>
                <MaterialIcons name="auto-awesome" size={14} color={COLORS.primaryOrange} />
                <Text style={styles.tagline}>{APP_CONFIG.tagline}</Text>
              </View>
              
              <Text style={styles.heroTitle}>
                नौकरियाँ ढूंढना{"\n"}अब हुआ <Text style={styles.heroTitleHighlight}>आसान</Text>
              </Text>
              
              <Text style={styles.heroSubtitle}>
                मुंबई और महाराष्ट्र में <Text style={styles.highlight}>jobs</Text> और <Text style={styles.highlight}>workers</Text> अब एक क्लिक दूर। बिना middleman, सीधे आप तक।
              </Text>

              {/* CTA Buttons - Side by Side */}
              <View style={styles.ctaRow}>
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={() => router.push('/job-seeker')}
                >
                  <MaterialIcons name="work" size={18} color={COLORS.white} />
                  <Text style={styles.primaryButtonText}>मुझे नौकरी चाहिए</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => router.push('/employer')}
                >
                  <MaterialIcons name="people" size={18} color={COLORS.primaryOrange} />
                  <Text style={styles.secondaryButtonText}>मुझे वर्कर चाहिए</Text>
                </TouchableOpacity>
              </View>

              {/* Trust Badges */}
              <View style={styles.trustBadges}>
                <View style={styles.badge}>
                  <MaterialIcons name="check-circle" size={16} color={COLORS.accentGreen} />
                  <Text style={styles.badgeText}>No Middleman</Text>
                </View>
                <View style={styles.badge}>
                  <MaterialIcons name="check-circle" size={16} color={COLORS.accentGreen} />
                  <Text style={styles.badgeText}>Free Registration</Text>
                </View>
                <View style={styles.badge}>
                  <MaterialIcons name="check-circle" size={16} color={COLORS.accentGreen} />
                  <Text style={styles.badgeText}>Verified Jobs</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Hero Image */}
          <Image 
            source={{ uri: HERO_IMAGE }} 
            style={styles.heroImage} 
            resizeMode="cover"
          />

          {/* Bottom Stats Card */}
          <View style={styles.bottomStatCard}>
            <MaterialIcons name="trending-up" size={24} color={COLORS.accentGreen} />
            <View>
              <Text style={styles.bottomStatNumber}>5000+</Text>
              <Text style={styles.bottomStatLabel}>Workers Registered</Text>
            </View>
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

        {/* Footer */}
        <View style={styles.footer}>
          <Image source={{ uri: LOGO_URL }} style={styles.footerLogo} resizeMode="contain" />
          <Text style={styles.footerTagline}>{APP_CONFIG.tagline}</Text>
          
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => router.push('/about')}>
              <Text style={styles.footerLink}>About Us</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>•</Text>
            <TouchableOpacity onPress={openWhatsApp}>
              <Text style={styles.footerLink}>Contact</Text>
            </TouchableOpacity>
            <Text style={styles.footerDot}>•</Text>
            <TouchableOpacity onPress={() => router.push('/admin')}>
              <Text style={styles.footerLink}>Admin Panel</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.footerCopyright}>© 2024 Youvarozgar. All rights reserved.</Text>
          <Text style={styles.footerMadeWith}>Made with ❤️ for Maharashtra</Text>
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
    width: 180,
    height: 55,
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
    backgroundColor: COLORS.white,
    position: 'relative',
    minHeight: 450,
    overflow: 'hidden',
  },
  floatingStatBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  floatingStatNumber: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  floatingStatLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  heroContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  heroLeft: {
    width: '100%',
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  tagline: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primaryOrange,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    lineHeight: 42,
    marginBottom: SPACING.md,
  },
  heroTitleHighlight: {
    color: COLORS.primaryOrange,
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
  ctaRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primaryOrange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primaryOrange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },
  secondaryButtonText: {
    color: COLORS.primaryOrange,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  trustBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
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
  heroImage: {
    width: '100%',
    height: 220,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
  },
  bottomStatCard: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.lg,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  bottomStatNumber: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  bottomStatLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
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
  footer: {
    backgroundColor: COLORS.primaryBlue,
    padding: SPACING.xl,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  footerLogo: {
    width: 150,
    height: 45,
    tintColor: COLORS.white,
    marginBottom: SPACING.md,
  },
  footerTagline: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: SPACING.lg,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  footerLink: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontWeight: '600',
  },
  footerDot: {
    color: 'rgba(255,255,255,0.5)',
    marginHorizontal: SPACING.md,
  },
  footerCopyright: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: SPACING.xs,
  },
  footerMadeWith: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.6)',
  },
});
