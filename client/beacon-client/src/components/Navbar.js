import React from "react";
import { useHistory, Link } from "react-router-dom";

function Navbar() {
  const history = useHistory();

  const onLogout = () => {
    localStorage.clear();
    history.push("/");
  };

  return (
    <div>
      <nav>
        <ul className="topnav">
          <li>
            <Link to="/dashboard">
              <span>HOME</span>
            </Link>
          </li>
          <li>
            <Link to="/profiles">
              <span>PROFILES</span>
            </Link>
          </li>
          <li className="right">
            <a onClick={onLogout} href="/">
              <span>LOGOUT</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
