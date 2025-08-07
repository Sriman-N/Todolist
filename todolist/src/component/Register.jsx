import { useState } from "react";

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Username and password are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Registration successful");
        onRegister({ username, password });
      } else {
        alert("Registration Failed: " + data.message);
      }
    } catch (err) {
      alert("Server error. Please try again later.");
      console.error("REgistration error: ", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="loginForm">
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Choose a username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="loginInput"
      />
      <input
        type="text"
        placeholder="Choose a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="loginInput"
      />
      <button type="submit" className="loginBtn">
        Register
      </button>
    </form>
  );
};

export default Register;
