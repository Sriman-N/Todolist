import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Settings({ username, onLogout }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const changePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");
      setMsg("Password updated ✅");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("This will delete your account and todos. Continue?"))
      return;
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${API_BASE}/delete-account`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: oldPassword }), // reuse oldPassword field for confirmation
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete account");
      setMsg("Account deleted 🗑️");
      onLogout();
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "24px auto" }}>
      <h2>Account Settings</h2>
      <p>
        <strong>User:</strong> {username}
      </p>

      <form onSubmit={changePassword} style={{ display: "grid", gap: 8 }}>
        <label>
          Current password
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </label>
        <label>
          New password
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Change Password"}
        </button>
      </form>

      <hr style={{ margin: "16px 0" }} />

      <button
        onClick={deleteAccount}
        disabled={loading || !oldPassword}
        style={{
          background: "#b00020",
          color: "white",
          padding: "8px 12px",
          border: 0,
          borderRadius: 6,
        }}
        title="Enter your current password above, then click to delete"
      >
        {loading ? "Working..." : "Delete Account"}
      </button>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
