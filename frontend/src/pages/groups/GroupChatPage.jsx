import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Echo from "../../bootstrap/echo";

import { useAuth } from "../../context/AuthContext";
import { useGroup, useGroupDispatch } from "../../context/GroupContext";
import { useToast } from "../../context/ToastContext";
import { useModal } from "../../context/ModalContext";

import AddMemberModal from "../../components/groups/AddMemberModal";
import GroupMembersModal from "../../components/groups/GroupMembersModal";

import { STORAGE_URL, DEFAULT_GROUP_IMAGE } from "../../constants";

export default function GroupChatPage() {
  const { groupId } = useParams();

  const { user } = useAuth();

  const {
    selectedGroup,
    messages,
    sending,
    getGroupDetails,
    getGroupMessages,
    sendGroupMessage,
    deleteGroup,
  } = useGroup();

  const dispatch = useGroupDispatch();

  const { showToast } = useToast();
  const { showModal } = useModal();

  const bottomRef = useRef(null);

  const [showAddMember, setShowAddMember] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const [form, setForm] = useState({
    message: "",
    type: "text",
    file: null,
  });

  const currentMessages = messages[groupId] || [];

  const isAdmin = selectedGroup?.members?.some(
    (member) =>
      Number(member.id) === Number(user?.id) && member.pivot?.is_admin,
  );

  function getGroupImage(group) {
    if (group?.image) {
      return `${STORAGE_URL}${group.image}`;
    }

    return `${DEFAULT_GROUP_IMAGE}&name=${encodeURIComponent(
      group?.name || "Group",
    )}`;
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

  useEffect(() => {
    async function load() {
      try {
        await getGroupDetails(groupId);
        await getGroupMessages(groupId);
      } catch (error) {
        showToast("Failed to load group", "danger");
      }
    }

    load();
  }, [groupId]);

  /*
  ==========================
  GROUP REALTIME LISTENER
  ==========================
  */

  useEffect(() => {
    if (!groupId) {
      return;
    }

    const channel = Echo.private(`group.${groupId}`);

    channel.listen(".group.message.sent", (e) => {
      dispatch({
        type: "ADD_GROUP_MESSAGE",
        payload: {
          groupId,
          message: e.message,
        },
      });
    });

    return () => {
      Echo.leave(`group.${groupId}`);
    };
  }, [groupId, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [currentMessages.length]);

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

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.message.trim() && !form.file) {
      return;
    }

    try {
      let data;

      if (form.file) {
        data = new FormData();

        data.append("type", form.type);
        data.append("file", form.file);

        if (form.message.trim()) {
          data.append("message", form.message);
        }
      } else {
        data = {
          type: "text",
          message: form.message,
        };
      }

      await sendGroupMessage(groupId, data);

      setForm({
        message: "",
        type: "text",
        file: null,
      });
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to send group message",
        "danger",
      );
    }
  }

  function handleDeleteGroup() {
    showModal({
      title: "Delete Group?",
      message:
        "Are you sure you want to delete this group? This action cannot be undone.",
      confirmText: "Delete Group",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteGroup(groupId);

          showToast("Group deleted successfully", "success");

          window.location.href = "/chat/groups";
        } catch (error) {
          showToast(
            error.response?.data?.message || "Failed to delete group",
            "danger",
          );
        }
      },
    });
  }

  function renderMessageContent(message) {
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
      <div className="private-chat-header">
        <Link to="/chat/groups" className="btn btn-light btn-sm">
          <i className="bi bi-arrow-left"></i>
        </Link>

        <img
          src={getGroupImage(selectedGroup)}
          alt={selectedGroup?.name}
          className="private-chat-avatar"
        />

        <div className="overflow-hidden me-auto">
          <h6 className="mb-0 fw-bold text-truncate">
            {selectedGroup?.name || "Group"}
          </h6>

          <small className="text-muted">
            {selectedGroup?.members?.length || 0} members
          </small>
        </div>

        <button
          type="button"
          className="btn btn-light btn-sm"
          onClick={() => setShowMembers(true)}>
          <i className="bi bi-people"></i>
        </button>

        {isAdmin && (
          <>
            <button
              type="button"
              className="btn btn-light btn-sm"
              onClick={() => setShowAddMember(true)}>
              <i className="bi bi-person-plus"></i>
            </button>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={handleDeleteGroup}>
              <i className="bi bi-trash"></i>
            </button>
          </>
        )}
      </div>

      <div className="private-chat-body">
        {currentMessages.length === 0 && (
          <div className="text-center text-muted py-5">
            <i className="bi bi-collection fs-1"></i>
            <p className="mt-2 mb-0">No group messages yet.</p>
          </div>
        )}

        {currentMessages.map((message) => {
          const isMine = Number(message.sender_id) === Number(user?.id);

          return (
            <div
              key={message.id}
              className={`message-row ${isMine ? "mine" : "theirs"}`}>
              <div className="message-bubble">
                {!isMine && (
                  <div className="group-message-sender">
                    {message.sender?.name}
                  </div>
                )}

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
                      <i title="Sent" className="bi bi-check2"></i>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      <form className="private-chat-input" onSubmit={handleSubmit}>
        <label className="btn btn-light mb-0">
          <i className="bi bi-paperclip"></i>

          <input type="file" hidden onChange={handleFileSelect} />
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
            form.file ? `Selected: ${form.file.name}` : "Message group..."
          }
          value={form.message}
          onChange={(e) =>
            setForm({
              ...form,
              message: e.target.value,
            })
          }
        />

        <button className="btn btn-primary" disabled={sending}>
          {sending ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            <i className="bi bi-send"></i>
          )}
        </button>
      </form>

      {showAddMember && selectedGroup && (
        <AddMemberModal
          group={selectedGroup}
          onClose={() => setShowAddMember(false)}
        />
      )}

      {showMembers && selectedGroup && (
        <GroupMembersModal
          group={selectedGroup}
          onClose={() => setShowMembers(false)}
        />
      )}
    </div>
  );
}
