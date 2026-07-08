export default function authReducer(currentUser, action) {
  switch (action.type) {
    case "LOGIN": {
      localStorage.setItem("user", JSON.stringify(action.payload));

      return action.payload;
    }

    case "REGISTER": {
      localStorage.setItem("user", JSON.stringify(action.payload));

      return action.payload;
    }

    case "VERIFY_OTP": {
      localStorage.setItem("user", JSON.stringify(action.payload));

      return action.payload;
    }

    case "PROFILE_UPDATED": {
      localStorage.setItem("user", JSON.stringify(action.payload));

      return action.payload;
    }

    case "GET_CACHED_USER": {
      const user = JSON.parse(localStorage.getItem("user")) || null;

      return user;
    }

    case "LOGOUT": {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return null;
    }

    default:
      return currentUser;
  }
}
