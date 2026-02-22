import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../src/constants/colors';
import { VOICE_TEXTS, BUTTON_TEXTS } from '../src/constants/voiceTexts';
import { useVoice } from '../src/hooks/useVoice';
import { BigButton } from '../src/components/BigButton';
import { VoiceButton } from '../src/components/VoiceButton';
import { AvatarAnimation } from '../src/components/AvatarAnimation';
import { useUserStore } from '../src/store/userStore';

const { width } = Dimensions.get('window');

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_avtar-register/artifacts/cm8oh3le_davinci_create_a_clean__modern_and_professional_logo_for_a.png';

export default function WelcomeScreen() {
  const router = useRouter();
  const { speak, stop, isSpeaking } = useVoice();
  const [hasSpoken, setHasSpoken] = useState(false);
  const { loadUserFromStorage, isRegistered } = useUserStore();

  useEffect(() => {
    // Load user data and check if already registered
    const checkUser = async () => {
      await loadUserFromStorage();
    };
    checkUser();
  }, []);

  useEffect(() => {
    // Check if user is already registered
    if (isRegistered) {
      router.replace('/home');
    }
  }, [isRegistered]);

  useEffect(() => {
    // Auto-play welcome message after a short delay
    const timer = setTimeout(() => {
      if (!hasSpoken) {
        speak(VOICE_TEXTS.welcome.main);
        setHasSpoken(true);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      stop();
    };
  }, []);

  const handleReplay = () => {
    speak(VOICE_TEXTS.welcome.main);
  };

  const handleStart = () => {
    stop();
    router.push('/onboarding/name');
  };

  const handleAdminAccess = () => {
    stop();
    router.push('/admin');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: LOGO_URL }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <AvatarAnimation isSpeaking={isSpeaking} size={160} />
        </View>

        {/* Welcome Text */}
        <View style={styles.textSection}>
          <Text style={styles.welcomeText}>स्वागत है!</Text>
          <Text style={styles.subtitle}>Welcome to Youvarozgar</Text>
          <Text style={styles.description}>
            यहाँ आपको अच्छा काम मिलेगा
          </Text>
        </View>

        {/* Voice Button */}
        <View style={styles.voiceSection}>
          <VoiceButton
            onPress={handleReplay}
            isSpeaking={isSpeaking}
            label={BUTTON_TEXTS.replay}
            size="large"
          />
          <Text style={styles.replayText}>{BUTTON_TEXTS.replay}</Text>
        </View>

        {/* Start Button */}
        <View style={styles.buttonSection}>
          <BigButton
            title={BUTTON_TEXTS.start}
            onPress={handleStart}
            icon="arrow-forward"
          />
        </View>

        {/* Admin Link */}
        <TouchableOpacity
          style={styles.adminLink}
          onPress={handleAdminAccess}
        >
          <MaterialIcons name="admin-panel-settings" size={20} color={COLORS.textMuted} />
          <Text style={styles.adminText}>Admin Panel</Text>
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logo: {
    width: width * 0.6,
    height: 80,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  welcomeText: {
    fontSize: FONT_SIZES.hero,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.primaryOrange,
    marginTop: SPACING.xs,
    fontWeight: '600',
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  voiceSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  replayText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  buttonSection: {
    marginBottom: SPACING.lg,
  },
  adminLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  adminText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs,
  },
});
