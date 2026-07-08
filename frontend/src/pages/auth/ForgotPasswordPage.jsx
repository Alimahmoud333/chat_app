import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const { forgotPassword } = useAuth();

  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await forgotPassword({
        phone,
      });

      showToast(res.message || "OTP sent successfully", "success");

      navigate("/reset-password", {
        state: {
          phone,
        },
      });
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to send OTP",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Enter your phone number to receive OTP"
      footerText="Remember your password?"
      footerLink="/login"
      footerLinkText="Login">
      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Phone"
          name="phone"
          icon="bi-phone"
          placeholder="+96170123456"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100 py-2 fw-semibold rounded-3">
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Sending OTP...
            </>
          ) : (
            "Send OTP"
          )}
        </button>
      </form>
    </AuthCard>
  );
}
