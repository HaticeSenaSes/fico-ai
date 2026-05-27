import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'https://quarterly-earmuff-trimmer.ngrok-free.dev/api/v1';

export async function getToken(): Promise<string | null> {
  return await AsyncStorage.getItem('access_token');
}

export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem('access_token', token);
}

export async function removeToken(): Promise<void> {
  await AsyncStorage.removeItem('access_token');
}

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = await getToken();
  const headers: any = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, detail: data.detail };
  }

  return data;
}