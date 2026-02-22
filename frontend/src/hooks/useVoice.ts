import { useCallback, useState, useEffect } from 'react';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export const useVoice = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    // Check if speech is available
    const checkAvailability = async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        setIsAvailable(voices.length > 0);
      } catch (error) {
        console.log('Speech not available:', error);
        setIsAvailable(false);
      }
    };
    checkAvailability();
  }, []);

  const speak = useCallback(async (text: string, onDone?: () => void) => {
    if (!isAvailable) {
      onDone?.();
      return;
    }

    try {
      // Stop any current speech
      await Speech.stop();
      
      setIsSpeaking(true);
      
      // Get Hindi voice if available
      const voices = await Speech.getAvailableVoicesAsync();
      const hindiVoice = voices.find(
        (v) => v.language.includes('hi') || v.language.includes('Hindi')
      );

      await Speech.speak(text, {
        language: 'hi-IN',
        voice: hindiVoice?.identifier,
        pitch: 1.0,
        rate: Platform.OS === 'ios' ? 0.9 : 0.85,
        onDone: () => {
          setIsSpeaking(false);
          onDone?.();
        },
        onError: () => {
          setIsSpeaking(false);
        },
      });
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
      onDone?.();
    }
  }, [isAvailable]);

  const stop = useCallback(async () => {
    try {
      await Speech.stop();
      setIsSpeaking(false);
    } catch (error) {
      console.error('Stop speech error:', error);
    }
  }, []);

  return { speak, stop, isSpeaking, isAvailable };
};
