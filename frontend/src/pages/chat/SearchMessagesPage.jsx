import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useChat } from "../../context/ChatContext";
import { useToast } from "../../context/ToastContext";

import { STORAGE_URL, DEFAULT_AVATAR } from "../../constants";

export default function SearchMessagesPage() {
  const { users, searchResults, getUsers, searchMessages } = useChat();

  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    search: "",
    user_id: "",
  });

  useEffect(() => {
    if (!users.length) {
      getUsers().catch(() => {});
    }
  }, []);

  const selectedUser = useMemo(() => {
    if (!form.user_id) {
      return null;
    }

    return users.find((user) => Number(user.id) === Number(form.user_id));
  }, [users, form.user_id]);

  function getAvatar(user) {
    if (user?.profile_image) {
      return `${STORAGE_URL}${user.profile_image}`;
    }

    return `${DEFAULT_AVATAR}&name=${encodeURIComponent(user?.name || "User")}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.search.trim()) {
      return showToast("Write something to search", "warning");
    }

    setLoading(true);

    try {
      await searchMessages(
        form.search.trim(),
        form.user_id ? form.user_id : null,
      );
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to search messages",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  }

  function renderMessagePreview(message) {
    if (message.deleted_for_everyone) {
      return "This message was deleted";
    }

    if (message.type === "text") {
      return message.message;
    }

    if (message.type === "image") {
      return "Image message";
    }

    if (message.type === "video") {
      return "Video message";
    }

    if (message.type === "audio") {
      return "Audio message";
    }

    if (message.type === "file") {
      return "File message";
    }

    if (message.type === "location") {
      return "Location message";
    }

    return message.message || "Message";
  }

  function renderAttachment(message) {
    if (!message.file && message.type !== "location") {
      return null;
    }

    if (message.type === "image") {
      return (
        <img
          src={`${STORAGE_URL}${message.file}`}
          alt="message"
          className="search-message-image"
        />
      );
    }

    if (message.type === "video") {
      return (
        <video controls className="search-message-video">
          <source src={`${STORAGE_URL}${message.file}`} />
        </video>
      );
    }

    if (message.type === "audio") {
      return (
        <audio controls className="search-message-audio">
          <source src={`${STORAGE_URL}${message.file}`} />
        </audio>
      );
    }

    if (message.type === "file") {
      return (
        <a
          href={`${STORAGE_URL}${message.file}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm btn-light border">
          <i className="bi bi-paperclip me-1"></i>
          Open File
        </a>
      );
    }

    if (message.type === "location") {
      return (
        <a
          href={`https://www.google.com/maps?q=${message.latitude},${message.longitude}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm btn-light border">
          <i className="bi bi-geo-alt me-1"></i>
          Open Location
        </a>
      );
    }

    return null;
  }

  function getOtherUser(message) {
    if (message.sender && message.receiver) {
      if (Number(message.sender.id) === Number(selectedUser?.id)) {
        return message.sender;
      }

      if (Number(message.receiver.id) === Number(selectedUser?.id)) {
        return message.receiver;
      }

      return message.sender;
    }

    return message.sender || message.receiver || null;
  }

  return (
    <div className="chat-page">
      <div className="chat-page-header">
        <div>
          <h3 className="fw-bold mb-1">Search Messages</h3>
          <p className="text-muted mb-0">
            Search text, files, images, and conversations
          </p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 align-items-end">
              <div className="col-lg-6">
                <label className="form-label fw-semibold">Search</label>

                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>

                  <input
                    className="form-control"
                    placeholder="Search messages..."
                    value={form.search}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        search: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <label className="form-label fw-semibold">Filter by user</label>

                <select
                  className="form-select"
                  value={form.user_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      user_id: e.target.value,
                    })
                  }>
                  <option value="">All users</option>

                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-lg-2">
                <button
                  className="btn btn-primary w-100 rounded-3"
                  disabled={loading}>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <>
                      <i className="bi bi-search me-1"></i>
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {selectedUser && (
        <div className="alert alert-light border rounded-4 d-flex align-items-center gap-2">
          <img
            src={getAvatar(selectedUser)}
            alt={selectedUser.name}
            className="search-filter-avatar"
          />

          <div>
            <div className="fw-semibold">
              Searching with {selectedUser.name}
            </div>
            <small className="text-muted">{selectedUser.email}</small>
          </div>

          <button
            className="btn btn-sm btn-light ms-auto"
            onClick={() =>
              setForm({
                ...form,
                user_id: "",
              })
            }>
            Clear Filter
          </button>
        </div>
      )}

      <div className="search-results-wrapper">
        {searchResults.length === 0 && !loading && (
          <div className="empty-chat-state">
            <i className="bi bi-search"></i>
            <h5>No results yet</h5>
            <p>Search for messages by keyword.</p>
          </div>
        )}

        {searchResults.map((message) => {
          const otherUser = getOtherUser(message);

          const chatUserId =
            Number(message.sender_id) === Number(otherUser?.id)
              ? message.sender_id
              : message.receiver_id;

          return (
            <div key={message.id} className="search-message-card">
              <div className="d-flex gap-3">
                <img
                  src={getAvatar(otherUser)}
                  alt={otherUser?.name}
                  className="search-message-avatar"
                />

                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex justify-content-between gap-3">
                    <div>
                      <h6 className="fw-bold mb-1">
                        {otherUser?.name || "User"}
                      </h6>

                      <small className="text-muted">
                        {message.created_at
                          ? new Date(message.created_at).toLocaleString()
                          : ""}
                      </small>
                    </div>

                    <Link
                      to={`/chat/private/${chatUserId}`}
                      className="btn btn-sm btn-outline-primary rounded-pill">
                      Open Chat
                    </Link>
                  </div>

                  <div className="search-message-preview mt-3">
                    {renderMessagePreview(message)}
                  </div>

                  <div className="mt-3">{renderAttachment(message)}</div>

                  <div className="mt-3">
                    <span className="badge rounded-pill text-bg-light border">
                      {message.type}
                    </span>

                    {message.is_seen && (
                      <span className="badge rounded-pill text-bg-success ms-2">
                        Seen
                      </span>
                    )}

                    {message.is_delivered && (
                      <span className="badge rounded-pill text-bg-primary ms-2">
                        Delivered
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
