import { delay } from '@/src/lib/delay';
import { mockStore } from '@/src/services/mockStore';
import type { AuthSession, RegisterPayload, UserProfile } from '@/src/types/models';

const buildSession = (user: UserProfile): AuthSession => ({
  token: `mock-token-${user.id}`,
  user,
});

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    await delay(500);

    if (!email.trim() || !password.trim()) {
      throw new Error('Email and password are required.');
    }

    const user = {
      ...mockStore.getCurrentUser(),
      email: email.trim().toLowerCase(),
    };

    mockStore.setCurrentUser(user);
    return buildSession(user);
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    await delay(650);

    if (!payload.email.trim() || !payload.password.trim()) {
      throw new Error('Email and password are required.');
    }

    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone,
      city: 'Algiers',
      role: payload.role,
      verified: payload.role === 'client',
    };

    mockStore.setCurrentUser(user);
    return buildSession(user);
  },
};
