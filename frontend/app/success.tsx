import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../src/constants/colors';
import { LOGO_URL, APP_CONFIG, VOICE_GUIDE } from '../src/constants/appData';
import { useVoice } from '../src/hooks/useVoice';

export default function SuccessScreen() {
  const router = useRouter();
  const { speak } = useVoice();

  useEffect(() => {
    speak(VOICE_GUIDE.success);
  }, []);

  const openWhatsApp = () => {
    const url = `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent(APP_CONFIG.whatsappMessage)}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="contain" />

        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="check" size={80} color={COLORS.white} />
          </View>
        </View>

        {/* Success Text */}
        <Text style={styles.title}>बधाई हो!</Text>
        <Text style={styles.subtitle}>आपका form submit हो गया</Text>
        
        <View style={styles.infoCard}>
          <MaterialIcons name="access-time" size={24} color={COLORS.primaryOrange} />
          <Text style={styles.infoText}>हमारी team 24 घंटे में आपको call करेगी</Text>
        </View>

        {/* WhatsApp Button */}
        <TouchableOpacity style={styles.whatsappButton} onPress={openWhatsApp}>
          <MaterialIcons name="chat" size={24} color={COLORS.white} />
          <Text style={styles.whatsappButtonText}>WhatsApp पर बात करें</Text>
        </TouchableOpacity>

        {/* Home Button */}
        <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/')}>
          <MaterialIcons name="home" size={24} color={COLORS.primaryBlue} />
          <Text style={styles.homeButtonText}>Home जाएं</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  logo: {
    width: 160,
    height: 50,
    marginBottom: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.accentGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.hero,
    fontWeight: 'bold',
    color: COLORS.accentGreen,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    flex: 1,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    width: '100%',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  whatsappButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primaryBlue,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    width: '100%',
    justifyContent: 'center',
  },
  homeButtonText: {
    color: COLORS.primaryBlue,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
});
