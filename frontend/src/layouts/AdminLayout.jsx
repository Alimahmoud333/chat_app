import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { STORAGE_URL, DEFAULT_AVATAR } from "../constants";

export default function AdminLayout() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const avatar = user?.profile_image
    ? `${STORAGE_URL}${user.profile_image}`
    : `${DEFAULT_AVATAR}&name=${encodeURIComponent(user?.name || "Admin")}`;

  async function handleLogout() {
    await logout();

    navigate("/login");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <i className="bi bi-shield-lock-fill"></i>
          </div>

          <div>
            <h5 className="mb-0 fw-bold">Admin Panel</h5>
            <small>Chat Management</small>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }>
            <i className="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }>
            <i className="bi bi-people"></i>
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/admin/groups"
            className={({ isActive }) =>
              `admin-nav-link ${isActive ? "active" : ""}`
            }>
            <i className="bi bi-collection"></i>
            <span>Groups</span>
          </NavLink>

          <Link to="/chat" className="admin-nav-link">
            <i className="bi bi-chat-dots"></i>
            <span>Back to Chat</span>
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="d-flex align-items-center gap-2 mb-3">
            <img src={avatar} alt={user?.name} className="admin-user-avatar" />

            <div className="overflow-hidden">
              <div className="fw-semibold text-truncate">{user?.name}</div>
              <small>{user?.role}</small>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm w-100"
            onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i>
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
