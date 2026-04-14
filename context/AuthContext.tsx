import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

import { authService } from '@/services/authService';
import { profileService } from '@/services/profileService';
import type { RegisterPayload, UserProfile, UserRole } from '@/types/models';

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, preferredRole?: UserRole) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateCurrentUser: (nextUser: UserProfile) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const session = await authService.restoreSession();

        if (mounted && session?.user) {
          setUser(session.user);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string, preferredRole: UserRole = 'client') => {
    const session = await authService.login(email, password, preferredRole);
    setUser(session.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const session = await authService.register(payload);
    setUser(session.user);
  }, []);

  const refreshProfile = useCallback(async () => {
    const profile = await profileService.getProfile();
    setUser(profile);
  }, []);

  const updateCurrentUser = useCallback((nextUser: UserProfile) => {
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      refreshProfile,
      updateCurrentUser,
    }),
    [user, isLoading, login, register, logout, refreshProfile, updateCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
