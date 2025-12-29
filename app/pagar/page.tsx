import React, { useState,useEffect , useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter,Stack } from 'expo-router';
import { AuthContext } from "../context/AuthContext";
import { Snackbar } from 'react-native-paper';


export default function PaymentScreen() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState('');
  const { userId } = useContext(AuthContext);
  type CardItem = {
  label: string;
  value: number;
  };
 const [items, setItems] = useState<CardItem[]>([]);
 const [snackVisible, setSnackVisible] = useState(false);
 const [snackMessage, setSnackMessage] = useState('');
  const [snackType, setSnackType] = useState('info'); // 'info' | 'error' | 'success'
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
const [modalVisible, setModalVisible] = useState(false);

type SnackType = 'info' | 'error' | 'success';

const showSnack = (message: string, type: SnackType = 'info') => {
  setSnackMessage(message);
  setSnackType(type);
  setSnackVisible(true);
};

  useEffect(() => {
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
      setLoading(false)
    );
  }, [userId]);


  const handleAmountChange = (value:any) => {
    const clean = value.replace(/[^0-9,]/g, '');
    setAmount(clean);
  };
const handleConfirm = async () => {
  if (!amount || !recipient) {
    showSnack("Completá monto y destinatario", "error");
    return;
  }

  if (paymentMethod === "card" && !selectedCard) {
    showSnack("Seleccioná una tarjeta", "error");
    return;
  }

  // 🔹 Normalizar monto (coma → punto)
  const parsedAmount = Number(amount.replace(",", "."));

  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    showSnack("Monto inválido", "error");
    return;
  }

  const paymentPayload = {
    amount: parsedAmount,
    currency: currency,
    recipient: recipient,
    description: description || null,
    method: paymentMethod,
    cardId: paymentMethod === "card" ? selectedCard?.value : null,
  };

  try {
    const endpoint =
      paymentMethod === "wallet"
        ? "http://localhost:3000/payments/wallet"
        : "http://localhost:3000/payments/card";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": userId.toString(),
      },
      body: JSON.stringify(paymentPayload),
    });

    if (!res.ok) {
      throw new Error("Error en el pago");
    }

    showSnack("Pago realizado con éxito", "success");


    setTimeout(() => {
      router.push({
  pathname: '/pagar/confirmacionPago',
  params: {
    amount: amount,
    recipient: recipient,
    paymentMethod: paymentMethod,
    description: description,
  }
});
  
    }, 800);

  } catch (error) {
    showSnack("No se pudo realizar el pago", "error");
  }
};



  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <LinearGradient
      colors={['#6366f1', '#9333ea']}
        style={styles.gradient}
    >
        <View style={styles.container}>
      {/* Header */}
     <View style={styles.header}>
       <Pressable onPress={() => router.back()} style={styles.backButton}>
               <View style={styles.headerIcon}>
                <Feather name="arrow-left" size={26} color="#fff" />
               </View>
       </Pressable>
               <View style={{ backgroundColor: 'transparent' }}>
                  <Text style={styles.headerTitle}>Pagar</Text>
               </View>
      </View>

     <ScrollView
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
>
        {/* Monto */}
        <Text style={styles.label}>Monto a pagar</Text>
        <View style={styles.amountRow}>
          <Text style={styles.currency}>$</Text>
          <TextInput
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0,00"
            keyboardType="numeric"
            style={styles.amountInput}
          />
        </View>
        <View style={styles.separator} />

        {/* Método de pago */}
        <Text style={styles.label}>Método de pago</Text>

        {/* Wallet */}
        <TouchableOpacity
          style={[
            styles.methodCard,
            paymentMethod === 'wallet' && styles.methodActive,
          ]}
          onPress={() => setPaymentMethod('wallet')}
        >
          <View
            style={[
              styles.iconBox,
              paymentMethod === 'wallet' && styles.iconActive,
            ]}
          >
            <Ionicons
              name="wallet-outline"
              size={22}
              color={paymentMethod === 'wallet' ? '#fff' : '#4B5563'}
            />
          </View>

          <View style={styles.methodText}>
            <Text style={styles.methodTitle}>Saldo en Wallet</Text>
            <Text style={styles.methodSubtitle}>{currency} {balance}</Text>
          </View>

          {paymentMethod === 'wallet' && (
            <View style={styles.check}>
              <Feather name="check" size={14} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        {/* Card */}
        <TouchableOpacity
          style={[
            styles.methodCard,
            paymentMethod === 'card' && styles.methodActive,
          ]}
          onPress={() => setPaymentMethod('card')}
        >
          <View
            style={[
              styles.iconBox,
              paymentMethod === 'card' && styles.iconActive,
            ]}
          >
            <Feather
              name="credit-card"
              size={22}
              color={paymentMethod === 'card' ? '#fff' : '#4B5563'}
            />
          </View>

          <View style={styles.methodText}>
            <Text style={styles.methodTitle}>Tarjeta</Text>
          </View>

          {paymentMethod === 'card' && (
            <View style={styles.check}>
              <Feather name="check" size={14} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

{paymentMethod === 'card' && (
  <View style={{ marginBottom: 24 }}>
   <TouchableOpacity
  style={styles.cardSelector}
  onPress={() => setModalVisible(true)}
>
  <Text style={styles.cardSelectorText}>
    {selectedCard ? selectedCard.label : 'Seleccionar tarjeta'}
  </Text>
</TouchableOpacity>
  </View>
)}


        {/* Destinatario */}
        <Text style={styles.label}>Destinatario</Text>
        <View style={styles.inputContainer}>
          <Feather name="user" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Alias, CVU o contacto"
            value={recipient}
            onChangeText={setRecipient}
            style={styles.input}
          />
        </View>

        {/* Descripción */}
        <Text style={styles.label}>
          Descripción <Text style={styles.optional}>(opcional)</Text>
        </Text>
        <View style={[styles.inputContainer, styles.textArea]}>
          <Feather name="file-text" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Agregá una nota o descripción"
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.input}
          />
        </View>
      </ScrollView>

      {/* Botón fijo */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={!amount || !recipient}
          style={[
            styles.button,
            (!amount || !recipient) && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>Confirmar pago</Text>
        </TouchableOpacity>
      </View>
    </View>
    </LinearGradient>
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
      <Modal
  visible={modalVisible}
  transparent
  animationType="fade"
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Elegí una tarjeta</Text>

      {items.map(card => (
        <TouchableOpacity
          key={card.value}
          style={styles.cardItem}
          onPress={() => {
            setSelectedCard(card);
            setModalVisible(false);
          }}
        >
          <Text style={styles.cardItemText}>{card.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
</Modal>
    </>
  );
}
const styles = StyleSheet.create({
    gradient: {
  flex: 1,
},
  container: {
    flex: 1,
  width: '100%',
  paddingHorizontal: 20,
  paddingTop: 24,
  paddingBottom: 100,
  backgroundColor: 'transparent',
},
 header: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    alignItems: "center",
    backgroundColor: 'transparent',
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "700", backgroundColor: 'transparent', },
backButton: {
  paddingRight: 8,
},
  content: {
    padding: 20,
    paddingBottom: 120,
  },

  label: {
    fontSize: 13,
    color: '#fff',
    marginBottom: 8,
  },

  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  currency: {
    fontSize: 40,
    marginRight: 6,
    color: '#fff',
  },

  amountInput: {
    fontSize: 40,
    color: '#fff',
    flex: 1,
   
  },

  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },

  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    marginBottom: 12,
  },

  methodActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconActive: {
    backgroundColor: '#6366F1',
  },

  methodText: {
    flex: 1,
    marginLeft: 12,
  },

  methodTitle: {
    fontSize: 15,
    color: '#6B7280',
  },

  methodSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },

  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    gap: 10,
  },

  textArea: {
    alignItems: 'flex-start',
  },

  input: {
    flex: 1,
    fontSize: 14,
  },

  optional: {
    color: '#ffff',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },

  button: {
    backgroundColor: '#4F46E5',
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonDisabled: {
    backgroundColor: '#E5E7EB',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
},

modalContainer: {
  width: '85%',
  backgroundColor: '#FFFFFF',
  borderRadius: 20,
  padding: 20,
},

modalTitle: {
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 16,
},

cardItem: {
  paddingVertical: 14,
  borderBottomWidth: 1,
  borderBottomColor: '#E5E7EB',
},

cardItemText: {
  fontSize: 16,
},

cardSelector: {
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#E5E7EB',
  borderRadius: 16,
  padding: 16,
},

cardSelectorText: {
  fontSize: 16,
  color: '#111827',
},

});
