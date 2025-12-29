import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import DropDownPicker from "react-native-dropdown-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Snackbar } from 'react-native-paper';
import { useRouter} from 'expo-router';


export default function WalletScreen() {
   const { userId, loading } = useContext(AuthContext);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackType, setSnackType] = useState('info'); // 'info' | 'error' | 'success'
  const [balance, setBalance] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>("$");
  const [loadingDos, setLoadingDos] = useState(true);
  const [amount, setAmount] = useState("");

const router = useRouter() as { push: (path: string) => void , replace: (path: string) => void};
  type CardItem = {
  label: string;
  value: number;
  };
  // Dropdown
  const [open, setOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
 const [items, setItems] = useState<CardItem[]>([]);

type SnackType = 'info' | 'error' | 'success';

const showSnack = (message: string, type: SnackType = 'info') => {
  setSnackMessage(message);
  setSnackType(type);
  setSnackVisible(true);
};



  useEffect(() => {
    if (!loading) {
    if (!userId) {
      router.replace('/login/page'); // si no hay userId, manda a login
    }
  }
    if (!userId) return;

    const fetchBalance = async () => {
      try {
        const response = await fetch("http://localhost:3000/wallet/balance", {
          headers: {
            "X-User-Id": userId.toString(),
          },
        });

        if (!response.ok) throw new Error();

        const data = await response.json();
        setBalance(data.balance);
        setCurrency(data.currency);
      } catch (err) {
        Alert.alert("Error", "No se pudo obtener el balance");
      }
    };

    const fetchCards = async () => {
      try {
        const res = await fetch("http://localhost:3000/cards", {
          headers: {
            "X-User-Id": userId.toString(),
          },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setItems(
          data.cards.map((c: any) => ({
            label: `•••• ${c.last4}`,
            value: c.id,
          }))
        );
      } catch (err) {
        Alert.alert("Error", "No se pudieron cargar las tarjetas");
      }
    };

    Promise.all([fetchBalance(), fetchCards()]).finally(() =>
      setLoadingDos(false)
    );
  }, [userId,loading]);

  const handleTopUp = async () => {
  if (!selectedCardId || !amount || Number(amount) <= 0) {
    showSnack("Ingrese un monto válido y seleccione una tarjeta", "error");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/wallet/topup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": userId.toString(),
      },
      body: JSON.stringify({
        amount: Number(amount),
        cardId: selectedCardId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      showSnack(data.error || "No se pudo recargar", "error");
      return;
    }

    setBalance(data.newBalance);
    setAmount("");

    showSnack("Saldo recargado correctamente", "success");
  } catch (err) {
    console.error("Error al recargar saldo:", err);
    showSnack("Ocurrió un error al recargar", "error");
  }
};

  if (loadingDos) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
      <ScrollView contentContainerStyle={styles.wrapper}>
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#6366f1", "#9333ea"]} style={styles.header}>
        <Text style={styles.headerTitle}>Mi Balance</Text>
        <Text style={styles.headerSubtitle}>
          Gestioná tu saldo de forma segura
        </Text>
      </LinearGradient>

      {/* Balance */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
        <Text style={styles.balanceAmount}>
          {currency} {balance?.toLocaleString()}
        </Text>
      </View>

      {/* Recarga */}
      <View style={styles.formCard}>
        <Text style={styles.label}>Tarjeta</Text>

        <DropDownPicker
          open={open}
          value={selectedCardId}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedCardId}
          setItems={setItems}
          placeholder="Seleccionar tarjeta"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />

        <Text style={styles.label}>Monto a cargar</Text>
        <View style={styles.amountInput}>
          <Text style={styles.currency}>{currency}</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0.00"
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleTopUp}>
          <Ionicons name="wallet-outline" size={22} color="#fff" />
          <Text style={styles.buttonText}>Recargar saldo</Text>
        </TouchableOpacity>
      </View>
      {/* Pagar */}
      <View style={styles.formCard}>
        <TouchableOpacity style={styles.button}  onPress={() => router.push('/pagar/page')}>
          <Ionicons name="wallet-outline" size={22} color="#fff" />
          <Text style={styles.buttonText}>Pagar</Text>
        </TouchableOpacity>
      </View>
      <Snackbar
       visible={snackVisible}
      onDismiss={() => setSnackVisible(false)}
       duration={3000}
       style={{
       backgroundColor: snackType === 'error' ? '#f87171' : '#34d399',
      }}
      >
      {snackMessage}
      </Snackbar>
    </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
 wrapper: {
    padding: 16,
    paddingBottom: 20,
  },
  header: { paddingTop: 48, paddingBottom: 96, paddingHorizontal: 16 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "600" },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", marginTop: 4 },

  balanceCard: {
    marginHorizontal: 16,
    marginTop: -64,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 4,
  },
  balanceLabel: { color: "#6b7280", fontSize: 13 },
  balanceAmount: { fontSize: 32, fontWeight: "700", marginTop: 4 },

  formCard: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },

  label: { fontSize: 12, color: "#6b7280" },

  dropdown: {
    borderRadius: 14,
    borderColor: "#e5e7eb",
  },
  dropdownContainer: {
    borderRadius: 14,
    borderColor: "#e5e7eb",
  },

  amountInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 14,
    borderRadius: 14,
    
  },
  currency: { fontSize: 18, marginRight: 4 },
  input: { flex: 1, fontSize: 18, paddingVertical: 12,
  },

  button: {
    marginTop: 16,
    backgroundColor: "#6366f1",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});

