import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants/colors';

interface LocationCardProps {
  cityHi: string;
  cityEn: string;
  stateHi: string;
  isSelected: boolean;
  onPress: () => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  cityHi,
  cityEn,
  stateHi,
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
      <View style={styles.content}>
        <View style={[styles.iconContainer, isSelected && styles.iconSelected]}>
          <MaterialIcons
            name="location-on"
            size={28}
            color={isSelected ? COLORS.white : COLORS.primaryOrange}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.cityHi, isSelected && styles.textSelected]}>
            {cityHi}
          </Text>
          <Text style={[styles.cityEn, isSelected && styles.textSelectedSecondary]}>
            {cityEn} • {stateHi}
          </Text>
        </View>
      </View>
      {isSelected && (
        <MaterialIcons name="check-circle" size={28} color={COLORS.accentGreen} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selected: {
    backgroundColor: COLORS.primaryBlue,
    borderColor: COLORS.primaryBlue,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  iconSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  textContainer: {
    flex: 1,
  },
  cityHi: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  cityEn: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  textSelected: {
    color: COLORS.white,
  },
  textSelectedSecondary: {
    color: 'rgba(255,255,255,0.8)',
  },
});
