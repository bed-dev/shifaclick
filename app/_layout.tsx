import '../global.css';

import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { AuthProvider } from '@/context/AuthContext';
import { queryClient } from '@/services/queryClient';
import { appNavigationTheme, colors, typography } from '@/theme/tokens';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider value={appNavigationTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="item/[id]"
                options={{
                  headerShown: true,
                  title: 'Drug Details',
                  headerStyle: { backgroundColor: colors.surface.card },
                  headerTintColor: colors.text.primary,
                  headerTitleStyle: {
                    fontFamily: typography.fontFamily,
                    fontWeight: '800',
                  },
                }}
              />
              <Stack.Screen
                name="request/new"
                options={{
                  headerShown: true,
                  title: 'New Request',
                  headerStyle: { backgroundColor: colors.surface.card },
                  headerTintColor: colors.text.primary,
                  headerTitleStyle: {
                    fontFamily: typography.fontFamily,
                    fontWeight: '800',
                  },
                }}
              />
              <Stack.Screen
                name="search/results/[orderId]"
                options={{
                  headerShown: true,
                  title: 'Pharmacy Results',
                  headerStyle: { backgroundColor: colors.surface.card },
                  headerTintColor: colors.text.primary,
                  headerTitleStyle: {
                    fontFamily: typography.fontFamily,
                    fontWeight: '800',
                  },
                }}
              />
              <Stack.Screen
                name="search/confirm/[orderId]"
                options={{
                  headerShown: true,
                  title: 'Confirm Pharmacy',
                  headerStyle: { backgroundColor: colors.surface.card },
                  headerTintColor: colors.text.primary,
                  headerTitleStyle: {
                    fontFamily: typography.fontFamily,
                    fontWeight: '800',
                  },
                }}
              />
              <Stack.Screen
                name="search/success/[orderId]"
                options={{
                  headerShown: true,
                  title: 'Order Confirmed',
                  headerStyle: { backgroundColor: colors.surface.card },
                  headerTintColor: colors.text.primary,
                  headerTitleStyle: {
                    fontFamily: typography.fontFamily,
                    fontWeight: '800',
                  },
                }}
              />
              <Stack.Screen
                name="tools/scan-note"
                options={{
                  headerShown: true,
                  title: 'Scan Doctor Note',
                  headerStyle: { backgroundColor: colors.surface.card },
                  headerTintColor: colors.text.primary,
                  headerTitleStyle: {
                    fontFamily: typography.fontFamily,
                    fontWeight: '800',
                  },
                }}
              />
              <Stack.Screen
                name="meds/add"
                options={{
                  headerShown: true,
                  title: 'Add Medication',
                  headerStyle: { backgroundColor: colors.surface.card },
                  headerTintColor: colors.text.primary,
                  headerTitleStyle: {
                    fontFamily: typography.fontFamily,
                    fontWeight: '800',
                  },
                }}
              />
            </Stack>
            <StatusBar style="dark" />
            <Toast />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
