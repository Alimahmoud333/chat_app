import { useAuth } from "../../context/AuthContext";
import { useGroup } from "../../context/GroupContext";
import { useToast } from "../../context/ToastContext";

import { STORAGE_URL, DEFAULT_AVATAR } from "../../constants";

export default function GroupMembersModal({ group, onClose }) {
  const { user } = useAuth();

  const { removeMember } = useGroup();

  const { showToast } = useToast();

  const members = group?.members || [];

  const isAdmin = members.some(
    (member) =>
      Number(member.id) === Number(user?.id) && Boolean(member.pivot?.is_admin),
  );

  function getAvatar(member) {
    if (member?.profile_image) {
      return `${STORAGE_URL}${member.profile_image}`;
    }

    return `${DEFAULT_AVATAR}&name=${encodeURIComponent(
      member?.name || "User",
    )}`;
  }

  async function handleRemove(memberId) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this member?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const res = await removeMember(group.id, memberId);

      showToast(res.message || "Member removed successfully", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to remove member",
        "danger",
      );
    }
  }

  return (
    <div
      className="modal fade show d-block group-members-modal-backdrop"
      tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold mb-1">Group Members</h5>

              <p className="text-muted small mb-0">
                {members.length} {members.length === 1 ? "member" : "members"}
              </p>
            </div>

            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body pt-3">
            {members.length === 0 && (
              <div className="text-center text-muted py-4">
                <i className="bi bi-people fs-1"></i>
                <p className="mt-2 mb-0">No members found</p>
              </div>
            )}

            <div className="group-members-list">
              {members.map((member) => {
                const isMe = Number(member.id) === Number(user?.id);

                const memberIsAdmin = Boolean(member.pivot?.is_admin);

                return (
                  <div key={member.id} className="group-member-list-item">
                    <img
                      src={getAvatar(member)}
                      alt={member.name}
                      className="group-member-avatar"
                    />

                    <div className="group-member-info">
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="mb-0 fw-semibold text-truncate">
                          {member.name}
                        </h6>

                        {isMe && (
                          <span className="badge rounded-pill text-bg-light border">
                            You
                          </span>
                        )}
                      </div>

                      <p className="mb-0 text-muted small text-truncate">
                        {member.email}
                      </p>
                    </div>

                    <div className="group-member-actions">
                      {memberIsAdmin && (
                        <span className="badge rounded-pill text-bg-primary">
                          Admin
                        </span>
                      )}

                      {isAdmin && !memberIsAdmin && !isMe && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm rounded-pill"
                          onClick={() => handleRemove(member.id)}>
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-light rounded-3 px-4" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </div>
  );
}
