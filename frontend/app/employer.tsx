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
import { LOGO_URL, JOB_CATEGORIES, MAHARASHTRA_LOCATIONS, VOICE_GUIDE, HOW_IT_WORKS_EMPLOYERS } from '../src/constants/appData';
import { useVoice } from '../src/hooks/useVoice';
import { createJob } from '../src/utils/api';

export default function EmployerScreen() {
  const router = useRouter();
  const { speak, isSpeaking } = useVoice();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    companyName: '',
    contactNumber: '',
    staffCount: '',
    salaryRange: '',
    jobRole: '',
    location: '',
    urgent: 'no',
  });

  const handleVoiceGuide = () => {
    speak(VOICE_GUIDE.employer);
  };

  const handleSubmit = async () => {
    if (!form.companyName || !form.contactNumber || !form.jobRole || !form.location) {
      Alert.alert('अधूरा फॉर्म', 'कृपया सभी जरूरी जानकारी भरें');
      return;
    }
    
    if (form.contactNumber.length !== 10) {
      Alert.alert('गलत नंबर', 'कृपया 10 अंकों का मोबाइल नंबर डालें');
      return;
    }

    setLoading(true);
    try {
      await createJob({
        title: `${form.staffCount || '1'} ${form.jobRole} Required`,
        description: `${form.companyName} को ${form.staffCount || '1'} ${form.jobRole} चाहिए। ${form.urgent === 'yes' ? 'Urgent Hiring!' : ''}`,
        category: form.jobRole,
        location: form.location,
        salary_min: parseInt(form.salaryRange.split('-')[0]) || 10000,
        salary_max: parseInt(form.salaryRange.split('-')[1]) || 20000,
        employer_name: form.companyName,
        employer_mobile: form.contactNumber,
      });
      speak('बधाई हो! आपकी requirement submit हो गई। हम जल्दी ही verified candidates भेजेंगे।');
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
          <TouchableOpacity onPress={handleVoiceGuide} style={styles.voiceButton}>
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
            <Text style={styles.sectionTag}>EMPLOYERS</Text>
            <Text style={styles.title}>Worker चाहिए?</Text>
            <Text style={styles.subtitle}>Requirement share करें — verified candidates आपको मिलेंगे</Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            {/* Company Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company / Business Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="कंपनी या बिज़नेस का नाम"
                placeholderTextColor={COLORS.textMuted}
                value={form.companyName}
                onChangeText={(text) => setForm({...form, companyName: text})}
              />
            </View>

            {/* Contact Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Number *</Text>
              <View style={styles.mobileInputContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  style={styles.mobileInput}
                  placeholder="10 अंकों का नंबर"
                  placeholderTextColor={COLORS.textMuted}
                  value={form.contactNumber}
                  onChangeText={(text) => setForm({...form, contactNumber: text.replace(/[^0-9]/g, '').slice(0, 10)})}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>

            {/* Staff Count */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>कितने Staff चाहिए</Text>
              <TextInput
                style={styles.input}
                placeholder="जैसे: 2"
                placeholderTextColor={COLORS.textMuted}
                value={form.staffCount}
                onChangeText={(text) => setForm({...form, staffCount: text.replace(/[^0-9]/g, '')})}
                keyboardType="number-pad"
              />
            </View>

            {/* Salary Range */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Salary Range</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.salaryRange}
                  onValueChange={(value) => setForm({...form, salaryRange: value})}
                  style={styles.picker}
                >
                  <Picker.Item label="-- सैलरी चुनें --" value="" />
                  <Picker.Item label="₹8,000 - ₹12,000" value="8000-12000" />
                  <Picker.Item label="₹12,000 - ₹18,000" value="12000-18000" />
                  <Picker.Item label="₹18,000 - ₹25,000" value="18000-25000" />
                  <Picker.Item label="₹25,000 - ₹35,000" value="25000-35000" />
                  <Picker.Item label="₹35,000+" value="35000-50000" />
                </Picker>
              </View>
            </View>

            {/* Job Role */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Job Role *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.jobRole}
                  onValueChange={(value) => setForm({...form, jobRole: value})}
                  style={styles.picker}
                >
                  <Picker.Item label="-- काम का प्रकार --" value="" />
                  {JOB_CATEGORIES.map((cat) => (
                    <Picker.Item key={cat.id} label={`${cat.nameHi} (${cat.name})`} value={cat.id} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Company Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company Location *</Text>
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

            {/* Urgent Hiring */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Urgent Hiring?</Text>
              <View style={styles.urgentContainer}>
                <TouchableOpacity 
                  style={[styles.urgentOption, form.urgent === 'yes' && styles.urgentOptionSelected]}
                  onPress={() => setForm({...form, urgent: 'yes'})}
                >
                  <Text style={[styles.urgentText, form.urgent === 'yes' && styles.urgentTextSelected]}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.urgentOption, form.urgent === 'no' && styles.urgentOptionSelected]}
                  onPress={() => setForm({...form, urgent: 'no'})}
                >
                  <Text style={[styles.urgentText, form.urgent === 'no' && styles.urgentTextSelected]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <MaterialIcons name="people" size={20} color={COLORS.white} />
              <Text style={styles.submitButtonText}>
                {loading ? 'Submit हो रहा है...' : 'Worker चाहिए'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.privacyText}>
              Free listing • No platform fees
            </Text>
          </View>

          {/* How it Works */}
          <View style={styles.howItWorks}>
            <Text style={styles.howItWorksTitle}>Employers के लिए</Text>
            <View style={styles.stepsContainer}>
              {HOW_IT_WORKS_EMPLOYERS.map((step, index) => (
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
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
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
  urgentContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  urgentOption: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  urgentOptionSelected: {
    borderColor: COLORS.primaryOrange,
    backgroundColor: COLORS.featureIconBg,
  },
  urgentText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  urgentTextSelected: {
    color: COLORS.primaryOrange,
  },
  submitButton: {
    backgroundColor: COLORS.primaryBlue,
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
    backgroundColor: COLORS.primaryBlue,
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
