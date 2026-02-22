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

export default function NameScreen() {
  const router = useRouter();
  const { speak, stop, isSpeaking } = useVoice();
  const { name, setName } = useUserStore();
  const [localName, setLocalName] = useState(name);
  const [hasSpoken, setHasSpoken] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasSpoken) {
        speak(VOICE_TEXTS.name.main);
        setHasSpoken(true);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      stop();
    };
  }, []);

  const handleReplay = () => {
    speak(VOICE_TEXTS.name.main);
  };

  const handleNext = () => {
    if (localName.trim().length >= 2) {
      setName(localName.trim());
      stop();
      router.push('/onboarding/mobile');
    }
  };

  const handleBack = () => {
    stop();
    router.back();
  };

  const isValid = localName.trim().length >= 2;

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
          <Text style={styles.stepText}>Step 1/5</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '20%' }]} />
        </View>

        <View style={styles.content}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <AvatarAnimation isSpeaking={isSpeaking} size={120} />
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>अपना नाम लिखें</Text>
            <Text style={styles.subtitle}>Enter your name</Text>
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
              <MaterialIcons
                name="person"
                size={28}
                color={COLORS.primaryBlue}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="यहाँ नाम लिखें"
                placeholderTextColor={COLORS.textMuted}
                value={localName}
                onChangeText={setLocalName}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={handleNext}
              />
            </View>
            <Text style={styles.hint}>कम से कम 2 अक्षर लिखें</Text>
          </View>

          {/* Button */}
          <View style={styles.buttonSection}>
            <BigButton
              title={BUTTON_TEXTS.next}
              onPress={handleNext}
              disabled={!isValid}
              icon="arrow-forward"
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
    paddingHorizontal: SPACING.md,
    minHeight: 64,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.xl,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.md,
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
