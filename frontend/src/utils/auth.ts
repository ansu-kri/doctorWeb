const USER_KEY = "medicare_user";
const TOKEN_KEY = "token";

export interface SessionPayload {
  token?: string;
  [key: string]: unknown;
}

export interface StoredUser {
  [key: string]: unknown;
  role?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  bloodType?: string;
  gender?: string;
}

export const saveSession = (payload: SessionPayload) => {
  if (payload?.token) localStorage.setItem(TOKEN_KEY, payload.token);
  const { token, ...user } = payload || {};
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("medicare-auth"));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("medicare-auth"));
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = (): StoredUser | null => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
};