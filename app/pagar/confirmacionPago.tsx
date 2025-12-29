import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams ,Stack} from 'expo-router';
import { useRouter } from "expo-router";


export default function PaymentConfirmationScreen() {
 const params = useLocalSearchParams() as {
    amount?: string;
    recipient?: string;
    paymentMethod?: 'wallet' | 'card';
    description?: string;
  };

  const { amount, recipient, paymentMethod, description } = params;
  const router = useRouter();

  const date = new Date();
  const formattedDate = date.toLocaleDateString("es-AR");
  const formattedTime = date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const transactionId = `TRX${Math.random()
    .toString(36)
    .substring(2, 11)
    .toUpperCase()}`;

  const handleShare = async () => {
    await Share.share({
      message: `Pago de $${amount} realizado con éxito.\nID: ${transactionId}`,
    });
  };

  return (
       <>
    <Stack.Screen options={{ headerShown: false }} />
    <LinearGradient colors={["#ECFDF5", "#FFFFFF"]} style={styles.gradient}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity  onPress={() => router.push('/(tabs)')}>
          <Feather name="arrow-left" size={26} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comprobante</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Success */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Feather name="check-circle" size={56} color="#16A34A" />
          </View>
          <Text style={styles.successTitle}>¡Pago exitoso!</Text>
          <Text style={styles.successSubtitle}>
            Tu pago se procesó correctamente
          </Text>
        </View>

        {/* Amount */}
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Monto enviado</Text>
          <Text style={styles.amount}>$ {amount}</Text>
        </View>

        {/* Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detalles de la transacción</Text>

          <Detail label="Destinatario" value={recipient} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Método de pago</Text>
            <View style={styles.methodRow}>
              {paymentMethod === "wallet" ? (
                <>
                  <Ionicons name="wallet-outline" size={16} />
                  <Text>Saldo en Wallet</Text>
                </>
              ) : (
                <>
                  <Feather name="credit-card" size={16} />
                  <Text>Tarjeta</Text>
                </>
              )}
            </View>
          </View>

          {description && (
            <Detail label="Descripción" value={description} />
          )}

          <Detail
            label="Fecha y hora"
            value={`${formattedDate} - ${formattedTime}`}
          />

          <Detail label="ID de transacción" value={transactionId} mono />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Feather name="share-2" size={20} />
            <Text>Compartir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Feather name="download" size={20} />
            <Text>Descargar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.mainButtonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
    </>
  );
}
const styles = StyleSheet.create({
  gradient: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  successContainer: {
    alignItems: "center",
    marginBottom: 24,
  },

  successIcon: {
    backgroundColor: "#DCFCE7",
    borderRadius: 50,
    padding: 12,
    marginBottom: 12,
  },

  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  successSubtitle: {
    color: "#6B7280",
  },

  amountBox: {
    alignItems: "center",
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 24,
  },

  amountLabel: {
    color: "#6B7280",
    marginBottom: 8,
  },

  amount: {
    fontSize: 42,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: 24,
  },

  cardTitle: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    fontWeight: "600",
  },

  detailRow: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  detailLabel: {
    color: "#6B7280",
  },

  detailValue: {
    color: "#111827",
    maxWidth: 200,
    textAlign: "right",
  },

  mono: {
    fontFamily: "monospace",
    fontSize: 12,
  },

  methodRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },

  actions: {
    flexDirection: "row",
    gap: 12,
  },

  actionBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },

  mainButton: {
    height: 56,
    backgroundColor: "#4F46E5",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  mainButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
function Detail({
  label,
  value,
  mono = false,
}: {
 label: string; value?: string; mono?: boolean
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, mono && styles.mono]}>
        {value}
      </Text>
    </View>
  );
}

