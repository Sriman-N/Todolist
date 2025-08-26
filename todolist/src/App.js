import { useState } from "react";
import Header from "./component/Header";
import Main from "./component/Main";
import Footer from "./component/Footer";
import Login from "./component/Login";
import Register from "./component/Register";

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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
  };

  const handleChangePassword = () => {
    alert("Change password feature coming soon");
  };

  const handleDeleteAccount = () => {
    alert("delete/reset account feature coming soon");
  };

  const handleLogin = async ({ username, password }) => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Login successful!");
        setIsLoggedIn(true);
        setUsername(username);
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (err) {
      alert("Server error. Please try again later.");
      console.error("Login error:", err);
    }
  };

  const handleRegister = async ({ username, password }) => {
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Registration successful! You can now log in.");
        setPrefilledUsername(username);
        setShowRegister(false);
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
