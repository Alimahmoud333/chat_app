import { useEffect, useState } from "react";
import API from "../../api/axios";
import { STORAGE_URL, DEFAULT_AVATAR } from "../../constants";
import { useToast } from "../../context/ToastContext";

export default function AdminDashboardPage() {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    users_count: 0,
    groups_count: 0,
    messages_count: 0,
    banned_users_count: 0,
  });

  const [latestUsers, setLatestUsers] = useState([]);
  const [latestGroups, setLatestGroups] = useState([]);

  useEffect(() => {
    getDashboard();
  }, []);
async function getDashboard() {
  setLoading(true);

  try {
    const res = await API.get("/admin/dashboard");

    console.log("ADMIN DASHBOARD RESPONSE:", res.data);

    const statistics = res.data.statistics || {};

    setStats({
      users_count: statistics.users_count || 0,
      groups_count: statistics.groups_count || 0,
      messages_count: statistics.messages_count || 0,
      banned_users_count: statistics.banned_users || 0,
    });

    setLatestUsers(res.data.latest_users || []);
    setLatestGroups(res.data.latest_groups || []);
  } catch (error) {
    showToast("Failed to load admin dashboard", "danger");
  } finally {
    setLoading(false);
  }
}
  function getAvatar(user) {
    if (user?.profile_image) {
      return `${STORAGE_URL}${user.profile_image}`;
    }

    return `${DEFAULT_AVATAR}&name=${encodeURIComponent(user?.name || "User")}`;
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h3 className="fw-bold mb-1">Dashboard</h3>
          <p className="text-muted mb-0">
            Overview of users, groups, and messages.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary rounded-3"
          onClick={getDashboard}>
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="admin-stat-card">
                <div className="admin-stat-icon primary">
                  <i className="bi bi-people-fill"></i>
                </div>

                <div>
                  <h4>{stats.users_count}</h4>
                  <p>Total Users</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="admin-stat-card">
                <div className="admin-stat-icon success">
                  <i className="bi bi-collection-fill"></i>
                </div>

                <div>
                  <h4>{stats.groups_count}</h4>
                  <p>Total Groups</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="admin-stat-card">
                <div className="admin-stat-icon warning">
                  <i className="bi bi-chat-dots-fill"></i>
                </div>

                <div>
                  <h4>{stats.messages_count}</h4>
                  <p>Total Messages</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="admin-stat-card">
                <div className="admin-stat-icon danger">
                  <i className="bi bi-person-x-fill"></i>
                </div>

                <div>
                  <h4>{stats.banned_users_count}</h4>
                  <p>Banned Users</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-lg-6">
              <div className="admin-card">
                <div className="admin-card-header">
                  <h5 className="fw-bold mb-0">Latest Users</h5>
                </div>

                {latestUsers.length === 0 ? (
                  <div className="admin-empty">No users found.</div>
                ) : (
                  <div className="admin-list">
                    {latestUsers.map((user) => (
                      <div className="admin-list-row" key={user.id}>
                        <img
                          src={getAvatar(user)}
                          alt={user.name}
                          className="admin-list-avatar"
                        />

                        <div className="overflow-hidden">
                          <h6 className="mb-0 text-truncate">{user.name}</h6>
                          <small className="text-muted text-truncate d-block">
                            {user.email}
                          </small>
                        </div>

                        <span
                          className={`badge ms-auto ${
                            user.is_banned
                              ? "text-bg-danger"
                              : "text-bg-success"
                          }`}>
                          {user.is_banned ? "Banned" : "Active"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="admin-card">
                <div className="admin-card-header">
                  <h5 className="fw-bold mb-0">Latest Groups</h5>
                </div>

                {latestGroups.length === 0 ? (
                  <div className="admin-empty">No groups found.</div>
                ) : (
                  <div className="admin-list">
                    {latestGroups.map((group) => (
                      <div className="admin-list-row" key={group.id}>
                        <div className="admin-list-icon">
                          <i className="bi bi-collection"></i>
                        </div>

                        <div className="overflow-hidden">
                          <h6 className="mb-0 text-truncate">{group.name}</h6>
                          <small className="text-muted">
                            Admin: {group.admin?.name || "Unknown"}
                          </small>
                        </div>

                        <span className="badge text-bg-primary ms-auto">
                          {group.members_count || group.members?.length || 0}{" "}
                          members
                        </span> 
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
