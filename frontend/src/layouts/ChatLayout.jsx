import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

import Echo from "../bootstrap/echo";

import { setupNotifications } from "../utils/notificationPermission";
import { listenForegroundMessages } from "../bootstrap/firebase";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useChatDispatch } from "../context/ChatContext";

import { STORAGE_URL, DEFAULT_AVATAR } from "../constants";

export default function ChatLayout() {
  const { user, logout } = useAuth();

  const { showToast } = useToast();

  const dispatch = useChatDispatch();

  const navigate = useNavigate();

  const [notificationLoading, setNotificationLoading] = useState(false);

  async function handleLogout() {
    await logout();

    navigate("/login");
  }

  async function handleEnableNotifications() {
    setNotificationLoading(true);

    try {
      const res = await setupNotifications();

      if (res.status) {
        showToast("Notifications enabled successfully", "success");
      } else {
        showToast(res.message, "warning");
      }
    } catch (error) {
      showToast("Failed to enable notifications", "danger");
    } finally {
      setNotificationLoading(false);
    }
  }

  const avatar = user?.profile_image
    ? `${STORAGE_URL}${user.profile_image}`
    : `${DEFAULT_AVATAR}&name=${encodeURIComponent(user?.name || "User")}`;

  /*
  ==========================
  PRIVATE REALTIME LISTENER
  ==========================
  */

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const channel = Echo.private(`chat.${user.id}`);

    channel.listen(".private.message.sent", (e) => {
      const message = e.message;

      const otherUserId =
        Number(message.sender_id) === Number(user.id)
          ? message.receiver_id
          : message.sender_id;

      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          userId: otherUserId,
          message,
        },
      });

      dispatch({
        type: "UPDATE_CONVERSATION_LAST_MESSAGE",
        payload: {
          message,
          authUserId: user.id,
        },
      });
    });

    channel.listen(".message.delivered", (e) => {
      const selectedUser =
        JSON.parse(localStorage.getItem("chat_selected_user")) || null;

      if (!selectedUser?.id) {
        return;
      }

      dispatch({
        type: "MARK_MESSAGE_DELIVERED",
        payload: {
          userId: selectedUser.id,
          messageId: e.message_id,
          deliveredAt: e.delivered_at,
        },
      });
    });

    channel.listen(".message.seen", (e) => {
      const selectedUser =
        JSON.parse(localStorage.getItem("chat_selected_user")) || null;

      if (!selectedUser?.id) {
        return;
      }

      dispatch({
        type: "MARK_MESSAGE_SEEN",
        payload: {
          userId: selectedUser.id,
          messageId: e.message_id,
          seenAt: e.seen_at,
        },
      });
    });

    channel.listen(".user.typing", (e) => {
      dispatch({
        type: "SET_TYPING",
        payload: {
          userId: e.sender_id,
          isTyping: true,
        },
      });

      setTimeout(() => {
        dispatch({
          type: "SET_TYPING",
          payload: {
            userId: e.sender_id,
            isTyping: false,
          },
        });
      }, 2000);
    });

    return () => {
      Echo.leave(`chat.${user.id}`);
    };
  }, [user?.id, dispatch]);

  /*
  ==========================
  FIREBASE FOREGROUND MESSAGE
  ==========================
  */

  useEffect(() => {
    listenForegroundMessages((payload) => {
      const title = payload.notification?.title || "New Message";

      const body = payload.notification?.body || "You received a new message";

      showToast(`${title}: ${body}`, "info");
    });
  }, []);

  return (
    <div className="chat-shell">
      <aside className="chat-main-sidebar">
        <div className="chat-brand">
          <div className="chat-brand-icon">
            <i className="bi bi-chat-dots-fill"></i>
          </div>

          <div>
            <h5 className="mb-0 fw-bold">Chat App</h5>
            <small className="text-muted">Real-time messaging</small>
          </div>
        </div>

        <nav className="chat-nav">
          <Link to="/chat" className="chat-nav-link">
            <i className="bi bi-chat-left-text"></i>
            <span>Chats</span>
          </Link>

          <Link to="/chat/users" className="chat-nav-link">
            <i className="bi bi-people"></i>
            <span>Users</span>
          </Link>

          <Link to="/chat/groups" className="chat-nav-link">
            <i className="bi bi-collection"></i>
            <span>Groups</span>
          </Link>

          <Link to="/chat/ai" className="chat-nav-link">
            <i className="bi bi-robot"></i>
            <span>AI Chat</span>
          </Link>

          <Link to="/chat/search" className="chat-nav-link">
            <i className="bi bi-search"></i>
            <span>Search</span>
          </Link>

          <Link to="/profile" className="chat-nav-link">
            <i className="bi bi-person"></i>
            <span>Profile</span>
          </Link>

          {user?.role === "admin" && (
            <Link to="/admin/dashboard" className="chat-nav-link">
              <i className="bi bi-speedometer2"></i>
              <span>Admin</span>
            </Link>
          )}
        </nav>

        <div className="chat-sidebar-footer">
          <div className="d-flex align-items-center gap-2 mb-3">
            <img src={avatar} alt={user?.name} className="chat-user-avatar" />

            <div className="overflow-hidden">
              <div className="fw-semibold text-truncate">{user?.name}</div>
              <small className="text-white">{user?.role}</small>
            </div>
          </div>
{/* 
          <button
            className="btn btn-outline-light btn-sm w-100 mb-2"
            onClick={handleEnableNotifications}
            disabled={notificationLoading}>
            {notificationLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1"></span>
                Enabling...
              </>
            ) : (
              <>
                <i className="bi bi-bell me-1"></i>
                Enable Notifications
              </>
            )}
          </button> */}

          <button
            className="btn btn-outline-danger btn-sm w-100"
            onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i>
            Logout
          </button>
        </div>
      </aside>

      <main className="chat-main-content">
        <Outlet />
      </main>
    </div>
  );
}
