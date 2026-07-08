import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useToast } from "../../context/ToastContext";
import { useModal } from "../../context/ModalContext";

import { STORAGE_URL, DEFAULT_AVATAR } from "../../constants";

export default function PrivateChatPage() {
  const { userId } = useParams();

  const { user: authUser } = useAuth();

  const {
    users,
    selectedUser,
    messages,
    typingUsers,
    conversations,
    sending,

    getUsers,
    selectUser,
    getConversation,
    getConversations,

    sendMessage,
    deleteMessage,
    deleteForEveryone,
    reactMessage,
    sendTyping,

    pinChat,
    unpinChat,
    archiveChat,
    unarchiveChat,
    muteChat,
    unmuteChat,
    blockUser,
    unblockUser,
  } = useChat();

  const { showToast } = useToast();

  const { showModal } = useModal();

  const bottomRef = useRef(null);

  const typingTimer = useRef(null);

  const [settingsLoading, setSettingsLoading] = useState(false);

  const [form, setForm] = useState({
    message: "",
    type: "text",
    file: null,
  });

  const currentMessages = messages[userId] || [];

  const receiver = useMemo(() => {
    return (
      selectedUser ||
      users.find((item) => String(item.id) === String(userId)) ||
      null
    );
  }, [users, selectedUser, userId]);

  const conversationSetting = useMemo(() => {
    const conversation = conversations.find(
      (item) => Number(item.user?.id) === Number(userId),
    );

    return conversation?.setting || conversation?.chat_setting || null;
  }, [conversations, userId]);

  const isPinned = Boolean(conversationSetting?.is_pinned);
  const isArchived = Boolean(conversationSetting?.is_archived);
  const isMuted = Boolean(conversationSetting?.is_muted);
  const isBlocked = Boolean(conversationSetting?.is_blocked);

  /*
  ==========================
  LOAD USER + CONVERSATION
  ==========================
  */

  useEffect(() => {
    async function load() {
      try {
        let loadedUsers = users;

        if (!loadedUsers.length) {
          loadedUsers = await getUsers();
        }

        const foundUser =
          loadedUsers.find((item) => String(item.id) === String(userId)) ||
          null;

        if (foundUser) {
          selectUser(foundUser);
        }

        await getConversations();

        await getConversation(userId);
      } catch (error) {
        showToast("Failed to load conversation", "danger");
      }
    }

    load();
  }, [userId]);

  /*
  ==========================
  SCROLL TO BOTTOM
  ==========================
  */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [currentMessages.length, typingUsers[userId]]);

  /*
  ==========================
  HELPERS
  ==========================
  */

  function getAvatar(user) {
    if (user?.profile_image) {
      return `${STORAGE_URL}${user.profile_image}`;
    }

    return `${DEFAULT_AVATAR}&name=${encodeURIComponent(user?.name || "User")}`;
  }

  function formatMessageDateTime(date) {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /*
  ==========================
  SEND MESSAGE
  ==========================
  */

  async function handleSubmit(e) {
    e.preventDefault();

    if (isBlocked) {
      return showToast(
        "You blocked this user. Unblock to send messages.",
        "warning",
      );
    }

    if (!form.message.trim() && !form.file) {
      return;
    }

    try {
      let data;

      if (form.file) {
        data = new FormData();

        data.append("receiver_id", userId);
        data.append("type", form.type);
        data.append("file", form.file);

        if (form.message.trim()) {
          data.append("message", form.message);
        }
      } else {
        data = {
          receiver_id: userId,
          type: "text",
          message: form.message,
        };
      }

      await sendMessage(data, userId);

      setForm({
        message: "",
        type: "text",
        file: null,
      });
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to send message",
        "danger",
      );
    }
  }

  /*
  ==========================
  TYPING
  ==========================
  */

  function handleInputChange(e) {
    setForm({
      ...form,
      message: e.target.value,
    });

    if (isBlocked) {
      return;
    }

    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }

    typingTimer.current = setTimeout(() => {
      sendTyping(userId).catch(() => {});
    }, 400);
  }

  /*
  ==========================
  FILE SELECT
  ==========================
  */

  function handleFileSelect(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    let type = "file";

    if (file.type.startsWith("image/")) {
      type = "image";
    } else if (file.type.startsWith("video/")) {
      type = "video";
    } else if (file.type.startsWith("audio/")) {
      type = "audio";
    }

    setForm({
      ...form,
      file,
      type,
    });
  }

  /*
  ==========================
  DELETE MESSAGE MODAL
  ==========================
  */

  function handleDelete(messageId) {
    showModal({
      title: "Delete Message?",
      message: "This message will be deleted only from your side.",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteMessage(messageId, userId);

          showToast("Message deleted", "success");
        } catch (error) {
          showToast("Delete failed", "danger");
        }
      },
    });
  }

  /*
  ==========================
  DELETE FOR EVERYONE MODAL
  ==========================
  */

  function handleDeleteForEveryone(messageId) {
    showModal({
      title: "Delete For Everyone?",
      message:
        "This message will be removed for both users. This action cannot be undone.",
      confirmText: "Delete For Everyone",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteForEveryone(messageId, userId);

          showToast("Message deleted for everyone", "success");
        } catch (error) {
          showToast("Delete failed", "danger");
        }
      },
    });
  }

  /*
  ==========================
  REACTION
  ==========================
  */

  async function handleReaction(messageId, reaction) {
    try {
      await reactMessage(messageId, reaction, userId);
    } catch (error) {
      showToast("Reaction failed", "danger");
    }
  }

  /*
  ==========================
  CHAT SETTINGS ACTIONS
  ==========================
  */

  async function handleSettingAction(action) {
    setSettingsLoading(true);

    try {
      let res;

      if (action === "pin") {
        res = await pinChat(userId);
      }

      if (action === "unpin") {
        res = await unpinChat(userId);
      }

      if (action === "archive") {
        res = await archiveChat(userId);
      }

      if (action === "unarchive") {
        res = await unarchiveChat(userId);
      }

      if (action === "mute") {
        res = await muteChat(userId);
      }

      if (action === "unmute") {
        res = await unmuteChat(userId);
      }

      if (action === "block") {
        setSettingsLoading(false);

        return showModal({
          title: "Block User?",
          message:
            "You will not be able to send messages to this user until you unblock them.",
          confirmText: "Block",
          cancelText: "Cancel",
          type: "danger",
          onConfirm: async () => {
            try {
              setSettingsLoading(true);

              const res = await blockUser(userId);

              showToast(res?.message || "User blocked successfully", "success");

              await getConversations();
            } catch (error) {
              showToast(
                error.response?.data?.message || "Failed to block user",
                "danger",
              );
            } finally {
              setSettingsLoading(false);
            }
          },
        });
      }

      if (action === "unblock") {
        setSettingsLoading(false);

        return showModal({
          title: "Unblock User?",
          message: "You will be able to send messages to this user again.",
          confirmText: "Unblock",
          cancelText: "Cancel",
          type: "primary",
          onConfirm: async () => {
            try {
              setSettingsLoading(true);

              const res = await unblockUser(userId);

              showToast(
                res?.message || "User unblocked successfully",
                "success",
              );

              await getConversations();
            } catch (error) {
              showToast(
                error.response?.data?.message || "Failed to unblock user",
                "danger",
              );
            } finally {
              setSettingsLoading(false);
            }
          },
        });
      }

      showToast(res?.message || "Chat setting updated", "success");

      await getConversations();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to update chat setting",
        "danger",
      );
    } finally {
      setSettingsLoading(false);
    }
  }

  /*
  ==========================
  RENDER MESSAGE CONTENT
  ==========================
  */

  function renderMessageContent(message) {
    if (message.deleted_for_everyone) {
      return <em className="text-muted">This message was deleted</em>;
    }

    if (message.type === "image" && message.file) {
      return (
        <img
          src={`${STORAGE_URL}${message.file}`}
          alt="message"
          className="message-image"
        />
      );
    }

    if (message.type === "video" && message.file) {
      return (
        <video controls className="message-video">
          <source src={`${STORAGE_URL}${message.file}`} />
        </video>
      );
    }

    if (message.type === "audio" && message.file) {
      return (
        <audio controls className="message-audio">
          <source src={`${STORAGE_URL}${message.file}`} />
        </audio>
      );
    }

    if (message.type === "file" && message.file) {
      return (
        <a
          href={`${STORAGE_URL}${message.file}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm btn-light">
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
          className="btn btn-sm btn-light">
          <i className="bi bi-geo-alt me-1"></i>
          Open Location
        </a>
      );
    }

    return <span>{message.message}</span>;
  }

  return (
    <div className="private-chat">
      {/*
      ==========================
      HEADER
      ==========================
      */}

      <div className="private-chat-header">
        <Link to="/chat" className="btn btn-light btn-sm">
          <i className="bi bi-arrow-left"></i>
        </Link>

        <img
          src={getAvatar(receiver)}
          alt={receiver?.name}
          className="private-chat-avatar"
        />

        <div className="overflow-hidden me-auto">
          <div className="d-flex align-items-center gap-2">
            <h6 className="mb-0 fw-bold text-truncate">
              {receiver?.name || "Chat"}
            </h6>

            {isPinned && (
              <span className="chat-setting-chip">
                <i className="bi bi-pin-angle-fill"></i>
              </span>
            )}

            {isMuted && (
              <span className="chat-setting-chip">
                <i className="bi bi-bell-slash-fill"></i>
              </span>
            )}

            {isBlocked && (
              <span className="chat-setting-chip danger">
                <i className="bi bi-slash-circle-fill"></i>
              </span>
            )}
          </div>

          <small
            className={receiver?.is_online ? "text-success" : "text-muted"}>
            {receiver?.is_online ? "Online" : "Offline"}
          </small>
        </div>

        <div className="dropdown">
          <button
            type="button"
            className="btn btn-light btn-sm"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            disabled={settingsLoading}>
            <i className="bi bi-three-dots-vertical"></i>
          </button>

          <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-4">
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => handleSettingAction(isPinned ? "unpin" : "pin")}>
                <i className="bi bi-pin-angle me-2"></i>
                {isPinned ? "Unpin Chat" : "Pin Chat"}
              </button>
            </li>

            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() =>
                  handleSettingAction(isArchived ? "unarchive" : "archive")
                }>
                <i className="bi bi-archive me-2"></i>
                {isArchived ? "Unarchive Chat" : "Archive Chat"}
              </button>
            </li>

            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() =>
                  handleSettingAction(isMuted ? "unmute" : "mute")
                }>
                <i className="bi bi-bell-slash me-2"></i>
                {isMuted ? "Unmute Chat" : "Mute Chat"}
              </button>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li>

            <li>
              <button
                type="button"
                className={`dropdown-item ${isBlocked ? "" : "text-danger"}`}
                onClick={() =>
                  handleSettingAction(isBlocked ? "unblock" : "block")
                }>
                <i className="bi bi-slash-circle me-2"></i>
                {isBlocked ? "Unblock User" : "Block User"}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {isArchived && (
        <div className="chat-warning-bar">
          <i className="bi bi-archive me-1"></i>
          This chat is archived.
        </div>
      )}

      {isBlocked && (
        <div className="chat-warning-bar danger">
          <i className="bi bi-slash-circle me-1"></i>
          You blocked this user. You cannot send messages until you unblock.
        </div>
      )}

      {/*
      ==========================
      BODY
      ==========================
      */}

      <div className="private-chat-body">
        {currentMessages.length === 0 && (
          <div className="text-center text-muted py-5">
            <i className="bi bi-chat-dots fs-1"></i>

            <p className="mt-2 mb-0">
              No messages yet. Start the conversation.
            </p>
          </div>
        )}

        {currentMessages.map((message) => {
          const isMine = Number(message.sender_id) === Number(authUser?.id);

          return (
            <div
              key={message.id}
              className={`message-row ${isMine ? "mine" : "theirs"}`}>
              <div className="message-bubble">
                <div>{renderMessageContent(message)}</div>

                {message.message && message.type !== "text" && (
                  <div className="mt-2">{message.message}</div>
                )}

                <div className="message-meta">
                  <span className="message-time">
                    {formatMessageDateTime(message.created_at)}
                  </span>

                  {isMine && (
                    <span className="message-status">
                      {message.is_seen ? (
                        <i
                          title="Seen"
                          className="bi bi-check2-all text-info"></i>
                      ) : message.is_delivered ? (
                        <i title="Delivered" className="bi bi-check2-all"></i>
                      ) : (
                        <i title="Sent" className="bi bi-check2"></i>
                      )}
                    </span>
                  )}
                </div>

                {!message.deleted_for_everyone && (
                  <div className="message-actions">
                    {["❤️", "👍", "😂", "🔥", "😍"].map((reaction) => (
                      <button
                        key={reaction}
                        type="button"
                        onClick={() => handleReaction(message.id, reaction)}>
                        {reaction}
                      </button>
                    ))}

                    {isMine && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDelete(message.id)}>
                          Delete
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteForEveryone(message.id)}>
                          Delete All
                        </button>
                      </>
                    )}
                  </div>
                )}

                {message.reactions?.length > 0 && (
                  <div className="message-reactions">
                    {message.reactions.map((reaction) => (
                      <span key={reaction.id || reaction.user_id}>
                        {reaction.reaction}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {typingUsers[userId] && !isBlocked && (
          <div className="message-row theirs">
            <div className="message-bubble typing-bubble">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/*
      ==========================
      INPUT
      ==========================
      */}

      <form className="private-chat-input" onSubmit={handleSubmit}>
        <label className={`btn btn-light mb-0 ${isBlocked ? "disabled" : ""}`}>
          <i className="bi bi-paperclip"></i>

          <input
            type="file"
            hidden
            onChange={handleFileSelect}
            disabled={isBlocked}
          />
        </label>

        {form.file && (
          <button
            type="button"
            className="btn btn-warning"
            onClick={() =>
              setForm({
                ...form,
                file: null,
                type: "text",
              })
            }>
            <i className="bi bi-x-lg"></i>
          </button>
        )}

        <input
          className="form-control"
          placeholder={
            isBlocked
              ? "Unblock this user to send messages"
              : form.file
                ? `Selected: ${form.file.name}`
                : "Type a message..."
          }
          value={form.message}
          onChange={handleInputChange}
          disabled={isBlocked}
        />

        <button className="btn btn-primary" disabled={sending || isBlocked}>
          {sending ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            <i className="bi bi-send"></i>
          )}
        </button>
      </form>
    </div>
  );
}
