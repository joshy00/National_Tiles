import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from './Navbar.js';
import Login from './Login.js';
import Home from './Home.js';
import Admin from './Admin.js';
import Tasks from './Tasks.js';
import Users from './Users.js'
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [navbarItems, setNavbarItems] = useState([]);
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const defaultItems = [ //The default layout of navbar
      { title: "Home", path: "/", show: true },
      { title: "Login", path: "/login", show: !isLoggedIn },
      { title: "Logout", path: "/", show: isLoggedIn },
      { title: "Admin", path: "/admin", show: isAdmin },
      { title: "Users", path: "/users", show: isAdmin }
    ];

    if (!sessionStorage.getItem("navbarItems")) { //if user hasn't changed navbar, use default
      setNavbarItems(defaultItems);
    } else {
      const storedNavbar = JSON.parse(sessionStorage.getItem("navbarItems")); //else use the saved navbar
      setNavbarItems(storedNavbar);
    }
  }, [isLoggedIn, isAdmin]);

  //useEffect to make sure user is logged in on refresh
  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn");
    if (loggedIn === "true") { 
      setIsLoggedIn(true);
      setIsWidgetVisible(true);
      if (sessionStorage.role === "admin") { //if user is as admin, setIsAdmin to true
        setIsAdmin(true);
      }
    }
  }, []);

  //function to run when login button is pressed, setting same variables as above
  const login = (data) => {
    setIsLoggedIn(true);
    sessionStorage.setItem("isLoggedIn", "true"); 
    sessionStorage.setItem("role", data.role);
    sessionStorage.setItem("userId", data.userId);
    setIsWidgetVisible(true);
    if (sessionStorage.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    nav("/"); //navigate to home when login complete
  };
  //function to logout user, set varaibles to false and clear session data
  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
  };
  //Toggle the task widget visibility
  const toggleWidget = () => {
    setIsWidgetVisible(!isWidgetVisible);
  };

  return (

    <div>
      <Navbar navbarItems={navbarItems} isLoggedIn={isLoggedIn} isAdmin={isAdmin} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login login={login} />} />
        <Route path="/Admin" element={<Admin navbarItems={navbarItems} setNavbarItems={setNavbarItems} />} />
        <Route path="/Users" element={<Users />} />
      </Routes>
      {isLoggedIn && isWidgetVisible && <Tasks onClose={toggleWidget} />}
    </div>
  );
}

export default App;