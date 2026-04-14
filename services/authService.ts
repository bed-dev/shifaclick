import axios from 'axios';

import { http, isNetworkError } from '@/services/http';
import {
  clearAuthStorage,
  getAccessToken,
  getStoredUser,
  setAccessToken,
  setRefreshToken,
  setStoredUser,
} from '@/services/tokenStorage';
import type { AuthSession, RegisterPayload, UserProfile, UserRole } from '@/types/models';

interface DjangoAuthUser {
  id: number | string;
  email: string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  is_verified?: boolean;
  verified?: boolean;
}

interface DjangoAuthResponse {
  success?: boolean;
  message?: string;
  user?: DjangoAuthUser;
  token?: string;
  access?: string;
  refresh?: string;
  auth_token?: string;
}

interface MockAuthAccount {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  role: UserRole;
}

const DEFAULT_MOCK_ROLE: UserRole = 'client';

const MOCK_LOGIN_FLAG = process.env.EXPO_PUBLIC_ENABLE_MOCK_LOGIN;
const MOCK_LOGIN_ENABLED =
  MOCK_LOGIN_FLAG === undefined ? true : ['1', 'true', 'yes', 'on'].includes(MOCK_LOGIN_FLAG.toLowerCase());

const MOCK_ACCOUNTS: Record<UserRole, MockAuthAccount> = {
  client: {
    email: 'client@mock.shifatrack.app',
    password: 'mock12345',
    firstName: 'Nadia',
    lastName: 'Rahmani',
    phone: '0555000001',
    city: 'Algiers',
    role: 'client',
  },
  pharmacist: {
    email: 'pharmacist@mock.shifatrack.app',
    password: 'mock12345',
    firstName: 'Karim',
    lastName: 'Bensaid',
    phone: '0555000002',
    city: 'Oran',
    role: 'pharmacist',
  },
  distributor: {
    email: 'distributor@mock.shifatrack.app',
    password: 'mock12345',
    firstName: 'Samir',
    lastName: 'Mansouri',
    phone: '0555000003',
    city: 'Constantine',
    role: 'distributor',
  },
};

export const MOCK_LOGIN_CREDENTIALS: Record<UserRole, Pick<MockAuthAccount, 'email' | 'password'>> = {
  client: {
    email: MOCK_ACCOUNTS.client.email,
    password: MOCK_ACCOUNTS.client.password,
  },
  pharmacist: {
    email: MOCK_ACCOUNTS.pharmacist.email,
    password: MOCK_ACCOUNTS.pharmacist.password,
  },
  distributor: {
    email: MOCK_ACCOUNTS.distributor.email,
    password: MOCK_ACCOUNTS.distributor.password,
  },
};

function normalizeRole(role: UserRole | string | undefined | null): UserRole {
  if (role === 'client' || role === 'pharmacist' || role === 'distributor') {
    return role;
  }

  return DEFAULT_MOCK_ROLE;
}

function normalizeUser(user: DjangoAuthUser | undefined, fallbackRole: UserRole): UserProfile {
  return {
    id: String(user?.id ?? `usr-${Date.now()}`),
    firstName: user?.first_name ?? user?.firstName ?? '',
    lastName: user?.last_name ?? user?.lastName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    city: 'Algiers',
    role: user?.role ?? fallbackRole,
    verified: Boolean(user?.is_verified ?? user?.verified),
  };
}

function pickAccessToken(data: DjangoAuthResponse): string | null {
  return data.access ?? data.token ?? data.auth_token ?? null;
}

function getMessageFromUnknown(payload: unknown): string | null {
  if (typeof payload === 'string') {
    return payload.trim() || null;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const message = getMessageFromUnknown(item);

      if (message) {
        return message;
      }
    }
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const commonKeys = ['message', 'detail', 'error', 'non_field_errors', 'email', 'password'];

    for (const key of commonKeys) {
      const message = getMessageFromUnknown(record[key]);

      if (message) {
        return message;
      }
    }

    for (const value of Object.values(record)) {
      const message = getMessageFromUnknown(value);

      if (message) {
        return message;
      }
    }
  }

  return null;
}

function buildMockSessionFromAccount(account: MockAuthAccount): AuthSession {
  return {
    token: `mock-${account.role}-${Date.now()}`,
    user: {
      id: `mock-${account.role}`,
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      phone: account.phone,
      city: account.city,
      role: account.role,
      verified: true,
    },
  };
}

function matchMockSession(email: string, password: string, preferredRole: UserRole): AuthSession | null {
  if (!MOCK_LOGIN_ENABLED) {
    return null;
  }

  const selected = MOCK_ACCOUNTS[normalizeRole(preferredRole)];

  if (selected.email === email && selected.password === password) {
    return buildMockSessionFromAccount(selected);
  }

  const fallback = Object.values(MOCK_ACCOUNTS).find(
    (account) => account.email === email && account.password === password
  );

  return fallback ? buildMockSessionFromAccount(fallback) : null;
}

function toLoginError(error: unknown): Error {
  if (isNetworkError(error)) {
    return new Error(
      'Unable to reach the server. You can still use a mock account: client@mock.shifatrack.app / mock12345.'
    );
  }

  if (axios.isAxiosError(error)) {
    const apiMessage = getMessageFromUnknown(error.response?.data);

    if (apiMessage) {
      return new Error(apiMessage);
    }
  }

  if (error instanceof Error && error.message) {
    return error;
  }

  return new Error('Unable to sign in.');
}

async function persistSession(session: AuthSession, refreshToken?: string | null) {
  await Promise.all([
    setAccessToken(session.token),
    setRefreshToken(refreshToken ?? null),
    setStoredUser(JSON.stringify(session.user)),
  ]);
}

export const authService = {
  async login(email: string, password: string, preferredRole: UserRole = 'client'): Promise<AuthSession> {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      throw new Error('Email and password are required.');
    }

    const safeRole = normalizeRole(preferredRole);
    const mockSession = matchMockSession(normalizedEmail, normalizedPassword, safeRole);

    if (mockSession) {
      await persistSession(mockSession, null);
      return mockSession;
    }

    try {
      const body = new URLSearchParams({
        email: normalizedEmail,
        password,
      });

      const { data } = await http.post<DjangoAuthResponse>('/api/login/', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!data?.success && !data?.user) {
        const apiMessage = getMessageFromUnknown(data);
        throw new Error(apiMessage ?? 'Unable to sign in.');
      }

      const token = pickAccessToken(data) ?? `session-auth-${Date.now()}`;
      const session: AuthSession = {
        token,
        user: normalizeUser(data.user, safeRole),
      };

      await persistSession(session, data.refresh ?? null);
      return session;
    } catch (error) {
      throw toLoginError(error);
    }
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    if (!payload.email.trim() || !payload.password.trim()) {
      throw new Error('Email and password are required.');
    }

    const endpoint =
      payload.role === 'pharmacist'
        ? '/api/register_pharmacist/'
        : payload.role === 'client'
          ? '/api/register_client/'
          : null;

    if (!endpoint) {
      throw new Error('Distributor self-registration API is not available on this backend.');
    }

    const body = new URLSearchParams({
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone,
      password: payload.password,
      password2: payload.password,
    });

    const { data } = await http.post<DjangoAuthResponse>(endpoint, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!data?.success && !data?.user) {
      throw new Error('Unable to create account.');
    }

    const token = pickAccessToken(data) ?? `session-auth-${Date.now()}`;
    const session: AuthSession = {
      token,
      user: normalizeUser(data.user, payload.role),
    };

    await persistSession(session, data.refresh ?? null);
    return session;
  },

  async restoreSession(): Promise<AuthSession | null> {
    const [token, userJson] = await Promise.all([getAccessToken(), getStoredUser()]);

    if (!token || !userJson) {
      return null;
    }

    try {
      const user = JSON.parse(userJson) as UserProfile;
      return { token, user };
    } catch {
      await clearAuthStorage();
      return null;
    }
  },

  async logout(): Promise<void> {
    await clearAuthStorage();
  },
};
