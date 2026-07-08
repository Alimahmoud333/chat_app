import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center">
        <h1 className="fw-bold mb-3">Chat App</h1>
        <p className="text-muted mb-4">
          Real-time chat with Laravel, React, Reverb, and Firebase.
        </p>

        <div className="d-flex gap-3 justify-content-center">
          <Link to="/login" className="btn btn-primary px-4">
            Login
          </Link>

          <Link to="/register" className="btn btn-outline-primary px-4">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
