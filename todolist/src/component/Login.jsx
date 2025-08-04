import { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Username and password are required");
      return;
    }

    onLogin({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="loginForm">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="loginInput"
      />
      <input
        type="text"
        placeholder="Password"
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
