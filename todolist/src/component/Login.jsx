import { useState, useEffect } from "react";

const Login = ({ onLogin, prefilledUsername }) => {
  const [username, setUsername] = useState(prefilledUsername || "");
  const [password, setPassword] = useState("");

  // Optional: if prefilledUsername changes later, update the input
  useEffect(() => {
    setUsername(prefilledUsername || "");
  }, [prefilledUsername]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Username and password are required");
      return;
    }
    await onLogin({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="loginForm">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="loginInput"
        autoFocus // 👈 focus when login form shows
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="loginInput"
      />
      <button type="submit" className="loginBtn">
        Login
      </button>
    </form>
  );
};

export default Login;
