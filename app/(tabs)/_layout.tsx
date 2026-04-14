import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/context/AuthContext';
import { colors, typography } from '@/theme/tokens';

export default function TabLayout() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const isPharmacist = user?.role === 'pharmacist';
  const isDistributor = user?.role === 'distributor';
  const isPatient = user?.role === 'client';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.brand.aqua,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: colors.surface.border,
          backgroundColor: colors.surface.card,
        },
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily,
          fontSize: 12,
          fontWeight: '700',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          href: isPatient ? undefined : null,
          title: 'Search',
          tabBarIcon: ({ color }) => <Ionicons size={22} name="search-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          href: isPatient ? undefined : null,
          title: 'Requests',
          tabBarIcon: ({ color }) => <Ionicons size={22} name="document-text-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="pharmacist"
        options={{
          href: isPharmacist ? undefined : null,
          title: 'Demand',
          tabBarIcon: ({ color }) => <Ionicons size={22} name="pulse-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="distributor"
        options={{
          href: isDistributor ? undefined : null,
          title: 'Control',
          tabBarIcon: ({ color }) => <Ionicons size={22} name="layers-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="dispatch"
        options={{
          href: isDistributor ? undefined : null,
          title: 'Dispatch',
          tabBarIcon: ({ color }) => <Ionicons size={22} name="cube-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          href: isPharmacist ? undefined : null,
          title: 'Scanner',
          tabBarIcon: ({ color }) => <Ionicons size={22} name="barcode-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color }) => <Ionicons size={22} name="notifications-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons size={22} name="person-circle-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
