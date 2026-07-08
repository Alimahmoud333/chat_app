import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const baseUrl = apiUrl.replace("/api", "");

const EchoInstance = new Echo({
  broadcaster: "pusher",

  key: import.meta.env.VITE_REVERB_APP_KEY,

  cluster: "mt1",

  wsHost: import.meta.env.VITE_REVERB_HOST || "127.0.0.1",

  wsPort: Number(import.meta.env.VITE_REVERB_PORT) || 8080,

  wssPort: Number(import.meta.env.VITE_REVERB_PORT) || 8080,

  forceTLS: import.meta.env.VITE_REVERB_SCHEME === "https",

  encrypted: import.meta.env.VITE_REVERB_SCHEME === "https",

  enabledTransports: ["ws", "wss"],

  disableStats: true,

  authEndpoint: `${baseUrl}/broadcasting/auth`,

  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  },
});

export default EchoInstance;
