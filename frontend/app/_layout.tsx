import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../src/constants/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/name" />
        <Stack.Screen name="onboarding/mobile" />
        <Stack.Screen name="onboarding/otp" />
        <Stack.Screen name="onboarding/job-category" />
        <Stack.Screen name="onboarding/location" />
        <Stack.Screen name="onboarding/success" />
        <Stack.Screen name="home" />
        <Stack.Screen name="admin/index" />
      </Stack>
    </>
  );
}
