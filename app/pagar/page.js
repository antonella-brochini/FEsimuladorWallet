import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  Alert,
} from 'react-native';

const PaymentScreen = ({ navigation, route }) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [note, setNote] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Simulación: métodos de pago / tarjetas (en real vendrían de API/estado global)
  const paymentMethods = [
    { id: 1, type: 'Visa', brand: 'Visa', last4: '1234' },
    { id: 2, type: 'Mastercard', brand: 'Mastercard', last4: '5678' },
  ];

  const wallet = {
    balance: 254.75,
    currency: 'USD',
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: wallet.currency,
      maximumFractionDigits: 2,
    }).format(value);

  const onConfirm = () => {
    const numeric = parseFloat(amount.replace(',', '.'));
    if (!selectedMethod) {
      Alert.alert('Error', 'Selecciona un método de pago.');
      return;
    }
    if (!numeric || numeric <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido.');
      return;
    }
    if (numeric > wallet.balance) {
      Alert.alert('Saldo insuficiente', 'Tu saldo es menor al monto ingresado.');
      return;
    }
    setConfirmVisible(true);
  };

  const handlePay = () => {
    setConfirmVisible(false);
    // Aquí iría la llamada al endpoint para procesar el pago
    Alert.alert('Pago realizado', `Se pagó ${formatCurrency(parseFloat(amount))} con ${selectedMethod.brand} ****${selectedMethod.last4}`);
    setAmount('');
    setNote('');
    setSelectedMethod(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pagar desde Wallet</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
        <Text style={styles.balanceValue}>{formatCurrency(wallet.balance)}</Text>
      </View>

      <Text style={styles.label}>Monto</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={(t) => setAmount(t)}
      />

      <View style={styles.quickRow}>
        {[5, 10, 25, 50].map((v) => (
          <TouchableOpacity
            key={v}
            style={styles.quickBtn}
            onPress={() => setAmount(String(v))}
          >
            <Text style={styles.quickText}>{formatCurrency(v)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Mensaje (opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción del pago"
        value={note}
        onChangeText={setNote}
      />

      <Text style={styles.label}>Seleccionar tarjeta</Text>
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const selected = selectedMethod?.id === item.id;
          return (
            <TouchableOpacity
              style={[styles.cardItem, selected && styles.cardItemSelected]}
              onPress={() => setSelectedMethod(item)}
            >
              <Text style={styles.cardBrand}>{item.brand}</Text>
              <Text style={styles.cardLast}>**** {item.last4}</Text>
            </TouchableOpacity>
          );
        }}
        style={styles.cardsList}
      />

      <TouchableOpacity style={styles.payButton} onPress={onConfirm}>
        <Text style={styles.payButtonText}>Confirmar pago</Text>
      </TouchableOpacity>

      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirmar pago</Text>
            <Text style={styles.modalRow}>Monto: {formatCurrency(parseFloat(amount || 0))}</Text>
            <Text style={styles.modalRow}>Método: {selectedMethod?.brand} ****{selectedMethod?.last4}</Text>
            {note ? <Text style={styles.modalRow}>Nota: {note}</Text> : null}
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancel} onPress={() => setConfirmVisible(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.modalConfirm} onPress={handlePay}>
                <Text style={styles.modalConfirmText}>Pagar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F6F7FB' },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#1F2937' },
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  balanceLabel: { fontSize: 13, color: '#6B7280' },
  balanceValue: { fontSize: 20, fontWeight: '700', marginTop: 6, color: '#111827' },

  label: { fontSize: 15, marginTop: 10, color: '#374151' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  quickRow: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' },
  quickBtn: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  quickText: { color: '#111827', fontWeight: '600' },

  cardsList: { marginTop: 12, marginBottom: 8 },
  cardItem: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    minWidth: 120,
  },
  cardItemSelected: { borderColor: '#10B981', backgroundColor: '#ECFDF5' },
  cardBrand: { fontWeight: '700', color: '#111827' },
  cardLast: { color: '#6B7280', marginTop: 6 },

  payButton: {
    backgroundColor: '#0EA5A4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18,
  },
  payButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  modalRow: { fontSize: 15, color: '#374151', marginVertical: 4 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14 },
  modalCancel: { padding: 10, marginRight: 8 },
  modalCancelText: { color: '#6B7280', fontWeight: '600' },
  modalConfirm: { backgroundColor: '#059669', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  modalConfirmText: { color: '#fff', fontWeight: '700' },
});
// ...existing code...