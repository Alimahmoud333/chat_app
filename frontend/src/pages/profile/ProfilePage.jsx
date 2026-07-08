import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import { STORAGE_URL, DEFAULT_AVATAR } from "../../constants";

export default function ProfilePage() {
  const { user, updateProfile, getProfile } = useAuth();

  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    bio: "",
    profile_image: null,
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        profile_image: null,
      });
    }
  }, [user]);

  const avatar = preview
    ? preview
    : user?.profile_image
      ? `${STORAGE_URL}${user.profile_image}`
      : `${DEFAULT_AVATAR}&name=${encodeURIComponent(user?.name || "User")}`;

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "profile_image") {
      const file = files[0];

      if (!file) {
        return;
      }

      setForm({
        ...form,
        profile_image: file,
      });

      setPreview(URL.createObjectURL(file));

      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("phone", form.phone);
      data.append("bio", form.bio || "");

      if (form.profile_image) {
        data.append("profile_image", form.profile_image);
      }

      const res = await updateProfile(data);

      showToast(res.message || "Profile updated successfully", "success");

      setPreview(null);

      await getProfile();
    } catch (error) {
      const errors = error.response?.data?.errors;

      if (errors) {
        const firstError = Object.values(errors)[0][0];

        showToast(firstError, "danger");
      } else {
        showToast(
          error.response?.data?.message || "Failed to update profile",
          "danger",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-header-card">
        <div className="profile-cover"></div>

        <div className="profile-header-content">
          <div className="profile-avatar-wrapper">
            <img src={avatar} alt={user?.name} className="profile-avatar" />

            <label className="profile-avatar-edit">
              <i className="bi bi-camera-fill"></i>

              <input
                type="file"
                name="profile_image"
                accept="image/*"
                onChange={handleChange}
                hidden
              />
            </label>
          </div>

          <div>
            <h3 className="fw-bold mb-1">{user?.name}</h3>

            <p className="text-muted mb-2">{user?.email}</p>

            <div className="d-flex flex-wrap gap-2">
              <span className="badge rounded-pill text-bg-primary">
                {user?.role}
              </span>

              {user?.phone_verified_at ? (
                <span className="badge rounded-pill text-bg-success">
                  Phone Verified
                </span>
              ) : (
                <span className="badge rounded-pill text-bg-warning">
                  Phone Not Verified
                </span>
              )}

              {user?.is_online && (
                <span className="badge rounded-pill text-bg-success">
                  Online
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="mb-4">
                <h5 className="fw-bold mb-1">Edit Profile</h5>
                <p className="text-muted mb-0">
                  Update your personal information.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Name</label>

                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-person"></i>
                      </span>

                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone</label>

                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="bi bi-phone"></i>
                      </span>

                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        placeholder="+96170123456"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <small className="text-muted">
                      If you change your phone, backend may require verification
                      again.
                    </small>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Bio</label>

                    <textarea
                      name="bio"
                      rows="4"
                      className="form-control"
                      placeholder="Write something about yourself..."
                      value={form.bio}
                      onChange={handleChange}></textarea>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Profile Image
                    </label>

                    <input
                      type="file"
                      name="profile_image"
                      accept="image/*"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => {
                      setPreview(null);

                      setForm({
                        name: user?.name || "",
                        phone: user?.phone || "",
                        bio: user?.bio || "",
                        profile_image: null,
                      });
                    }}>
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary px-4">
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-1"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Account Info</h5>

              <div className="profile-info-item">
                <span>Email</span>
                <strong>{user?.email}</strong>
              </div>

              <div className="profile-info-item">
                <span>Phone</span>
                <strong>{user?.phone || "Not added"}</strong>
              </div>

              <div className="profile-info-item">
                <span>Role</span>
                <strong className="text-capitalize">{user?.role}</strong>
              </div>

              <div className="profile-info-item">
                <span>Status</span>
                <strong className={user?.is_online ? "text-success" : ""}>
                  {user?.is_online ? "Online" : "Offline"}
                </strong>
              </div>

              <div className="profile-info-item">
                <span>Joined</span>
                <strong>
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "N/A"}
                </strong>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Security</h5>

              <p className="text-muted small">
                You can change your password from the security page.
              </p>

              <a
                href="/change-password"
                className="btn btn-outline-primary w-100">
                <i className="bi bi-shield-lock me-1"></i>
                Change Password
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
