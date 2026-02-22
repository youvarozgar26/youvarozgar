import React, { useEffect, useState, useRef } from 'react';
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
import { verifyOTP, sendOTP } from '../../src/utils/api';

export default function OTPScreen() {
  const router = useRouter();
  const { speak, stop, isSpeaking } = useVoice();
  const { mobile } = useUserStore();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasSpoken) {
        speak(VOICE_TEXTS.otp.main);
        setHasSpoken(true);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      stop();
    };
  }, []);

  useEffect(() => {
    // Resend timer countdown
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleReplay = () => {
    speak(VOICE_TEXTS.otp.main);
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length === 4) {
      setLoading(true);
      try {
        const result = await verifyOTP(mobile, otpString);
        if (result.success) {
          stop();
          router.push('/onboarding/job-category');
        } else {
          Alert.alert('गलत OTP', result.message || 'कृपया सही OTP डालें');
          setOtp(['', '', '', '']);
          inputRefs.current[0]?.focus();
        }
      } catch (error) {
        Alert.alert('त्रुटि', 'कृपया फिर से कोशिश करें');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResend = async () => {
    try {
      await sendOTP(mobile);
      setResendTimer(30);
      speak('नया OTP भेज दिया गया है');
    } catch (error) {
      Alert.alert('त्रुटि', 'OTP फिर से भेजने में समस्या');
    }
  };

  const handleBack = () => {
    stop();
    router.back();
  };

  const isValid = otp.every((digit) => digit !== '');

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
          <Text style={styles.stepText}>Step 3/5</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '60%' }]} />
        </View>

        <View style={styles.content}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <AvatarAnimation isSpeaking={isSpeaking} size={100} />
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>OTP डालें</Text>
            <Text style={styles.subtitle}>Enter 4-digit OTP</Text>
            <Text style={styles.mobileText}>+91 {mobile}</Text>
          </View>

          {/* Voice Button */}
          <View style={styles.voiceSection}>
            <VoiceButton
              onPress={handleReplay}
              isSpeaking={isSpeaking}
              size="medium"
            />
          </View>

          {/* OTP Input */}
          <View style={styles.otpSection}>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                  ]}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text.slice(-1), index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>
            <Text style={styles.hint}>डेमो OTP: 1234</Text>
          </View>

          {/* Resend Button */}
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResend}
            disabled={resendTimer > 0}
          >
            <Text style={[
              styles.resendText,
              resendTimer > 0 && styles.resendTextDisabled,
            ]}>
              {resendTimer > 0
                ? `${resendTimer} सेकंड बाद दोबारा भेजें`
                : `${BUTTON_TEXTS.resend}`}
            </Text>
          </TouchableOpacity>

          {/* Button */}
          <View style={styles.buttonSection}>
            <BigButton
              title={BUTTON_TEXTS.verify}
              onPress={handleVerify}
              disabled={!isValid}
              loading={loading}
              icon="check"
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
    paddingTop: SPACING.md,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.md,
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
  mobileText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.primaryOrange,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  voiceSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  otpSection: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  otpInput: {
    width: 64,
    height: 72,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    textAlign: 'center',
    fontSize: FONT_SIZES.hero,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  otpInputFilled: {
    borderColor: COLORS.primaryOrange,
    backgroundColor: '#FFF8F0',
  },
  hint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.accentGreen,
    marginTop: SPACING.md,
    fontWeight: '600',
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  resendText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primaryOrange,
    fontWeight: '600',
  },
  resendTextDisabled: {
    color: COLORS.textMuted,
  },
  buttonSection: {
    marginTop: 'auto',
    marginBottom: SPACING.xl,
  },
});
