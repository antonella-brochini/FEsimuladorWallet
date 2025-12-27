import { View, Button, Text } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login/page');
  };

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text style={{ fontSize:24, marginBottom:20 }}>Perfil</Text>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}
