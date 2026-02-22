import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants/colors';

interface VoiceButtonProps {
  onPress: () => void;
  isSpeaking?: boolean;
  label?: string;
  size?: 'small' | 'medium' | 'large';
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onPress,
  isSpeaking = false,
  label = 'दुबारा सुनें',
  size = 'medium',
}) => {
  const iconSize = size === 'small' ? 24 : size === 'large' ? 40 : 32;
  const buttonSize = size === 'small' ? 48 : size === 'large' ? 72 : 60;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { width: buttonSize, height: buttonSize },
        isSpeaking && styles.speaking,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isSpeaking ? (
        <ActivityIndicator color={COLORS.white} size="small" />
      ) : (
        <MaterialIcons name="volume-up" size={iconSize} color={COLORS.white} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryOrange,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  speaking: {
    backgroundColor: COLORS.accentGreen,
  },
});
