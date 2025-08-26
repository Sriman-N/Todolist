import { useState, useEffect } from "react";

const Login = ({ onLogin, prefilledUsername }) => {
  const [username, setUsername] = useState(prefilledUsername || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // keep input in sync with prefilledUsername updates
  useEffect(() => {
    setUsername(prefilledUsername || "");
  }, [prefilledUsername]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent double submit
    setErr("");

    const u = username.trim();
    const p = password.trim();
    if (!u || !p) {
      setErr("Username and password are required.");
      return;
    }

    try {
      setLoading(true);
      await onLogin({ username: u, password: p });
    } catch (e) {
      // in case parent throws
      setErr(e?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="loginForm">
      <h2>Login</h2>

      {err && (
        <div
          className="loginError"
          role="alert"
          style={{ color: "tomato", marginBottom: 8 }}
        >
          {err}
        </div>
      )}

      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="loginInput"
        autoFocus
        autoComplete="username"
      />

      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="loginInput"
        autoComplete="current-password"
      />

      <button type="submit" className="loginBtn" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
