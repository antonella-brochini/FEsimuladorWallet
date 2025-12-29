import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const loadUserId = async () => {
      try {
        let id;
        if (typeof window !== 'undefined' && window.localStorage) {
          id = window.localStorage.getItem('userId');
        } else {
          id = await AsyncStorage.getItem('userId');
        }
        if (id) setUserId(parseInt(id, 10));
      } catch (e) {
        console.log('Error leyendo userId:', e);
      } finally {
        setLoading(false);
      }
    };
    loadUserId();
  }, []);

  const login = async (id) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('userId', id.toString());
      } else {
        await AsyncStorage.setItem('userId', id.toString());
      }
      setUserId(id);
    } catch (e) {
      console.log('Error login:', e);
    }
  };

  const logout = async () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('userId');
      } else {
        await AsyncStorage.removeItem('userId');
      }
      setUserId(null);
    } catch (e) {
      console.log('Error logout:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
