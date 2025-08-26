import { useState, useEffect } from "react";
import Header from "./component/Header";
import Main from "./component/Main";
import Footer from "./component/Footer";
import Login from "./component/Login";
import Register from "./component/Register";

// You can override this with REACT_APP_API_BASE in your frontend .env if you want
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [prefilledUsername, setPrefilledUsername] = useState("");

  const [stats, setStats] = useState({
    numItems: 0,
    numCompleted: 0,
    percentage: 0,
  });

  // Restore session on refresh (if username was saved)
  useEffect(() => {
    const saved = localStorage.getItem("username");
    if (saved) {
      setUsername(saved);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    localStorage.removeItem("username");
  };

  // --- NEW: fully-implemented change password ---
  const handleChangePassword = async () => {
    if (!username) return alert("You must be logged in.");
    const oldPassword = window.prompt("Enter your current password:");
    if (oldPassword === null) return; // cancel
    const newPassword = window.prompt("Enter your new password (min 6 chars):");
    if (newPassword === null) return;
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }
    const confirmNew = window.prompt("Confirm your new password:");
    if (confirmNew === null) return;
    if (confirmNew !== newPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");

      alert("Password updated successfully. Please log in again.");
      handleLogout(); // safety: invalidate local session after password change
    } catch (err) {
      console.error("Change password error:", err);
      alert(err.message || "Server error changing password.");
    }
  };

  // --- NEW: fully-implemented delete account ---
  const handleDeleteAccount = async () => {
    if (!username) return alert("You must be logged in.");
    const ok = window.confirm(
      "This will permanently delete your account and todos. Continue?"
    );
    if (!ok) return;

    const pwd = window.prompt("Confirm your current password to delete:");
    if (pwd === null) return;

    try {
      const res = await fetch(`${API_BASE}/delete-account`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: pwd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete account");

      alert("Your account was deleted.");
      handleLogout();
    } catch (err) {
      console.error("Delete account error:", err);
      alert(err.message || "Server error deleting account.");
    }
  };

  const handleLogin = async ({ username, password }) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Login successful!");
        setIsLoggedIn(true);
        setUsername(username);
        localStorage.setItem("username", username); // persist session
      } else {
        alert("Login failed: " + (data.message || res.statusText));
      }
    } catch (err) {
      alert("Server error. Please try again later.");
      console.error("Login error:", err);
    }
  };

  const handleRegister = async ({ username, password }) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Registration successful! You can now log in.");
        setPrefilledUsername(username); // prefill on Login screen
        setShowRegister(false); // switch to Login
      } else {
        alert("Registration failed: " + (data.message || res.statusText));
      }
    } catch (err) {
      alert("Server error during registration. Try again later.");
      console.error("Register error:", err);
    }
  };

  return (
    <div className="appWrapper">
      {isLoggedIn ? (
        <>
          <Header
            username={username}
            onLogout={handleLogout}
            onChangePassword={handleChangePassword}
            onDeleteAccount={handleDeleteAccount}
          />
          {/* Pass username so Main loads/saves this user's todos */}
          <Main username={username} setStats={setStats} />
          <Footer
            numItems={stats.numItems}
            numCompleted={stats.numCompleted}
            percentage={stats.percentage}
          />
        </>
      ) : showRegister ? (
        <>
          <Register onRegister={handleRegister} />
          <p style={{ textAlign: "center" }}>
            Already have an account?{" "}
            <button onClick={() => setShowRegister(false)}>Login</button>
          </p>
        </>
      ) : (
        <>
          <Login onLogin={handleLogin} prefilledUsername={prefilledUsername} />
          <p style={{ textAlign: "center" }}>
            Don't have an account?{" "}
            <button onClick={() => setShowRegister(true)}>Register</button>
          </p>
        </>
      )}
    </div>
  );
}

export default App;
