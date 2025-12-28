import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const loadUser = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
       setUserId(id || null); // puede ser null si no existe
      } catch (e) {
        console.log('Error al cargar userId:', e);
      } finally {
        setLoading(false); // MUY IMPORTANTE
      }
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
