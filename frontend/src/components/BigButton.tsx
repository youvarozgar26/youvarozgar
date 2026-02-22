import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants/colors';

interface BigButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: 'left' | 'right';
}

export const BigButton: React.FC<BigButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'right',
}) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.buttonDisabled;
    switch (variant) {
      case 'primary':
        return COLORS.buttonPrimary;
      case 'secondary':
        return COLORS.buttonSecondary;
      case 'outline':
        return 'transparent';
      default:
        return COLORS.buttonPrimary;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.textMuted;
    switch (variant) {
      case 'outline':
        return COLORS.primaryBlue;
      default:
        return COLORS.white;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && styles.outlineButton,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="large" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <MaterialIcons
              name={icon}
              size={28}
              color={getTextColor()}
              style={styles.iconLeft}
            />
          )}
          <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <MaterialIcons
              name={icon}
              size={28}
              color={getTextColor()}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: COLORS.primaryBlue,
    elevation: 0,
    shadowOpacity: 0,
  },
  disabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
});
