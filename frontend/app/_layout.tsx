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
        <Stack.Screen name="job-seeker" />
        <Stack.Screen name="employer" />
        <Stack.Screen name="about" />
        <Stack.Screen name="success" />
        <Stack.Screen name="admin/index" />
        <Stack.Screen name="admin/dashboard" />
      </Stack>
    </>
  );
}
