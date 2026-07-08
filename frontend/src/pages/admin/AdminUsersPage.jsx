import { useEffect, useState } from "react";
import API from "../../api/axios";
import { STORAGE_URL, DEFAULT_AVATAR } from "../../constants";
import { useToast } from "../../context/ToastContext";
import { useModal } from "../../context/ModalContext";

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const { showModal } = useModal();

  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers(page = 1, keyword = search) {
    setLoading(true);

    try {
      const res = await API.get("/admin/users", {
        params: {
          page,
          search: keyword,
        },
      });

      const payload = res.data.users || res.data.data || res.data;

      setUsers(payload.data || payload || []);

      setMeta({
        current_page: payload.current_page || 1,
        last_page: payload.last_page || 1,
      });
    } catch (error) {
      showToast("Failed to load users", "danger");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();

    getUsers(1, search);
  }

  function getAvatar(user) {
    if (user?.profile_image) {
      return `${STORAGE_URL}${user.profile_image}`;
    }

    return `${DEFAULT_AVATAR}&name=${encodeURIComponent(user?.name || "User")}`;
  }

  function handleToggleBan(user) {
    showModal({
      title: user.is_banned ? "Unban User?" : "Ban User?",
      message: user.is_banned
        ? `Are you sure you want to unban ${user.name}?`
        : `Are you sure you want to ban ${user.name}? They will not be able to use the system.`,
      confirmText: user.is_banned ? "Unban" : "Ban",
      cancelText: "Cancel",
      type: user.is_banned ? "primary" : "danger",
      onConfirm: async () => {
        try {
          const endpoint = user.is_banned
            ? `/admin/users/${user.id}/unban`
            : `/admin/users/${user.id}/ban`;

          await API.post(endpoint);

          showToast(
            user.is_banned
              ? "User unbanned successfully"
              : "User banned successfully",
            "success",
          );

          getUsers(meta?.current_page || 1);
        } catch (error) {
          showToast(
            error.response?.data?.message || "Failed to update user",
            "danger",
          );
        }
      },
    });
  }

  function handleDelete(user) {
    showModal({
      title: "Delete User?",
      message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        try {
          await API.delete(`/admin/users/${user.id}`);

          showToast("User deleted successfully", "success");

          getUsers(meta?.current_page || 1);
        } catch (error) {
          showToast(
            error.response?.data?.message || "Failed to delete user",
            "danger",
          );
        }
      },
    });
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h3 className="fw-bold mb-1">Users</h3>
          <p className="text-muted mb-0">
            Manage users, roles, bans, and accounts.
          </p>
        </div>
      </div>

      <div className="admin-card mb-4">
        <form className="row g-2" onSubmit={handleSearch}>
          <div className="col-md-10">
            <input
              className="form-control rounded-3"
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <button className="btn btn-primary rounded-3 w-100">
              <i className="bi bi-search me-1"></i>
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="admin-empty">No users found.</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table align-middle admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Online</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={getAvatar(user)}
                            alt={user.name}
                            className="admin-table-avatar"
                          />

                          <div>
                            <div className="fw-semibold">{user.name}</div>
                            <small className="text-muted">{user.email}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            user.role === "admin"
                              ? "text-bg-primary"
                              : "text-bg-secondary"
                          }`}>
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            user.is_banned
                              ? "text-bg-danger"
                              : "text-bg-success"
                          }`}>
                          {user.is_banned ? "Banned" : "Active"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            user.is_online
                              ? "text-bg-success"
                              : "text-bg-light text-dark"
                          }`}>
                          {user.is_online ? "Online" : "Offline"}
                        </span>
                      </td>

                      <td className="text-end">
                        <div className="btn-group">
                          <button
                            type="button"
                            className={`btn btn-sm ${
                              user.is_banned
                                ? "btn-outline-primary"
                                : "btn-outline-warning"
                            }`}
                            onClick={() => handleToggleBan(user)}
                            disabled={user.role === "admin"}>
                            {user.is_banned ? "Unban" : "Ban"}
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(user)}
                            disabled={user.role === "admin"}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta && meta.last_page > 1 && (
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  className="btn btn-light btn-sm"
                  disabled={meta.current_page <= 1}
                  onClick={() => getUsers(meta.current_page - 1)}>
                  Previous
                </button>

                <span className="btn btn-light btn-sm disabled">
                  Page {meta.current_page} of {meta.last_page}
                </span>

                <button
                  className="btn btn-light btn-sm"
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() => getUsers(meta.current_page + 1)}>
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
