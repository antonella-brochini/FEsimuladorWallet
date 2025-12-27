import { View, TextInput, Button, Alert, Text } from 'react-native';
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Ingrese email y contraseña');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Credenciales inválidas');
        setLoading(false);
        return;
      }

      const data = await response.json();
      login(data.userId); // guarda el userId en AuthContext
      router.replace('/(tabs)'); // redirige a las tabs
    } catch (err) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex:1, justifyContent:'center', padding:20 }}>
      <Text style={{ fontSize:24, marginBottom:20, textAlign:'center' }}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth:1, padding:10, marginBottom:15, borderRadius:5 }}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth:1, padding:10, marginBottom:15, borderRadius:5 }}
      />
      <Button title={loading ? 'Cargando...' : 'Ingresar'} onPress={handleLogin} disabled={loading} />
    </View>
  );
}

