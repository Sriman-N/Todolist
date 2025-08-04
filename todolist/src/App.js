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

  const handleLogin = ({ username, password }) => {
    console.log("Logging in: ", username, password);
    setIsLoggedIn(true);
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
