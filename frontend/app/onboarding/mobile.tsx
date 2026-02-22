import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../../src/constants/colors';
import { VOICE_TEXTS, BUTTON_TEXTS } from '../../src/constants/voiceTexts';
import { useVoice } from '../../src/hooks/useVoice';
import { BigButton } from '../../src/components/BigButton';
import { VoiceButton } from '../../src/components/VoiceButton';
import { AvatarAnimation } from '../../src/components/AvatarAnimation';
import { useUserStore } from '../../src/store/userStore';
import { sendOTP } from '../../src/utils/api';

export default function MobileScreen() {
  const router = useRouter();
  const { speak, stop, isSpeaking } = useVoice();
  const { mobile, setMobile } = useUserStore();
  const [localMobile, setLocalMobile] = useState(mobile);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasSpoken) {
        speak(VOICE_TEXTS.mobile.main);
        setHasSpoken(true);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      stop();
    };
  }, []);

  const handleReplay = () => {
    speak(VOICE_TEXTS.mobile.main);
  };

  const handleNext = async () => {
    if (localMobile.length === 10) {
      setLoading(true);
      try {
        const result = await sendOTP(localMobile);
        if (result.success) {
          setMobile(localMobile);
          stop();
          router.push('/onboarding/otp');
        } else {
          Alert.alert('त्रुटि', result.message || 'OTP भेजने में समस्या');
        }
      } catch (error) {
        Alert.alert('त्रुटि', 'कृपया फिर से कोशिश करें');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    stop();
    router.back();
  };

  const handleMobileChange = (text: string) => {
    // Only allow numbers
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 10) {
      setLocalMobile(cleaned);
    }
  };

  const isValid = localMobile.length === 10;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={28} color={COLORS.primaryBlue} />
          </TouchableOpacity>
          <Text style={styles.stepText}>Step 2/5</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '40%' }]} />
        </View>

        <View style={styles.content}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <AvatarAnimation isSpeaking={isSpeaking} size={120} />
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>मोबाइल नंबर</Text>
            <Text style={styles.subtitle}>Enter mobile number</Text>
          </View>

          {/* Voice Button */}
          <View style={styles.voiceSection}>
            <VoiceButton
              onPress={handleReplay}
              isSpeaking={isSpeaking}
              size="medium"
            />
          </View>

          {/* Input */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="10 अंकों का नंबर"
                placeholderTextColor={COLORS.textMuted}
                value={localMobile}
                onChangeText={handleMobileChange}
                keyboardType="number-pad"
                maxLength={10}
                returnKeyType="next"
                onSubmitEditing={handleNext}
              />
            </View>
            <Text style={styles.hint}>आपके फोन पर OTP आएगा</Text>
          </View>

          {/* Button */}
          <View style={styles.buttonSection}>
            <BigButton
              title={BUTTON_TEXTS.sendOtp}
              onPress={handleNext}
              disabled={!isValid}
              loading={loading}
              icon="send"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  voiceSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  inputSection: {
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  countryCode: {
    backgroundColor: COLORS.primaryBlue,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.xl,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    letterSpacing: 2,
  },
  hint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  buttonSection: {
    marginTop: 'auto',
    marginBottom: SPACING.xl,
  },
});
