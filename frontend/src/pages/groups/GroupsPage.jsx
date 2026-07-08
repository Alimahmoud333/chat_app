import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useGroup } from "../../context/GroupContext";

import CreateGroupModal from "../../components/groups/CreateGroupModal";

import { STORAGE_URL, DEFAULT_GROUP_IMAGE } from "../../constants";

export default function GroupsPage() {
  const { groups, getGroups, loading } = useGroup();

  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    getGroups().catch(() => {});
  }, []);

  const filteredGroups = useMemo(() => {
    return groups.filter((group) =>
      group.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [groups, search]);

  function getGroupImage(group) {
    if (group?.image) {
      return `${STORAGE_URL}${group.image}`;
    }

    return `${DEFAULT_GROUP_IMAGE}&name=${encodeURIComponent(
      group?.name || "Group",
    )}`;
  }

  return (
    <div className="chat-page">
      <div className="chat-page-header">
        <div>
          <h3 className="fw-bold mb-1">Groups</h3>
          <p className="text-muted mb-0">Manage and chat with your groups</p>
        </div>

        <button
          className="btn btn-primary rounded-3"
          onClick={() => setShowCreate(true)}>
          <i className="bi bi-plus-lg me-1"></i>
          Create Group
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>

            <input
              className="form-control"
              placeholder="Search groups..."
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

      {!loading && filteredGroups.length === 0 && (
        <div className="empty-chat-state">
          <i className="bi bi-collection"></i>
          <h5>No groups found</h5>
          <p>Create your first group and start chatting.</p>

          <button
            className="btn btn-primary"
            onClick={() => setShowCreate(true)}>
            Create Group
          </button>
        </div>
      )}

      <div className="row g-3">
        {filteredGroups.map((group) => (
          <div className="col-md-6 col-lg-4" key={group.id}>
            <Link
              to={`/chat/groups/${group.id}`}
              className="user-card text-decoration-none">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={getGroupImage(group)}
                  alt={group.name}
                  className="user-card-avatar"
                />

                <div className="overflow-hidden">
                  <h6 className="mb-1 fw-bold text-dark text-truncate">
                    {group.name}
                  </h6>

                  <p className="mb-0 text-muted small text-truncate">
                    {group.members_count || group.members?.length || 0} members
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
