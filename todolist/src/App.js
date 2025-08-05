import { useState } from "react";
import Header from "./component/Header";
import Main from "./component/Main";
import Footer from "./component/Footer";
import Login from "./component/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState({
    numItems: 0,
    numCompleted: 0,
    percentage: 0,
  });

  // Just a simple function now
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
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (err) {
      alert("Server error. Please try again later.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="appWrapper">
      {isLoggedIn ? (
        <>
          <Header />
          <Main setStats={setStats} />
          <Footer
            numItems={stats.numItems}
            numCompleted={stats.numCompleted}
            percentage={stats.percentage}
          />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
