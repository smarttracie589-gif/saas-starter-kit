"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Icon from "@/components/Icon";

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", url: "" });
  const [adding, setAdding] = useState(false);
  const [checking, setChecking] = useState(null);
  const [plan, setPlan] = useState("free");
  const [maxMonitors, setMaxMonitors] = useState(1);
  const [currentCount, setCurrentCount] = useState(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      setCheckoutSuccess(true);
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [searchParams]);

  useEffect(() => {
    if (session) fetchMonitors();
  }, [session]);

  async function fetchMonitors() {
    try {
      const res = await fetch("/api/monitors");
      if (res.ok) {
        const data = await res.json();
        setMonitors(data.monitors);
        setPlan(data.plan || "free");
        setMaxMonitors(data.maxMonitors || 1);
        setCurrentCount(data.currentCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch monitors:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpgrade() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("Checkout temporarily unavailable. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch("/api/monitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ name: "", url: "" });
        setShowAddForm(false);
        fetchMonitors();
      }
    } catch (err) {
      console.error("Failed to add monitor:", err);
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to remove this monitor?")) return;
    try {
      await fetch(`/api/monitors/${id}`, { method: "DELETE" });
      fetchMonitors();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }

  async function handleCheck(id) {
    setChecking(id);
    try {
      const res = await fetch(`/api/monitors/${id}/check`, { method: "POST" });
      const data = await res.json();
      if (data.changes && data.changes.length > 0) {
        alert(`⚠️ Detected ${data.changes.length} change(s)!\n\n` +
          data.changes.map(c => `${c.field}: "${c.old_value}" → "${c.new_value}"`).join("\n"));
      } else {
        alert("✅ No changes detected. Everything looks good!");
      }
      fetchMonitors();
    } catch (err) {
      console.error("Check failed:", err);
      alert("Failed to check monitor. Please try again.");
    } finally {
      setChecking(null);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!session) return null;

  const atLimit = currentCount >= maxMonitors;
  const isFree = plan === "free";

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <a href="/" className="dashboard-logo"><Icon name="zap" size={20} /> SaaS Starter</a>
          <span className="dashboard-badge">Dashboard</span>
          <span className={`plan-badge ${isFree ? "plan-free" : "plan-founding"}`}>
            {isFree ? "Free" : "⚡ Pro"}
          </span>
        </div>
        <div className="dashboard-header-right">
          <span className="dashboard-user">{session.user?.email}</span>
          <button onClick={() => router.push("/")} className="btn btn-secondary">
            Home
          </button>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="btn btn-danger btn-sm">
            Sign Out
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {checkoutSuccess && (
          <div className="checkout-success-banner">
            <Icon name="zap" size={20} />
            <div>
              <strong>Welcome to Pro! 🎉</strong>
              <p>Your subscription is being activated. You can now add up to {maxMonitors} monitors.</p>
            </div>
          </div>
        )}

        <div className="dashboard-top">
          <div>
            <h1>Your Monitors</h1>
            <p className="dashboard-subtitle">
              Track and monitor your data sources
              <span className="profile-counter">
                {" "}— {currentCount}/{maxMonitors} monitors used
              </span>
            </p>
          </div>
          <div className="dashboard-top-actions">
            {isFree && (
              <button onClick={handleUpgrade} className="btn btn-upgrade" disabled={checkoutLoading}>
                {checkoutLoading ? "Loading..." : "⚡ Upgrade to Pro"}
              </button>
            )}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-primary"
              disabled={atLimit && isFree}
            >
              {showAddForm ? "Cancel" : "+ Add Monitor"}
            </button>
          </div>
        </div>

        {atLimit && isFree && (
          <div className="upgrade-banner">
            <Icon name="lock" size={18} />
            <span>You&apos;ve reached the free plan limit ({maxMonitors} monitor). Upgrade to Pro for up to 10 monitors.</span>
            <button onClick={handleUpgrade} className="btn btn-primary btn-sm" disabled={checkoutLoading}>
              {checkoutLoading ? "Loading..." : "Upgrade Now →"}
            </button>
          </div>
        )}

        {showAddForm && (
          <div className="add-profile-card">
            <h3>Add a Monitor</h3>
            <form onSubmit={handleAdd} className="add-profile-form">
              <input
                type="text"
                placeholder="Monitor Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="login-input"
                required
              />
              <input
                type="url"
                placeholder="URL to monitor (e.g. https://example.com)"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="login-input"
              />
              <button type="submit" className="btn btn-primary" disabled={adding}>
                {adding ? "Adding..." : "Add Monitor"}
              </button>
            </form>
          </div>
        )}

        {monitors.length === 0 ? (
          <div className="dashboard-empty">
            <div className="dashboard-empty-icon"><Icon name="search" size={48} /></div>
            <h2>No monitors yet</h2>
            <p>Add your first monitor to start tracking changes.</p>
            <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
              + Add Your First Monitor
            </button>
          </div>
        ) : (
          <div className="profiles-grid">
            {monitors.map((monitor) => (
              <div key={monitor.id} className="profile-card">
                <div className="profile-card-header">
                  <div className="profile-status-dot" data-status={monitor.status}></div>
                  <h3>{monitor.name}</h3>
                </div>
                {monitor.url && (
                  <p className="profile-detail"><Icon name="globe" size={14} /> {monitor.url}</p>
                )}
                <p className="profile-checked">
                  {monitor.last_checked_at
                    ? `Last checked: ${new Date(monitor.last_checked_at).toLocaleString()}`
                    : "Not checked yet"}
                </p>
                <div className="profile-actions">
                  <button
                    onClick={() => handleCheck(monitor.id)}
                    className="btn btn-primary btn-sm"
                    disabled={checking === monitor.id}
                  >
                    {checking === monitor.id ? "Checking..." : <><Icon name="search" size={14} /> Check Now</>}
                  </button>
                  <button
                    onClick={() => handleDelete(monitor.id)}
                    className="btn btn-danger btn-sm"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
