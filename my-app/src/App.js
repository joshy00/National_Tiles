import React, { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import Navbar from './Navbar.js';
import Login from './Login.js';
import Home from './Home.js';
import Admin from './Admin.js';
import Tasks from './Tasks.js';
import Users from './Users.js'
import { useAuth } from './AuthContext.js';


function App() {
  const { isLoggedIn, isAdmin } = useAuth(); //get variables from authContext
  

  const [navbarItems, setNavbarItems] = useState([]); //initally set navbar to empty array


  useEffect(() => {
    const storedNavbar = sessionStorage.getItem("navbarItems");
    
    const initialItems = [ //Default layout of navbar
      { title: "Home", path: "/", show: true },
      { title: "Login", path: "/login", show: !isLoggedIn },
      { title: "Logout", path: "/", show: isLoggedIn },
      { title: "Admin", path: "/admin", show: isAdmin },
      { title: "Users", path: "/users", show: isAdmin },
    ];

    if (storedNavbar) {
      setNavbarItems(JSON.parse(storedNavbar)); //Use stored items if available
    } else {
      setNavbarItems(initialItems); //Use default items if no stored data
    }
  }, [isLoggedIn, isAdmin])

  useEffect(() => {
    //Update navbar items when auth state changes
    setNavbarItems(prevItems => prevItems.map(item => {
      if (item.title === "Login") return { ...item, show: item.show };
      if (item.title === "Logout") return { ...item, show: item.show };
      if (item.title === "Admin" || item.title === "Users") return { ...item, show: item.show };
      return item;
    }));
  }, [isLoggedIn, isAdmin]);

  

  return (

    <div>
      <Navbar navbarItems={navbarItems} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Admin" element={<Admin navbarItems={navbarItems} setNavbarItems={setNavbarItems} />} />
        <Route path="/Users" element={<Users />} />
      </Routes>
      {isLoggedIn && <Tasks />}
    </div>
  );
}

export default App;