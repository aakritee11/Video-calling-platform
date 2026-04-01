import { useState } from "react";

function LockIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "At least 6 characters.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1800); // replace with your actual auth call
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-icon-wrap">
          <div className="auth-icon">
            <LockIcon />
          </div>
        </div>

        <h1 className="auth-title">Sign in</h1>

        <div className="auth-field">
          <label className="auth-label" htmlFor="email">
            Email Address *
          </label>
          <input
            id="email"
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.email && <div className="error-msg">{errors.email}</div>}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="password">
            Password *
          </label>
          <div className="password-wrapper">
            <input
              id="password"
              className="auth-input"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{ paddingRight: "44px" }}
            />
            <button
              className="toggle-pw"
              onClick={() => setShowPw((v) => !v)}
              type="button"
              aria-label="Toggle password visibility"
            >
              <EyeIcon open={showPw} />
            </button>
          </div>
          {errors.password && <div className="error-msg">{errors.password}</div>}
        </div>

        <div className="auth-row">
          <input
            type="checkbox"
            id="remember"
            className="auth-checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label htmlFor="remember" className="auth-checkbox-label">
            Remember me
          </label>
        </div>

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "SIGNING IN…" : "SIGN IN"}
        </button>

        <div className="auth-links">
          <a href="#" className="auth-link">
            Forgot password?
          </a>
          <a href="#" className="auth-link">
            Don't have an account? Sign Up
          </a>
        </div>

        <div className="auth-footer">
          Copyright © <a href="#">Video Calls</a> 2026.
        </div>
      </div>
    </div>
  );
}