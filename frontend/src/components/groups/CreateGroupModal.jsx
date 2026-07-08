import { useEffect, useMemo, useState } from "react";

import { useChat } from "../../context/ChatContext";
import { useGroup } from "../../context/GroupContext";
import { useToast } from "../../context/ToastContext";

import { STORAGE_URL, DEFAULT_AVATAR } from "../../constants";

export default function CreateGroupModal({ onClose }) {
  const { users, getUsers } = useChat();

  const { createGroup } = useGroup();

  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    image: null,
    members: [],
  });

  useEffect(() => {
    if (!users.length) {
      getUsers().catch(() => {});
    }
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  function getAvatar(user) {
    if (user?.profile_image) {
      return `${STORAGE_URL}${user.profile_image}`;
    }

    return `${DEFAULT_AVATAR}&name=${encodeURIComponent(user?.name || "User")}`;
  }

  function toggleMember(userId) {
    const exists = form.members.includes(userId);

    setForm({
      ...form,
      members: exists
        ? form.members.filter((id) => id !== userId)
        : [...form.members, userId],
    });
  }

  function handleImage(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setForm({
      ...form,
      image: file,
    });

    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      return showToast("Group name is required", "warning");
    }

    if (!form.members.length) {
      return showToast("Choose at least one member", "warning");
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", form.name);

      if (form.image) {
        data.append("image", form.image);
      }

      form.members.forEach((memberId) => {
        data.append("members[]", memberId);
      });

      await createGroup(data);

      showToast("Group created successfully", "success");

      onClose();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to create group",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal d-block"
      style={{
        background: "rgba(0,0,0,.5)",
      }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 rounded-4">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Create Group</h5>

            <button className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="text-center mb-3">
                <label className="group-upload">
                  {preview ? (
                    <img src={preview} alt="Group Preview" />
                  ) : (
                    <i className="bi bi-collection"></i>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    hidden
                  />
                </label>

                <div className="small text-muted mt-2">
                  Optional group image
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Group Name</label>

                <input
                  className="form-control"
                  placeholder="Enter group name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Members</label>

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
                  {filteredUsers.map((user) => {
                    const checked = form.members.includes(user.id);

                    return (
                      <button
                        key={user.id}
                        type="button"
                        className={`group-member-option ${
                          checked ? "active" : ""
                        }`}
                        onClick={() => toggleMember(user.id)}>
                        <img src={getAvatar(user)} alt={user.name} />

                        <div className="text-start overflow-hidden">
                          <div className="fw-semibold text-truncate">
                            {user.name}
                          </div>

                          <small className="text-muted text-truncate d-block">
                            {user.email}
                          </small>
                        </div>

                        {checked && (
                          <i className="bi bi-check-circle-fill ms-auto text-primary"></i>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={onClose}>
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary">
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating...
                  </>
                ) : (
                  "Create Group"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
