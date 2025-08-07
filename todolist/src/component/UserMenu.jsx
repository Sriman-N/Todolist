import { useState } from "react";

const UserMenu = ({
  onLogout,
  onChangePassword,
  onDeleteAccount,
  username,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <div className="userMenu">
      <button onClick={toggleMenu} className="menuButton">
        ☰ {username}
      </button>
      {showMenu && (
        <div className="menuDropdown">
          <button onClick={onChangePassword}>Change Password</button>
          <button onClick={onDeleteAccount}>Delete Account</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
