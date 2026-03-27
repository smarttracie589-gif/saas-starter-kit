"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're in! 🎉");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className="waitlist-section" id="waitlist">
      <div className="waitlist-card">
        <div className="waitlist-badge"><Icon name="zap" size={16} /> Early Access</div>
        <h3 className="waitlist-title">
          Get <span className="gradient-text">Early Access</span>
        </h3>
        <p className="waitlist-description">
          Join the waitlist to get notified when new features launch.
          Early members get <strong>lifetime pricing</strong>.
        </p>

        {status === "success" ? (
          <div className="waitlist-success">
            <span className="waitlist-success-icon">✓</span>
            <p>{message}</p>
          </div>
        ) : (
          <form className="waitlist-form" onSubmit={handleSubmit}>
            <div className="waitlist-input-group">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="waitlist-input"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                className="btn btn-primary waitlist-btn"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Joining..." : "Join Waitlist →"}
              </button>
            </div>
            {status === "error" && (
              <p className="waitlist-error">{message}</p>
            )}
            <p className="waitlist-note">
              No spam. We&apos;ll only email you about launches.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
