import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert } from "react-native";
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import Icon from "react-native-vector-icons/Feather";
import { LinearGradient } from 'expo-linear-gradient';


export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Ingrese email y contraseña');
      return;
    }


    try {
      setLoading(true);
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
        
    }
  };

  return (
        <LinearGradient
  colors={['#6366f1', '#9333ea']} // indigo-500 → purple-600
  style={styles.gradient}
>
  <View style={styles.container}>
         <View style={styles.card}>
           {/* Header */}
           <View style={styles.header}>
             <View style={styles.iconWrapper}>
               <Icon name="lock" size={32} color="#4f46e5" />
             </View>
             <Text style={styles.title}>Bienvenido</Text>
             <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>
           </View>
   
           {/* Form */}
           <View style={styles.form}>
             {/* Email */}
             <View style={styles.inputGroup}>
               <Text style={styles.label}>Correo electrónico</Text>
               <View style={styles.inputWrapper}>
                 <Icon name="mail" size={20} color="#9ca3af" style={styles.inputIcon} />
                 <TextInput
                   style={styles.input}
                   placeholder="tu@email.com"
                   value={email}
                   onChangeText={setEmail}
                   keyboardType="email-address"
                   autoCapitalize="none"
                 />
               </View>
             </View>
   
             {/* Password */}
             <View style={styles.inputGroup}>
               <Text style={styles.label}>Contraseña</Text>
               <View style={styles.inputWrapper}>
                 <Icon name="lock" size={20} color="#9ca3af" style={styles.inputIcon} />
                 <TextInput
                   style={styles.input}
                   placeholder="••••••••"
                   value={password}
                   onChangeText={setPassword}
                   secureTextEntry={!showPassword}
                 />
                 <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                   <Icon name={showPassword ? "eye-off" : "eye"} size={20} color="#9ca3af" />
                 </TouchableOpacity>
               </View>
             </View>
   
             {/* Remember Me */}
             <View style={styles.row}>
               <View style={styles.switchWrapper}>
                 <Switch
                   value={rememberMe}
                   onValueChange={setRememberMe}
                   trackColor={{ false: "#ccc", true: "#4f46e5" }}
                   thumbColor="#fff"
                 />
                 <Text style={styles.switchLabel}>Recordarme</Text>
               </View>
               <TouchableOpacity>
                 <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
               </TouchableOpacity>
             </View>
   
             {/* Submit */}
             <TouchableOpacity style={styles.button} onPress={handleLogin}>
               <Text style={styles.buttonText}>Iniciar sesión</Text>
             </TouchableOpacity>
           </View>
   
           {/* Footer */}
           <View style={styles.footer}>
             <Text style={styles.footerText}>
               ¿No tienes una cuenta?{" "}
                <TouchableOpacity>
                <Text style={styles.footerLink}>Regístrate</Text>
                </TouchableOpacity>
             </Text>
           </View>
         </View>
       </View>
       </LinearGradient>
  );
}

const styles = StyleSheet.create({

  gradient: {
  flex: 1,
},
container: {
  flex: 1,
  justifyContent: 'center', // centra verticalmente
  alignItems: 'center',     // centra horizontalmente
  padding: 16,              // opcional, para que no toque bordes
},
  card: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    color: "#6b7280",
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    color: "#374151",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    outlineStyle: "none", // <- quita el borde azul/negro al enfocar en navegador
    outlineWidth: 0,
  
  },
  eyeButton: {
    padding: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    marginLeft: 8,
    color: "#374151",
  },
  forgot: {
    color: "#4f46e5",
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    color: "#6b7280",
  },
  footerLink: {
    color: "#4f46e5",
    fontWeight: "bold",
  },
});

