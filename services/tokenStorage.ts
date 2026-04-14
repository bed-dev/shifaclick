import { secureDeleteItemAsync, secureGetItemAsync, secureSetItemAsync } from '@/services/secureStoreCompat';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';

export async function setAccessToken(token: string | null) {
  if (!token) {
    await secureDeleteItemAsync(ACCESS_TOKEN_KEY);
    return;
  }

  await secureSetItemAsync(ACCESS_TOKEN_KEY, token);
}

export async function getAccessToken() {
  return secureGetItemAsync(ACCESS_TOKEN_KEY);
}

export async function setRefreshToken(token: string | null) {
  if (!token) {
    await secureDeleteItemAsync(REFRESH_TOKEN_KEY);
    return;
  }

  await secureSetItemAsync(REFRESH_TOKEN_KEY, token);
}

export async function getRefreshToken() {
  return secureGetItemAsync(REFRESH_TOKEN_KEY);
}

export async function setStoredUser(userJson: string | null) {
  if (!userJson) {
    await secureDeleteItemAsync(USER_KEY);
    return;
  }

  await secureSetItemAsync(USER_KEY, userJson);
}

export async function getStoredUser() {
  return secureGetItemAsync(USER_KEY);
}

export async function clearAuthStorage() {
  await Promise.all([
    secureDeleteItemAsync(ACCESS_TOKEN_KEY),
    secureDeleteItemAsync(REFRESH_TOKEN_KEY),
    secureDeleteItemAsync(USER_KEY),
  ]);
}
