import { View, Text, FlatList, ActivityIndicator, StyleSheet, Pressable,  ScrollView, } from 'react-native';
import React, {  useState, useContext, useCallback} from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

export default function CardsScreen() {
  const { userId } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(null);
  const router = useRouter();
  

 const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/cards`, {
        method: 'GET',
        headers: {
          'X-User-Id': userId.toString(),
        },
      });

      if (!response.ok) throw new Error('Error al cargar tarjetas');

      const data = await response.json();
      setCards(data.cards);
    } catch (err) {
      console.error('Error al cargar tarjetas:', err);
    } finally {
      setLoading(false);
    }
  };


    useFocusEffect(
    useCallback(() => {
      fetchCards();
    }, [userId])
  );

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" />
    </View>
  );



const handleAddCard = () => {

router.push("/addCard");

};

  const setPrimary = (id) => {
    setCards(cards.map(c => ({ ...c, isPrimary: c.id === id })));
    setShowMenu(null);
  };
const deleteCardBD = async (cardId) => {
  try {
    const res = await fetch(`http://localhost:3000/card/${cardId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.log('Error borrando tarjeta:', data.error);
      return false;
    }

  } catch (err) {
    console.error('Error en fetch:', err);
  }
};
  const deleteCard = async (id) => {
    const response = await deleteCardBD(id);
    if (response === false) return;
    setCards(cards.filter(c => c.id !== id));
    setShowMenu(null);
  };



  return (
     <LinearGradient
  colors={['#6366f1', '#9333ea']} // indigo-500 → purple-600
  start={{ x: 0, y: 0 }}
  end={{ x: 0, y: 1 }}
  style={{ flex: 1 }}
>
    <ScrollView contentContainerStyle={styles.wrapper}>
    {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="wallet-outline" size={26} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Mi Billetera</Text>
            <Text style={styles.headerSubtitle}>
              {cards.length} tarjeta{cards.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>
 {cards.map(card => (
          <View key={card.id} style={{ marginBottom: 16 }}>
            <View  style={styles.card}>
              {/* Badge + menu */}
              <View style={styles.cardTop}>
                {card.isPrimary ? (
                  <View style={styles.primaryBadge}>
                    <Ionicons name="star" size={12} color="#92400e" />
                    <Text style={styles.primaryText}>Principal</Text>
                  </View>
                ) : <View />}

                <Pressable onPress={() => setShowMenu(card.id)}>
                  <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                </Pressable>
              </View>
              <Text style={styles.cardNumber}>
                •••• •••• •••• {card.last4}
              </Text>

              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.label}>Titular</Text>
                  <Text style={styles.value}>{card.cardHolder.toUpperCase()}</Text>
                </View>
                <View>
                  <Text style={styles.label}>Expira</Text>
                  <Text style={styles.value}>{card.expiryDate}</Text>
                </View>
              </View>
 </View>
            {/* Context menu */}
            {showMenu === card.id && (
              <>
                <Pressable
                  style={styles.overlay}
                  onPress={() => setShowMenu(null)}
                />
                <View style={styles.menu}>
                  {!card.isPrimary && (
                    <Pressable
                      style={styles.menuItem}
                      onPress={() => setPrimary(card.id)}
                    >
                      <Ionicons name="star-outline" size={18} color="#facc15" />
                      <Text>Marcar como principal</Text>
                    </Pressable>
                  )}
                  <Pressable
                    style={styles.menuItem}
                    onPress={() => deleteCard(card.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                    <Text style={{ color: "#ef4444" }}>Eliminar tarjeta</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        ))}
      {/* Add button */}
        <Pressable style={styles.addButton} onPress={handleAddCard}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Agregar Nueva Tarjeta</Text>
        </Pressable>

        {/* Security */}
        <View style={styles.security}>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" />
          <View>
            <Text style={styles.securityTitle}>Tus tarjetas están seguras</Text>
            <Text style={styles.securityText}>
              Todas las transacciones están cifradas de extremo a extremo.
            </Text>
          </View>
           </View>
    </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "700" },
  headerSubtitle: { color: "rgba(255,255,255,0.8)" },

  card: {
    borderRadius: 20,
    padding: 20,
     backgroundColor: '#1E3A8A',
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  primaryBadge: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#fde68a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  primaryText: { fontSize: 12, fontWeight: "600" },
  cardType: { color: "rgba(255,255,255,0.9)", marginBottom: 12 },
  cardNumber: { color: "#fff", fontSize: 20, letterSpacing: 2, marginBottom: 16 },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: { color: "rgba(255,255,255,0.6)", fontSize: 12 },
  value: { color: "#fff", fontSize: 14 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  menu: {
    position: "absolute",
    right: 12,
    top: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 8,
    width: 220,
    elevation: 10,
  },
  menuItem: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    alignItems: "center",
  },

  addButton: {
    marginTop: 8,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  addButtonText: { color: "#fff", fontWeight: "600" },

  security: {
    marginTop: 24,
    flexDirection: "row",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 16,
    borderRadius: 18,
  },
  securityTitle: { color: "#fff", fontWeight: "600" },
  securityText: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
});
