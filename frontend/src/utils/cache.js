export function getCache(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

export function setCache(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeCache(key) {
  localStorage.removeItem(key);
}

export function clearAuthCache() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function clearChatCache() {
  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    if (
      key.startsWith("chat_") ||
      key.startsWith("group_") ||
      key.startsWith("admin_")
    ) {
      localStorage.removeItem(key);
    }
  });
}
