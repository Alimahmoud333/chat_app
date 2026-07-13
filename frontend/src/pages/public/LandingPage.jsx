import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="landing-navbar">
        <div className="landing-logo">
          <div className="landing-logo-icon">
            <i className="bi bi-chat-dots-fill"></i>
          </div>

          <span>Chat App</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link to="/login" className="btn btn-light rounded-3 px-4">
            Login
          </Link>

          <Link to="/register" className="btn btn-primary rounded-3 px-4">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="landing-hero">
        <div className="landing-hero-content">
          <span className="landing-badge">
            <i className="bi bi-lightning-charge-fill me-1"></i>
            Real-time messaging platform
          </span>

          <h1>Connect instantly with secure real-time chat.</h1>

          <p>
            A modern full-stack chat application built with Laravel, React,
            Reverb, Sanctum, Firebase notifications, group messaging, and admin
            management.
          </p>

          <div className="landing-actions">
            <Link
              to="/register"
              className="btn btn-primary btn-lg rounded-4 px-5">
              Create Account
            </Link>

            <Link
              to="/login"
              className="btn btn-outline-light btn-lg rounded-4 px-5">
              Login
            </Link>
          </div>

          <div className="landing-stats">
            <div>
              <strong>Real-time</strong>
              <span>Private & group chat</span>
            </div>

            <div>
              <strong>Secure</strong>
              <span>Sanctum authentication</span>
            </div>

            <div>
              <strong>Smart</strong>
              <span>AI chat support</span>
            </div>
          </div>
        </div>

        <div className="landing-preview">
          <div className="chat-preview-card">
            <div className="chat-preview-header">
              <div className="d-flex align-items-center gap-2">
                <div className="preview-avatar">
                  <i className="bi bi-person-fill"></i>
                </div>

                <div>
                  <h6 className="mb-0">Ali Mahmoud</h6>
                  <small>Online</small>
                </div>
              </div>

              <i className="bi bi-three-dots-vertical"></i>
            </div>

            <div className="chat-preview-body">
              <div className="preview-message theirs">
                Hello, did you finish the Laravel API?
              </div>

              <div className="preview-message mine">
                Yes, authentication, real-time chat, and notifications are
                ready.
              </div>

              <div className="preview-message theirs">
                Great. Let’s test the group chat now.
              </div>

              <div className="preview-message mine small-message">
                <i className="bi bi-check2-all me-1"></i>
                Delivered
              </div>
            </div>

            <div className="chat-preview-input">
              <span>Type a message...</span>
              <button>
                <i className="bi bi-send-fill"></i>
              </button>
            </div>
          </div>

          <div className="floating-card notification-card">
            <i className="bi bi-bell-fill"></i>
            <div>
              <strong>New Message</strong>
              <span>Firebase notification received</span>
            </div>
          </div>

          <div className="floating-card admin-card-mini">
            <i className="bi bi-shield-lock-fill"></i>
            <div>
              <strong>Admin Panel</strong>
              <span>Users and groups management</span>
            </div>
          </div>
        </div>
      </main>

      <section className="landing-features">
        <div className="landing-section-title">
          <span>Features</span>
          <h2>Everything needed for a modern chat system</h2>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <i className="bi bi-chat-left-text-fill"></i>
            <h5>Private Chat</h5>
            <p>
              Send real-time private messages with media, reactions, typing,
              seen, and delivered status.
            </p>
          </div>

          <div className="feature-card">
            <i className="bi bi-collection-fill"></i>
            <h5>Group Chat</h5>
            <p>
              Create groups, add members, manage admins, and send real-time
              group messages.
            </p>
          </div>

          <div className="feature-card">
            <i className="bi bi-bell-fill"></i>
            <h5>Notifications</h5>
            <p>
              Browser notifications using Firebase Cloud Messaging for incoming
              messages.
            </p>
          </div>

          <div className="feature-card">
            <i className="bi bi-shield-check"></i>
            <h5>Secure Access</h5>
            <p>
              Laravel Sanctum authentication with protected routes and
              role-based admin access.
            </p>
          </div>

          <div className="feature-card">
            <i className="bi bi-robot"></i>
            <h5>AI Chat</h5>
            <p>
              Integrated AI chat page connected to the backend OpenAI endpoint.
            </p>
          </div>

          <div className="feature-card">
            <i className="bi bi-speedometer2"></i>
            <h5>Admin Dashboard</h5>
            <p>
              Manage users, groups, banned users, statistics, and system data
              from one panel.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
