// src/auth.ts

const TOKEN_KEY = "access_token";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    // decode JWT payload
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp: number | undefined = payload?.exp;
    if (!exp) return true; // if no exp, assume valid (or set to false if you prefer)
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return exp > nowInSeconds;
  } catch {
    return false;
  }
}

export function isAuthenticated(): boolean {
  return isTokenValid(getToken());
}
