import { requestFirebaseToken } from "../bootstrap/firebase";
import API from "../api/axios";

export async function setupNotifications() {
  try {
    if (!("Notification" in window)) {
      return {
        status: false,
        message: "Notifications are not supported in this browser",
      };
    }

    if (!("serviceWorker" in navigator)) {
      return {
        status: false,
        message: "Service workers are not supported in this browser",
      };
    }

    const token = await requestFirebaseToken();

    if (!token) {
      return {
        status: false,
        message: "Notification permission not granted",
      };
    }

    await API.post("/auth/save-fcm-token", {
      fcm_token: token,
    });

    localStorage.setItem("fcm_token", token);

    return {
      status: true,
      token,
      message: "Notifications enabled successfully",
    };
  } catch (error) {
    console.error("Notification setup error:", error);

    return {
      status: false,
      message: "Failed to enable notifications",
    };
  }
}
