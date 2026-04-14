import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme/tokens';

export default function IndexScreen() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface.page }}>
        <ActivityIndicator color={colors.brand.aqua} />
      </View>
    );
  }

  if (isAuthenticated) {
    if (user?.role === 'pharmacist') {
      return <Redirect href={'/(tabs)/pharmacist' as any} />;
    }

    if (user?.role === 'distributor') {
      return <Redirect href={'/(tabs)/distributor' as any} />;
    }

    return <Redirect href={'/(tabs)/feed' as any} />;
  }

  return <Redirect href="/(auth)/login" />;
}
