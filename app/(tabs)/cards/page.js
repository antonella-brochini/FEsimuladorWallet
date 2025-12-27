import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import React, {  useState, useContext, useCallback} from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useFocusEffect } from 'expo-router';


export default function CardsScreen() {
  const { userId } = useContext(AuthContext);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);


  

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

  if (cards.length === 0) return (
    <View style={styles.center}>
      <Text>No hay tarjetas cargadas</Text>
    </View>
  );

  return (
    <FlatList
      data={cards}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 20 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.text}>Número: **** **** {item.last4}</Text>
          <Text style={styles.text}>Marca: {item.brand}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  card: { padding:15, borderWidth:1, borderRadius:10, marginBottom:15 },
  text: { fontSize:16 },
});
