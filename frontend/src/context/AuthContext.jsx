import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import API from "../api/axios";
import authReducer from "../reducers/authReducer";

export const AuthContext = createContext(null);
export const AuthDispatchContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, dispatch] = useReducer(authReducer, null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch({
      type: "GET_CACHED_USER",
    });

    getProfile();
  }, []);

  /*
  =========================================
  REGISTER
  IMPORTANT:
  Do NOT save token here.
  User must verify OTP first.
  =========================================
  */
  async function register(data) {
    const res = await API.post("/auth/register", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  }

  /*
  =========================================
  LOGIN
  =========================================
  */
  async function login(data) {
    const res = await API.post("/auth/login", data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    dispatch({
      type: "LOGIN",
      payload: res.data.user,
    });

    return res.data;
  }

  /*
  =========================================
  VERIFY OTP
  IMPORTANT:
  Save token only after OTP success.
  =========================================
  */
  async function verifyOtp(data) {
    const res = await API.post("/auth/verify-otp", data);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));

      dispatch({
        type: "VERIFY_OTP",
        payload: res.data.user,
      });
    }

    return res.data;
  }

  /*
  =========================================
  RESEND OTP
  =========================================
  */
  async function resendOtp(data) {
    const res = await API.post("/auth/resend-otp", data);

    return res.data;
  }

  /*
  =========================================
  FORGOT PASSWORD
  =========================================
  */
  async function forgotPassword(data) {
    const res = await API.post("/auth/forgot-password", data);

    return res.data;
  }

  /*
  =========================================
  RESET PASSWORD
  =========================================
  */
  async function resetPassword(data) {
    const res = await API.post("/auth/reset-password", data);

    return res.data;
  }

  /*
  =========================================
  GET PROFILE
  =========================================
  */
  async function getProfile() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await API.get("/auth/profile");

      localStorage.setItem("user", JSON.stringify(res.data.user));

      dispatch({
        type: "PROFILE_UPDATED",
        payload: res.data.user,
      });
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      dispatch({
        type: "LOGOUT",
      });
    } finally {
      setLoading(false);
    }
  }

  /*
  =========================================
  UPDATE PROFILE
  =========================================
  */
  async function updateProfile(data) {
    const res = await API.post("/auth/update-profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    localStorage.setItem("user", JSON.stringify(res.data.user));

    dispatch({
      type: "PROFILE_UPDATED",
      payload: res.data.user,
    });

    return res.data;
  }

  /*
  =========================================
  CHANGE PASSWORD
  =========================================
  */
  async function changePassword(data) {
    const res = await API.post("/auth/change-password", data);

    return res.data;
  }

  /*
  =========================================
  SAVE FCM TOKEN
  =========================================
  */
  async function saveFcmToken(fcmToken) {
    const res = await API.post("/auth/save-fcm-token", {
      fcm_token: fcmToken,
    });

    return res.data;
  }

  /*
  =========================================
  LOGOUT
  =========================================
  */
  async function logout() {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.log(error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch({
      type: "LOGOUT",
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        register,
        login,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        getProfile,
        updateProfile,
        changePassword,
        saveFcmToken,
        logout,

        isAuthenticated: !!user && !!localStorage.getItem("token"),
        isAdmin: user?.role === "admin",
      }}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthDispatch() {
  return useContext(AuthDispatchContext);
}
