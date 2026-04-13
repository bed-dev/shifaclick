import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';

import { useAuth } from '@/src/context/AuthContext';
import { colors } from '@/src/theme/tokens';

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
    return <Redirect href={(user?.role === 'pharmacist' ? '/(tabs)/pharmacist' : '/(tabs)/feed') as any} />;
  }

  return <Redirect href="/(auth)/login" />;
}
