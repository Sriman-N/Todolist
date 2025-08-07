import { useState } from "react";

const Header = ({ username, onLogout, onChangePassword, onDeleteAccount }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="headerWrapper">
      <h1>Welcome to Your Todolist, {username}! </h1>

      <div className="dropdownWrapper">
        <button onClick={() => setShowMenu(!showMenu)} className="menuButton">
          ☰
        </button>

        {showMenu && (
          <div className="dropdownMenu">
            <button onClick={onChangePassword}>Change Password</button>
            <button onClick={onDeleteAccount}>Delete Account</button>
            <button onClick={onLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
