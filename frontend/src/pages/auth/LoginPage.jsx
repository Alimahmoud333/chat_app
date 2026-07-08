import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";

export default function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const res = await login(form);

      showToast(res.message || "Logged in successfully", "success");

      if (res.user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/chat");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Login failed", "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Login to continue chatting"
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkText="Create account">
      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Email"
          name="email"
          type="email"
          icon="bi-envelope"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <AuthInput
          label="Password"
          name="password"
          type="password"
          icon="bi-lock"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <div className="d-flex justify-content-end mb-3">
          <Link
            to="/forgot-password"
            className="text-decoration-none small fw-semibold">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100 py-2 fw-semibold rounded-3">
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </AuthCard>
  );
}
