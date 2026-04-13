import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '@/src/context/AuthContext';
import { appNavigationTheme, colors, typography } from '@/src/theme/tokens';

export default function RootLayout() {
  return (
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
              title: 'Medicine Details',
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
      </ThemeProvider>
    </AuthProvider>
  );
}
