import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const memoryStore = new Map<string, string>();

function canUseLocalStorage(): boolean {
  return typeof globalThis.localStorage !== 'undefined';
}

async function getFromFallback(key: string): Promise<string | null> {
  if (canUseLocalStorage()) {
    return globalThis.localStorage.getItem(key);
  }

  return memoryStore.get(key) ?? null;
}

async function setToFallback(key: string, value: string): Promise<void> {
  if (canUseLocalStorage()) {
    globalThis.localStorage.setItem(key, value);
    return;
  }

  memoryStore.set(key, value);
}

async function deleteFromFallback(key: string): Promise<void> {
  if (canUseLocalStorage()) {
    globalThis.localStorage.removeItem(key);
    return;
  }

  memoryStore.delete(key);
}

export async function secureGetItemAsync(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return getFromFallback(key);
  }

  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return getFromFallback(key);
  }
}

export async function secureSetItemAsync(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    await setToFallback(key, value);
    return;
  }

  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    await setToFallback(key, value);
  }
}

export async function secureDeleteItemAsync(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    await deleteFromFallback(key);
    return;
  }

  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    await deleteFromFallback(key);
  }
}
