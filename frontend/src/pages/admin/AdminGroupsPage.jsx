import { useEffect, useState } from "react";
import API from "../../api/axios";
import { STORAGE_URL } from "../../constants";
import { useToast } from "../../context/ToastContext";
import { useModal } from "../../context/ModalContext";

export default function AdminGroupsPage() {
  const { showToast } = useToast();
  const { showModal } = useModal();

  const [groups, setGroups] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGroups();
  }, []);

  async function getGroups(page = 1) {
    setLoading(true);

    try {
      const res = await API.get("/admin/groups", {
        params: {
          page,
        },
      });

      const payload = res.data.groups || res.data.data || res.data;

      setGroups(payload.data || payload || []);

      setMeta({
        current_page: payload.current_page || 1,
        last_page: payload.last_page || 1,
      });
    } catch (error) {
      showToast("Failed to load groups", "danger");
    } finally {
      setLoading(false);
    }
  }

  function getGroupImage(group) {
    if (group?.image) {
      return `${STORAGE_URL}${group.image}`;
    }

    return null;
  }

  function handleDelete(group) {
    showModal({
      title: "Delete Group?",
      message: `Are you sure you want to delete "${group.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        try {
          await API.delete(`/admin/groups/${group.id}`);

          showToast("Group deleted successfully", "success");

          getGroups(meta?.current_page || 1);
        } catch (error) {
          showToast(
            error.response?.data?.message || "Failed to delete group",
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
          <h3 className="fw-bold mb-1">Groups</h3>
          <p className="text-muted mb-0">
            Manage group chats and group members.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary rounded-3"
          onClick={() => getGroups()}>
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh
        </button>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : groups.length === 0 ? (
          <div className="admin-empty">No groups found.</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table align-middle admin-table">
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Admin</th>
                    <th>Members</th>
                    <th>Created</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {groups.map((group) => (
                    <tr key={group.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {getGroupImage(group) ? (
                            <img
                              src={getGroupImage(group)}
                              alt={group.name}
                              className="admin-table-avatar"
                            />
                          ) : (
                            <div className="admin-table-icon">
                              <i className="bi bi-collection"></i>
                            </div>
                          )}

                          <div>
                            <div className="fw-semibold">{group.name}</div>
                            <small className="text-muted">ID: {group.id}</small>
                          </div>
                        </div>
                      </td>

                      <td>{group.admin?.name || "Unknown"}</td>

                      <td>
                        <span className="badge text-bg-primary">
                          {group.members_count || group.members?.length || 0}{" "}
                          members
                        </span>
                      </td>

                      <td>
                        {group.created_at
                          ? new Date(group.created_at).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(group)}>
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </button>
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
                  onClick={() => getGroups(meta.current_page - 1)}>
                  Previous
                </button>

                <span className="btn btn-light btn-sm disabled">
                  Page {meta.current_page} of {meta.last_page}
                </span>

                <button
                  className="btn btn-light btn-sm"
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() => getGroups(meta.current_page + 1)}>
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
