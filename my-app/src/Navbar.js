import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import './Navbar.css'
import { useAuth } from './AuthContext';

function Navbar({ navbarItems }) {
  const [isOpen, setIsOpen] = useState(false); //is navbar open variable
  const { logout } = useAuth(); //get logout function from auth
  const location = useLocation(); //Get the current location

  return (
    <div className="navbar-container">
      <div className="navbar-logo">MyApp</div>
      <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>☰</div>
      <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
        {navbarItems
          .filter(item => item.show !== false) //Only show items marked as visible
          .map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={item.title === "Logout" ? logout : null}
              className={location.pathname === item.path && item.title !== 'Logout' ? 'active' : ''}
            >
              {item.title}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
