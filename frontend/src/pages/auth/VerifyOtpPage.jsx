import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";

export default function VerifyOtpPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const { verifyOtp, resendOtp } = useAuth();

  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  const [form, setForm] = useState({
    phone: location.state?.phone || "",
    otp: "",
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
      const res = await verifyOtp(form);

      showToast(res.message || "OTP verified successfully", "success");

      navigate("/chat");
    } catch (error) {
      showToast(
        error.response?.data?.message || "OTP verification failed",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!form.phone) {
      return showToast("Phone number is required", "warning");
    }

    setResending(true);

    try {
      const res = await resendOtp({
        phone: form.phone,
      });

      showToast(res.message || "OTP resent successfully", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to resend OTP",
        "danger",
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthCard
      title="Verify OTP"
      subtitle="Enter the 6-digit code sent to your phone"
      footerText="Already verified?"
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
          placeholder="Enter 6-digit OTP"
          value={form.otp}
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
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>

        <button
          type="button"
          disabled={resending}
          onClick={handleResend}
          className="btn btn-link w-100 mt-3 text-decoration-none">
          {resending ? "Resending..." : "Resend OTP"}
        </button>
      </form>
    </AuthCard>
  );
}
