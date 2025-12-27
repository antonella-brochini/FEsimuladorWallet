import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentamos recuperar el userId guardado en AsyncStorage
    const loadUser = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) setUserId(Number(storedUserId));
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (id) => {
    setUserId(id);
    await AsyncStorage.setItem('userId', id.toString());
  };

  const logout = async () => {
    setUserId(null);
    await AsyncStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
