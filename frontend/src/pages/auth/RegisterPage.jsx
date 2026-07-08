import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";

export default function RegisterPage() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    password: "",
    password_confirmation: "",
    profile_image: null,
  });

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "profile_image") {
      const file = files[0];

      setForm({
        ...form,
        profile_image: file,
      });

      if (file) {
        setPreview(URL.createObjectURL(file));
      }

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
      data.append("email", form.email);
      data.append("phone", form.phone);
      data.append("bio", form.bio);
      data.append("password", form.password);
      data.append("password_confirmation", form.password_confirmation);

      if (form.profile_image) {
        data.append("profile_image", form.profile_image);
      }

      const res = await register(data);

      showToast(
        res.message || "Registered successfully. Verify OTP.",
        "success",
      );

      navigate("/verify-otp", {
        state: {
          phone: form.phone,
        },
      });
    } catch (error) {
      const errors = error.response?.data?.errors;

      if (errors) {
        const firstError = Object.values(errors)[0][0];
        showToast(firstError, "danger");
      } else {
        showToast(error.response?.data?.message || "Register failed", "danger");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Create Account"
      subtitle="Join the chat app and start messaging"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Login">
      <form onSubmit={handleSubmit}>
        <div className="text-center mb-3">
          <label className="profile-upload">
            {preview ? (
              <img src={preview} alt="Profile Preview" />
            ) : (
              <i className="bi bi-person-plus"></i>
            )}

            <input
              type="file"
              name="profile_image"
              accept="image/*"
              onChange={handleChange}
              hidden
            />
          </label>

          <div className="small text-muted mt-2">Optional profile image</div>
        </div>

        <AuthInput
          label="Name"
          name="name"
          icon="bi-person"
          placeholder="Enter your name"
          value={form.name}
          onChange={handleChange}
          required
        />

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
          label="Phone"
          name="phone"
          icon="bi-phone"
          placeholder="+96170123456"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <div className="mb-3">
          <label className="form-label fw-semibold">Bio</label>

          <textarea
            name="bio"
            className="form-control"
            rows="3"
            placeholder="Write something about yourself"
            value={form.bio}
            onChange={handleChange}
          />
        </div>

        <AuthInput
          label="Password"
          name="password"
          type="password"
          icon="bi-lock"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <AuthInput
          label="Confirm Password"
          name="password_confirmation"
          type="password"
          icon="bi-shield-lock"
          placeholder="Confirm password"
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
              Creating account...
            </>
          ) : (
            "Register"
          )}
        </button>
      </form>
    </AuthCard>
  );
}
