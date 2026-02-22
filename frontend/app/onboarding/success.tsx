import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../../src/constants/colors';
import { VOICE_TEXTS, BUTTON_TEXTS } from '../../src/constants/voiceTexts';
import { useVoice } from '../../src/hooks/useVoice';
import { BigButton } from '../../src/components/BigButton';
import { VoiceButton } from '../../src/components/VoiceButton';
import { useUserStore } from '../../src/store/userStore';
import { registerUser } from '../../src/utils/api';

const { width } = Dimensions.get('window');

export default function SuccessScreen() {
  const router = useRouter();
  const { speak, stop, isSpeaking } = useVoice();
  const { name, mobile, jobCategory, location, setRegistered, clearUser } = useUserStore();
  const [hasSpoken, setHasSpoken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registered, setRegisteredLocal] = useState(false);

  useEffect(() => {
    registerNewUser();
    return () => {
      stop();
    };
  }, []);

  const registerNewUser = async () => {
    try {
      const user = await registerUser({
        name,
        mobile,
        job_category: jobCategory,
        location,
      });
      setRegistered(true, user.id);
      setRegisteredLocal(true);
      
      // Play success message after registration
      setTimeout(() => {
        speak(VOICE_TEXTS.success.main);
        setHasSpoken(true);
      }, 500);
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error?.response?.data?.detail || 'रजिस्ट्रेशन में समस्या';
      Alert.alert('त्रुटि', message, [
        {
          text: 'वापस जाएं',
          onPress: () => {
            clearUser();
            router.replace('/');
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReplay = () => {
    speak(VOICE_TEXTS.success.main);
  };

  const handleGoHome = () => {
    stop();
    router.replace('/home');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <MaterialIcons name="hourglass-empty" size={64} color={COLORS.primaryOrange} />
          <Text style={styles.loadingText}>रजिस्ट्रेशन हो रहा है...</Text>
          <Text style={styles.loadingSubtext}>Please wait</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!registered) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="check" size={80} color={COLORS.white} />
          </View>
        </View>

        {/* Success Text */}
        <View style={styles.textSection}>
          <Text style={styles.congratsText}>बधाई हो!</Text>
          <Text style={styles.title}>रजिस्ट्रेशन सफल</Text>
          <Text style={styles.subtitle}>Registration Successful</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={24} color={COLORS.primaryBlue} />
            <Text style={styles.infoLabel}>नाम:</Text>
            <Text style={styles.infoValue}>{name}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={24} color={COLORS.primaryBlue} />
            <Text style={styles.infoLabel}>मोबाइल:</Text>
            <Text style={styles.infoValue}>+91 {mobile}</Text>
          </View>
        </View>

        {/* Message */}
        <Text style={styles.message}>
          अब आपको जल्दी ही नौकरी की जानकारी मिलेगी!
        </Text>

        {/* Voice Button */}
        <View style={styles.voiceSection}>
          <VoiceButton
            onPress={handleReplay}
            isSpeaking={isSpeaking}
            size="large"
          />
          <Text style={styles.replayText}>{BUTTON_TEXTS.replay}</Text>
        </View>

        {/* Home Button */}
        <View style={styles.buttonSection}>
          <BigButton
            title={BUTTON_TEXTS.goHome}
            onPress={handleGoHome}
            icon="home"
          />
        </View>
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
    marginTop: SPACING.lg,
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  loadingSubtext: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.accentGreen,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.accentGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  congratsText: {
    fontSize: FONT_SIZES.hero,
    fontWeight: 'bold',
    color: COLORS.accentGreen,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    marginTop: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  infoValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  message: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.lg,
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
    marginTop: 'auto',
    marginBottom: SPACING.xl,
  },
});
