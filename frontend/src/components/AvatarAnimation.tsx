import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface AvatarAnimationProps {
  isSpeaking?: boolean;
  size?: number;
}

export const AvatarAnimation: React.FC<AvatarAnimationProps> = ({
  isSpeaking = false,
  size = 180,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSpeaking) {
      // Pulse animation when speaking
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Wave animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      waveAnim.setValue(0);
    }
  }, [isSpeaking]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background circle */}
      <Animated.View
        style={[
          styles.backgroundCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      
      {/* Avatar icon */}
      <View style={[styles.avatarContainer, { width: size * 0.8, height: size * 0.8 }]}>
        <MaterialIcons
          name="support-agent"
          size={size * 0.5}
          color={COLORS.white}
        />
      </View>

      {/* Sound waves when speaking */}
      {isSpeaking && (
        <>
          <Animated.View
            style={[
              styles.soundWave,
              {
                left: size + 10,
                opacity: waveAnim,
                transform: [{
                  translateX: waveAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 10],
                  }),
                }],
              },
            ]}
          >
            <MaterialIcons name="graphic-eq" size={40} color={COLORS.primaryOrange} />
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundCircle: {
    backgroundColor: COLORS.primaryBlue,
    position: 'absolute',
    opacity: 0.2,
  },
  avatarContainer: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  soundWave: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
  },
});
