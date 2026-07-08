import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const { changePassword } = useAuth();

  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function togglePassword(field) {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.new_password !== form.new_password_confirmation) {
      return showToast("New password confirmation does not match", "warning");
    }

    setLoading(true);

    try {
      const res = await changePassword(form);

      showToast(res.message || "Password changed successfully", "success");

      setForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });

      navigate("/profile");
    } catch (error) {
      const errors = error.response?.data?.errors;

      if (errors) {
        const firstError = Object.values(errors)[0][0];

        showToast(firstError, "danger");
      } else {
        showToast(
          error.response?.data?.message || "Failed to change password",
          "danger",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Change Password</h3>
          <p className="text-muted mb-0">
            Update your account password securely.
          </p>
        </div>

        <Link to="/profile" className="btn btn-light rounded-3">
          <i className="bi bi-arrow-left me-1"></i>
          Back
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-7 col-xl-6">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4 p-md-5">
              <div className="security-icon mx-auto mb-4">
                <i className="bi bi-shield-lock-fill"></i>
              </div>

              <div className="text-center mb-4">
                <h4 className="fw-bold mb-1">Security Settings</h4>
                <p className="text-muted mb-0">
                  Use a strong password to protect your account.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Current Password
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-lock"></i>
                    </span>

                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="current_password"
                      className="form-control"
                      placeholder="Enter current password"
                      value={form.current_password}
                      onChange={handleChange}
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => togglePassword("current")}>
                      <i
                        className={`bi ${
                          showPasswords.current ? "bi-eye-slash" : "bi-eye"
                        }`}></i>
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">New Password</label>

                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-shield-lock"></i>
                    </span>

                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="new_password"
                      className="form-control"
                      placeholder="Enter new password"
                      value={form.new_password}
                      onChange={handleChange}
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => togglePassword("new")}>
                      <i
                        className={`bi ${
                          showPasswords.new ? "bi-eye-slash" : "bi-eye"
                        }`}></i>
                    </button>
                  </div>

                  <small className="text-muted">
                    Password should be at least 6 characters.
                  </small>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Confirm New Password
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-check2-circle"></i>
                    </span>

                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="new_password_confirmation"
                      className="form-control"
                      placeholder="Confirm new password"
                      value={form.new_password_confirmation}
                      onChange={handleChange}
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => togglePassword("confirm")}>
                      <i
                        className={`bi ${
                          showPasswords.confirm ? "bi-eye-slash" : "bi-eye"
                        }`}></i>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-100 py-2 fw-semibold rounded-3">
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-1"></i>
                      Change Password
                    </>
                  )}
                </button>
              </form>

              <div className="alert alert-light border mt-4 mb-0">
                <div className="d-flex gap-2">
                  <i className="bi bi-info-circle text-primary"></i>

                  <small className="text-muted">
                    After changing your password, keep it private and do not
                    share it with anyone.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
