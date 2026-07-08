import { useEffect, useMemo, useState } from "react";

import { useChat } from "../../context/ChatContext";
import { useGroup } from "../../context/GroupContext";
import { useToast } from "../../context/ToastContext";

import { STORAGE_URL, DEFAULT_AVATAR } from "../../constants";

export default function AddMemberModal({ group, onClose }) {
  const { users, getUsers } = useChat();

  const { addMember } = useGroup();

  const { showToast } = useToast();

  const [search, setSearch] = useState("");

  const [loadingUserId, setLoadingUserId] = useState(null);

  useEffect(() => {
    if (!users.length) {
      getUsers().catch(() => {});
    }
  }, []);

  const existingMemberIds = useMemo(() => {
    return (group?.members || []).map((member) => Number(member.id));
  }, [group]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const isAlreadyMember = existingMemberIds.includes(Number(user.id));

      const matchesSearch = user.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      return !isAlreadyMember && matchesSearch;
    });
  }, [users, search, existingMemberIds]);

  function getAvatar(user) {
    if (user?.profile_image) {
      return `${STORAGE_URL}${user.profile_image}`;
    }

    return `${DEFAULT_AVATAR}&name=${encodeURIComponent(user?.name || "User")}`;
  }

  async function handleAdd(userId) {
    setLoadingUserId(userId);

    try {
      const res = await addMember(group.id, userId);

      showToast(res.message || "Member added successfully", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to add member",
        "danger",
      );
    } finally {
      setLoadingUserId(null);
    }
  }

  return (
    <div
      className="modal d-block"
      style={{
        background: "rgba(0,0,0,.5)",
      }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Add Member</h5>

            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="input-group mb-3">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>

              <input
                className="form-control"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="group-members-select">
              {filteredUsers.map((user) => (
                <div key={user.id} className="group-member-option">
                  <img src={getAvatar(user)} alt={user.name} />

                  <div className="text-start overflow-hidden">
                    <div className="fw-semibold text-truncate">{user.name}</div>

                    <small className="text-muted text-truncate d-block">
                      {user.email}
                    </small>
                  </div>

                  <button
                    className="btn btn-primary btn-sm ms-auto"
                    disabled={loadingUserId === user.id}
                    onClick={() => handleAdd(user.id)}>
                    {loadingUserId === user.id ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      "Add"
                    )}
                  </button>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center text-muted py-4">
                  No users available
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-light" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
