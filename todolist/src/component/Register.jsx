import { useState } from "react";

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!username.trim() || !password.trim()) {
      alert("Username and password are required");
      return;
    }
    try {
      setIsSubmitting(true);
      await onRegister?.({ username, password }); // parent does the POST
    } finally {
      setIsSubmitting(false);
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
        type="password"
        placeholder="Choose a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="loginInput"
      />
      <button type="submit" className="loginBtn" disabled={isSubmitting}>
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
