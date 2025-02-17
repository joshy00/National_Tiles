import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser } from './api/api.js';
import { useNavigate } from 'react-router-dom';

//create global context for user data
const AuthContext = createContext({
  isLoggedIn: false,
  isAdmin: false,
  userId: null,
  isWidgetVisible: false,
  login: async () => { },
  logout: () => { },
});

//use auth provider to share auth to entire app
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); //set default values
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { //if user logged in set variables
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setIsLoggedIn(authData.isLoggedIn);
      setIsAdmin(authData.isAdmin);
      setUserId(authData.userId);
    }
  }, []);

  //when user logs in call login api from api.js
  const login = async (username, password) => {
    try {
      const userData = await loginUser(username, password);
      setIsLoggedIn(true);//set variables
      setIsAdmin(userData.role === 'admin');
      setUserId(userData.userId);
      localStorage.setItem('auth', JSON.stringify({
        isLoggedIn: true,
        isAdmin: userData.role === 'admin',
        userId: userData.userId
      }));
      navigate('/');
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserId(null);
    localStorage.removeItem('auth');
  };

  const value = { isLoggedIn, isAdmin, userId, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;