const SESSION_KEY = "jiyonkathi_admin_session";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// 7-Day Admin Session Storage Utility
export function getStoredSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);
    if (!data || !data.user || !data.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    if (Date.now() > data.expiresAt) {
      console.log("Admin session expired (7 days elapsed).");
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return data.user;
  } catch (err) {
    console.error("Error reading admin session from localStorage:", err);
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveSession(user) {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  const expiresAt = Date.now() + SEVEN_DAYS_MS;
  const payload = {
    user,
    expiresAt,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("Error saving admin session to localStorage:", err);
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error("Error clearing admin session from localStorage:", err);
  }
}

export function getAuthToken() {
  const session = getStoredSession();
  return session?.token || null;
}

