import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import { STORAGE_URL, DEFAULT_AVATAR } from "../../constants";

export default function ChatPage() {
  const { conversations, getConversations, loading } = useChat();

  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    getConversations();
  }, []);

  function getSetting(item) {
    return item.setting || item.chat_setting || {};
  }

  const filteredConversations = useMemo(() => {
    let result = [...conversations];

    if (activeFilter === "pinned") {
      result = result.filter((item) => getSetting(item)?.is_pinned);
    }

    if (activeFilter === "muted") {
      result = result.filter((item) => getSetting(item)?.is_muted);
    }

    if (activeFilter === "blocked") {
      result = result.filter((item) => getSetting(item)?.is_blocked);
    }

    if (activeFilter === "archived") {
      result = result.filter((item) => getSetting(item)?.is_archived);
    }

    return result.sort((a, b) => {
      const aSetting = getSetting(a);
      const bSetting = getSetting(b);

      const aPinned = aSetting?.is_pinned;
      const bPinned = bSetting?.is_pinned;

      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;

      const aTime = a.last_message?.created_at
        ? new Date(a.last_message.created_at).getTime()
        : 0;

      const bTime = b.last_message?.created_at
        ? new Date(b.last_message.created_at).getTime()
        : 0;

      return bTime - aTime;
    });
  }, [conversations, activeFilter]);

  const counts = useMemo(() => {
    return {
      all: conversations.length,
      pinned: conversations.filter((item) => getSetting(item)?.is_pinned)
        .length,
      muted: conversations.filter((item) => getSetting(item)?.is_muted).length,
      blocked: conversations.filter((item) => getSetting(item)?.is_blocked)
        .length,
      archived: conversations.filter((item) => getSetting(item)?.is_archived)
        .length,
    };
  }, [conversations]);

  function getAvatar(user) {
    if (user?.profile_image) {
      return `${STORAGE_URL}${user.profile_image}`;
    }

    return `${DEFAULT_AVATAR}&name=${encodeURIComponent(user?.name || "User")}`;
  }

  function getEmptyText() {
    if (activeFilter === "all") {
      return {
        title: "No conversations yet",
        text: "Start a new chat with any user.",
        icon: "bi-chat-square-text",
      };
    }

    if (activeFilter === "pinned") {
      return {
        title: "No pinned chats",
        text: "Pinned conversations will appear here.",
        icon: "bi-pin-angle",
      };
    }

    if (activeFilter === "muted") {
      return {
        title: "No muted chats",
        text: "Muted conversations will appear here.",
        icon: "bi-bell-slash",
      };
    }

    if (activeFilter === "blocked") {
      return {
        title: "No blocked users",
        text: "Blocked conversations will appear here.",
        icon: "bi-slash-circle",
      };
    }

    return {
      title: "No archived chats",
      text: "Archived conversations will appear here.",
      icon: "bi-archive",
    };
  }

  const empty = getEmptyText();

  return (
    <div className="chat-page">
      <div className="chat-page-header">
        <div>
          <h3 className="fw-bold mb-1">Messages</h3>
          <p className="text-muted mb-0">Continue your conversations</p>
        </div>

        <Link to="/chat/users" className="btn btn-primary rounded-3">
          <i className="bi bi-plus-lg me-1"></i>
          New Chat
        </Link>
      </div>

      <div className="chat-filter-card">
        <button
          type="button"
          className={`chat-filter-btn ${
            activeFilter === "all" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("all")}>
          <i className="bi bi-chat-dots"></i>
          <span>All</span>
          <strong>{counts.all}</strong>
        </button>

        <button
          type="button"
          className={`chat-filter-btn ${
            activeFilter === "pinned" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("pinned")}>
          <i className="bi bi-pin-angle"></i>
          <span>Pinned</span>
          <strong>{counts.pinned}</strong>
        </button>

        <button
          type="button"
          className={`chat-filter-btn ${
            activeFilter === "muted" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("muted")}>
          <i className="bi bi-bell-slash"></i>
          <span>Muted</span>
          <strong>{counts.muted}</strong>
        </button>

        <button
          type="button"
          className={`chat-filter-btn ${
            activeFilter === "blocked" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("blocked")}>
          <i className="bi bi-slash-circle"></i>
          <span>Blocked</span>
          <strong>{counts.blocked}</strong>
        </button>

        <button
          type="button"
          className={`chat-filter-btn ${
            activeFilter === "archived" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("archived")}>
          <i className="bi bi-archive"></i>
          <span>Archived</span>
          <strong>{counts.archived}</strong>
        </button>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      )}

      {!loading && filteredConversations.length === 0 && (
        <div className="empty-chat-state">
          <i className={`bi ${empty.icon}`}></i>
          <h5>{empty.title}</h5>
          <p>{empty.text}</p>

          {activeFilter === "all" && (
            <Link to="/chat/users" className="btn btn-primary">
              Find Users
            </Link>
          )}
        </div>
      )}

      {!loading && filteredConversations.length > 0 && (
        <div className="chat-list-card">
          {filteredConversations.map((item) => {
            const setting = getSetting(item);

            return (
              <Link
                key={item.user?.id}
                to={`/chat/private/${item.user?.id}`}
                className={`conversation-row ${
                  setting?.is_archived ? "conversation-archived" : ""
                }`}>
                <div className="position-relative">
                  <img
                    src={getAvatar(item.user)}
                    alt={item.user?.name}
                    className="conversation-avatar"
                  />

                  {item.user?.is_online && (
                    <span className="online-dot online"></span>
                  )}
                </div>

                <div className="conversation-body">
                  <div className="d-flex justify-content-between align-items-center gap-2">
                    <div className="d-flex align-items-center gap-2 overflow-hidden">
                      <h6 className="mb-0 fw-bold text-truncate">
                        {item.user?.name}
                      </h6>

                      {setting?.is_pinned && (
                        <span className="conversation-icon">
                          <i className="bi bi-pin-angle-fill"></i>
                        </span>
                      )}

                      {setting?.is_muted && (
                        <span className="conversation-icon">
                          <i className="bi bi-bell-slash-fill"></i>
                        </span>
                      )}

                      {setting?.is_blocked && (
                        <span className="conversation-icon danger">
                          <i className="bi bi-slash-circle-fill"></i>
                        </span>
                      )}
                    </div>

                    {item.unread_count > 0 && (
                      <span className="badge rounded-pill text-bg-primary">
                        {item.unread_count}
                      </span>
                    )}
                  </div>

                  <p className="mb-0 text-muted text-truncate">
                    {item.last_message?.deleted_for_everyone
                      ? "Message deleted"
                      : item.last_message?.message ||
                        (item.last_message?.type !== "text"
                          ? `Sent a ${item.last_message?.type}`
                          : "No message")}
                  </p>

                  <div className="conversation-tags">
                    {setting?.is_archived && (
                      <span>
                        <i className="bi bi-archive me-1"></i>
                        Archived
                      </span>
                    )}

                    {setting?.is_pinned && (
                      <span>
                        <i className="bi bi-pin-angle me-1"></i>
                        Pinned
                      </span>
                    )}

                    {setting?.is_muted && (
                      <span>
                        <i className="bi bi-bell-slash me-1"></i>
                        Muted
                      </span>
                    )}

                    {setting?.is_blocked && (
                      <span className="danger">
                        <i className="bi bi-slash-circle me-1"></i>
                        Blocked
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
