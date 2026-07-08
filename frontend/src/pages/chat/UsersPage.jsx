import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import { STORAGE_URL, DEFAULT_AVATAR } from "../../constants";

export default function UsersPage() {
  const { users, getUsers, loading } = useChat();

  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
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

  return (
    <div className="chat-page">
      <div className="chat-page-header">
        <div>
          <h3 className="fw-bold mb-1">Users</h3>
          <p className="text-muted mb-0">Choose someone to message</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body">
          <div className="input-group">
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
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      )}

      <div className="row g-3">
        {filteredUsers.map((user) => (
          <div className="col-md-6 col-lg-4" key={user.id}>
            <Link
              to={`/chat/private/${user.id}`}
              className="user-card text-decoration-none">
              <div className="d-flex align-items-center gap-3">
                <div className="position-relative">
                  <img
                    src={getAvatar(user)}
                    alt={user.name}
                    className="user-card-avatar"
                  />

                  <span
                    className={`online-dot ${
                      user.is_online ? "online" : "offline"
                    }`}></span>
                </div>

                <div className="overflow-hidden">
                  <h6 className="mb-1 fw-bold text-dark text-truncate">
                    {user.name}
                  </h6>

                  <p className="mb-0 text-muted small text-truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {!loading && filteredUsers.length === 0 && (
        <div className="empty-chat-state">
          <i className="bi bi-people"></i>
          <h5>No users found</h5>
          <p>Try another search keyword.</p>
        </div>
      )}
    </div>
  );
}
