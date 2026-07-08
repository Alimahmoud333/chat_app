import { Link } from "react-router-dom";

export default function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLinkText,
}) {
  return (
    <div className="auth-page min-vh-100 d-flex align-items-center justify-content-center px-3">
      <div className="auth-card card border-0 shadow-lg rounded-4">
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="auth-logo mx-auto mb-3">
              <i className="bi bi-chat-dots-fill"></i>
            </div>

            <h3 className="fw-bold mb-1">{title}</h3>

            {subtitle && (
              <p className="text-muted mb-0">
                {subtitle}
              </p>
            )}
          </div>

          {children}

          {footerText && footerLink && (
            <div className="text-center mt-4">
              <span className="text-muted">{footerText}</span>{" "}
              <Link to={footerLink} className="fw-semibold text-decoration-none">
                {footerLinkText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}