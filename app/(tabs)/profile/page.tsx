import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useContext ,useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import LoadingScreen from "../../../components/LoadingScreen";


export default function ProfileScreen() {
  const { logout , userId} = useContext(AuthContext);
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

interface User {
  id: number;
  nombre: string;
  celular: string;
  email: string;
}
  const [user, setUser] = useState<User | null>(null);
useEffect(() => {
  if (!userId) return;

  const fetchUser = async () => {
    try {
      setLoading(true);

     const response = await fetch('http://localhost:3000/user', {
  headers: {
    'X-User-Id': userId.toString(),
  },
});

      if (!response.ok) {
        throw new Error("No se pudo obtener el usuario");
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error cargando usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [userId]);


  const handleLogout = async () => {
    await logout();
    router.replace('/login/page');
  };
if (loading) return <LoadingScreen />;

if (!user) {
  return (
    <View style={styles.center}>
      <Text>No se pudo cargar el usuario</Text>
    </View>
  );
}

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <LinearGradient
        colors={["#6366f1", "#9333ea"]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <Text style={styles.headerSubtitle}>
          Gestiona tu información personal
        </Text>
      </LinearGradient>

      {/* Profile Card */}
    <View style={styles.profileWrapper}>
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <LinearGradient
              colors={["#818cf8", "#a855f7"]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>AB</Text>
            </LinearGradient>

            <View>
              <Text style={styles.name}>{user.nombre}</Text>
              <Text style={styles.member}>Miembro desde 2024</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color="#6b7280" />
            <Text style={styles.infoText}>{user.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color="#6b7280" />
            <Text style={styles.infoText}>{user.celular}</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        <MenuItem
          icon="settings-outline"
          color="#6366f1"
          bg="#e0e7ff"
          title="Configuración de cuenta"
          subtitle="Editar información personal"
        />
        <MenuItem
          icon="card-outline"
          color="#9333ea"
          bg="#f3e8ff"
          title="Métodos de pago"
          subtitle="Gestionar tus tarjetas"
        />
        <MenuItem
          icon="notifications-outline"
          color="#ca8a04"
          bg="#fef9c3"
          title="Notificaciones"
          subtitle="Preferencias de alertas"
        />
        <MenuItem
          icon="shield-checkmark-outline"
          color="#16a34a"
          bg="#dcfce7"
          title="Seguridad y privacidad"
          subtitle="Contraseña y autenticación"
          noBorder
        />
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setShowLogoutConfirm(true)}
      >
        <Ionicons name="log-out-outline" size={20} color="#dc2626" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Versión 1.0.0</Text>

      {/* Logout Modal */}
      <Modal transparent visible={showLogoutConfirm} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <Ionicons name="log-out-outline" size={24} color="#dc2626" />
            </View>

            <Text style={styles.modalTitle}>¿Cerrar sesión?</Text>
            <Text style={styles.modalText}>
              Tendrás que iniciar sesión nuevamente.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowLogoutConfirm(false)}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleLogout}
              >
                <Text style={{ color: "#fff" }}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </View>
    </ScrollView>
  );


}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center : { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { paddingTop: 48, paddingBottom: 96, paddingHorizontal: 16 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "600" },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", marginTop: 4 },

  profileWrapper: { paddingHorizontal: 16, marginTop: -64 },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },

  avatarRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 16 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 24, fontWeight: "600" },

  name: { fontSize: 18, fontWeight: "600" },
  member: { color: "#6b7280", fontSize: 12 },

  infoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  infoText: { color: "#4b5563", fontSize: 13 },

  menu: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 20,
    overflow: "hidden",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  border: { borderBottomWidth: 1, borderColor: "#f1f5f9" },

  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTitle: { fontSize: 14 },
  menuSubtitle: { fontSize: 11, color: "#6b7280" },

  logoutButton: {
    margin: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#fee2e2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  logoutText: { color: "#dc2626", fontWeight: "600" },

  version: { textAlign: "center", color: "#9ca3af", fontSize: 11 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, textAlign: "center", marginBottom: 6 },
  modalText: { textAlign: "center", color: "#6b7280", marginBottom: 16 },

  modalButtons: { flexDirection: "row", gap: 12 },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
  },
  confirmBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#dc2626",
    alignItems: "center",
  },
});

function MenuItem({
  icon,
  color,
  bg,
  title,
  subtitle,
  noBorder,
}: any) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, !noBorder && styles.border]}
    >
      <View style={[styles.menuIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );
}

