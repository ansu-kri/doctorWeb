const USER_KEY = "medicare_user";
const TOKEN_KEY = "token";

export const saveSession = (payload) => {
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

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
};
