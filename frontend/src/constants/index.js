export const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const STORAGE_URL =
  import.meta.env.VITE_STORAGE_URL || "http://127.0.0.1:8000/storage/";

export const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=667eea&color=fff";

export const DEFAULT_GROUP_IMAGE =
  "https://ui-avatars.com/api/?name=Group&background=764ba2&color=fff";

export const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  FILE: "file",
  LOCATION: "location",
};

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};
