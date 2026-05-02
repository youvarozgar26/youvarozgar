import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../src/constants/colors';
import { LOGO_URL, JOB_CATEGORIES, MAHARASHTRA_LOCATIONS, VOICE_GUIDE, HOW_IT_WORKS_WORKERS } from '../src/constants/appData';
import { useVoice } from '../src/hooks/useVoice';
import { registerUser } from '../src/utils/api';

export default function JobSeekerScreen() {
  const router = useRouter();
  const { speak, isSpeaking } = useVoice();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    age: '',
    location: '',
    category: '',
  });

  const handleVoiceGuide = (field?: string) => {
    if (field && VOICE_GUIDE.form[field as keyof typeof VOICE_GUIDE.form]) {
      speak(VOICE_GUIDE.form[field as keyof typeof VOICE_GUIDE.form]);
    } else {
      speak(VOICE_GUIDE.jobSeeker);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.mobile || !form.location || !form.category) {
      Alert.alert('अधूरा फॉर्म', 'कृपया सभी जरूरी जानकारी भरें');
      return;
    }
    
    if (form.mobile.length !== 10) {
      Alert.alert('गलत नंबर', 'कृपया 10 अंकों का मोबाइल नंबर डालें');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: form.name,
        mobile: form.mobile,
        job_category: form.category,
        location: form.location,
      });
      speak(VOICE_GUIDE.success);
      router.push('/success');
    } catch (error: any) {
      const message = error?.response?.data?.detail || 'कुछ गड़बड़ हुई, फिर से कोशिश करें';
      Alert.alert('त्रुटि', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="contain" />
          <TouchableOpacity onPress={() => handleVoiceGuide()} style={styles.voiceButton}>
            <MaterialIcons 
              name={isSpeaking ? "volume-up" : "record-voice-over"} 
              size={22} 
              color={COLORS.white} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.sectionTag}>JOB SEEKERS</Text>
            <Text style={styles.title}>नौकरी के लिए Apply करें</Text>
            <Text style={styles.subtitle}>सिर्फ 30 seconds में form भरें — हमारी team जल्दी call करेगी</Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>पूरा नाम / Full Name *</Text>
                <TouchableOpacity onPress={() => handleVoiceGuide('name')}>
                  <MaterialIcons name="volume-up" size={20} color={COLORS.primaryOrange} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="अपना नाम लिखें"
                placeholderTextColor={COLORS.textMuted}
                value={form.name}
                onChangeText={(text) => setForm({...form, name: text})}
              />
            </View>

            {/* Mobile Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Mobile Number *</Text>
                <TouchableOpacity onPress={() => handleVoiceGuide('mobile')}>
                  <MaterialIcons name="volume-up" size={20} color={COLORS.primaryOrange} />
                </TouchableOpacity>
              </View>
              <View style={styles.mobileInputContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  style={styles.mobileInput}
                  placeholder="10 अंकों का नंबर"
                  placeholderTextColor={COLORS.textMuted}
                  value={form.mobile}
                  onChangeText={(text) => setForm({...form, mobile: text.replace(/[^0-9]/g, '').slice(0, 10)})}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>

            {/* Age Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>उम्र / Age</Text>
                <TouchableOpacity onPress={() => handleVoiceGuide('age')}>
                  <MaterialIcons name="volume-up" size={20} color={COLORS.primaryOrange} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="जैसे: 25"
                placeholderTextColor={COLORS.textMuted}
                value={form.age}
                onChangeText={(text) => setForm({...form, age: text.replace(/[^0-9]/g, '')})}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>

            {/* Location Picker */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Location (Maharashtra) *</Text>
                <TouchableOpacity onPress={() => handleVoiceGuide('location')}>
                  <MaterialIcons name="volume-up" size={20} color={COLORS.primaryOrange} />
                </TouchableOpacity>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.location}
                  onValueChange={(value) => setForm({...form, location: value})}
                  style={styles.picker}
                >
                  <Picker.Item label="-- शहर चुनें --" value="" />
                  {MAHARASHTRA_LOCATIONS.map((loc) => (
                    <Picker.Item key={loc.id} label={`${loc.nameHi} (${loc.name})`} value={loc.id} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Job Category Picker */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Job Category *</Text>
                <TouchableOpacity onPress={() => handleVoiceGuide('category')}>
                  <MaterialIcons name="volume-up" size={20} color={COLORS.primaryOrange} />
                </TouchableOpacity>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.category}
                  onValueChange={(value) => setForm({...form, category: value})}
                  style={styles.picker}
                >
                  <Picker.Item label="-- कौन सा काम करना है? --" value="" />
                  {JOB_CATEGORIES.map((cat) => (
                    <Picker.Item key={cat.id} label={`${cat.nameHi} (${cat.name})`} value={cat.id} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <MaterialIcons name="send" size={20} color={COLORS.white} />
              <Text style={styles.submitButtonText}>
                {loading ? 'Submit हो रहा है...' : 'नौकरी के लिए Apply करें'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.privacyText}>
              Free registration • हम आपकी details private रखते हैं
            </Text>
          </View>

          {/* How it Works */}
          <View style={styles.howItWorks}>
            <Text style={styles.howItWorksTitle}>कैसे काम करता है?</Text>
            <View style={styles.stepsContainer}>
              {HOW_IT_WORKS_WORKERS.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{step.step}</Text>
                  </View>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  titleSection: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
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
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  formSection: {
    padding: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
  },
  mobileInputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  countryCode: {
    backgroundColor: COLORS.primaryBlue,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  mobileInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
  },
  pickerContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: COLORS.primaryOrange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.buttonDisabled,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  privacyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  howItWorks: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    marginTop: SPACING.md,
  },
  howItWorksTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  stepNumberText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  stepDescription: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
