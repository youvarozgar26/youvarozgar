import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants/colors';

interface JobCategoryCardProps {
  id: string;
  nameHi: string;
  nameEn: string;
  icon: string;
  isSelected: boolean;
  onPress: () => void;
}

export const JobCategoryCard: React.FC<JobCategoryCardProps> = ({
  nameHi,
  nameEn,
  icon,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, isSelected && styles.iconSelected]}>
        <MaterialIcons
          name={icon as keyof typeof MaterialIcons.glyphMap}
          size={36}
          color={isSelected ? COLORS.white : COLORS.primaryBlue}
        />
      </View>
      <Text style={[styles.nameHi, isSelected && styles.textSelected]}>
        {nameHi}
      </Text>
      <Text style={[styles.nameEn, isSelected && styles.textSelectedSecondary]}>
        {nameEn}
      </Text>
      {isSelected && (
        <View style={styles.checkmark}>
          <MaterialIcons name="check-circle" size={24} color={COLORS.accentGreen} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    borderWidth: 2,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  selected: {
    backgroundColor: COLORS.primaryBlue,
    borderColor: COLORS.primaryBlue,
    elevation: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  nameHi: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  nameEn: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  textSelected: {
    color: COLORS.white,
  },
  textSelectedSecondary: {
    color: 'rgba(255,255,255,0.8)',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
