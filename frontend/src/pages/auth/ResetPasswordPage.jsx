import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const { resetPassword } = useAuth();

  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    phone: location.state?.phone || "",
    otp: "",
    password: "",
    password_confirmation: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await resetPassword(form);

      showToast(res.message || "Password reset successfully", "success");

      navigate("/login");
    } catch (error) {
      const errors = error.response?.data?.errors;

      if (errors) {
        const firstError = Object.values(errors)[0][0];
        showToast(firstError, "danger");
      } else {
        showToast(
          error.response?.data?.message || "Password reset failed",
          "danger",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Verify OTP and create a new password"
      footerText="Back to"
      footerLink="/login"
      footerLinkText="Login">
      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Phone"
          name="phone"
          icon="bi-phone"
          placeholder="+96170123456"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <AuthInput
          label="OTP Code"
          name="otp"
          icon="bi-key"
          placeholder="Enter OTP"
          value={form.otp}
          onChange={handleChange}
          required
        />

        <AuthInput
          label="New Password"
          name="password"
          type="password"
          icon="bi-lock"
          placeholder="Enter new password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <AuthInput
          label="Confirm Password"
          name="password_confirmation"
          type="password"
          icon="bi-shield-lock"
          placeholder="Confirm new password"
          value={form.password_confirmation}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100 py-2 fw-semibold rounded-3">
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </AuthCard>
  );
}
