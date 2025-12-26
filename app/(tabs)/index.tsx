import { StyleSheet, TextInput, Animated, Pressable, Alert } from 'react-native';
import { useState, useRef } from 'react';

import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const flipCard = () => {
    const toValue = flipped ? 0 : 180;
    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped));
  };

  const handleCardInput = (text: string) => {
    // Remover espacios y caracteres no numéricos
    const cleaned = text.replace(/\D/g, '');
    
    // Limitar a 16 dígitos
    if (cleaned.length <= 16) {
      // Formatear con espacios cada 4 dígitos
      const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
      setCardNumber(formatted);
    }
  };

  const handleExpiryInput = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length <= 4) {
      if (cleaned.length >= 2) {
        const formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
        setExpiryDate(formatted);
      } else {
        setExpiryDate(cleaned);
      }
    }
  };

  const handleCvvInput = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 3) {
      setCvv(cleaned);
    }
  };

  const handleSubmit = () => {
    const digits = cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(digits)) {
     Alert.alert('Error', 'El número de tarjeta debe tener 16 dígitos.');
     return;
      }
    if (!cardHolder || cardHolder.trim().length === 0) { 
      Alert.alert('Error', 'Ingrese el nombre del titular.'); return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      Alert.alert('Error', 'Fecha de vencimiento inválida. Use MM/YY.');
      return;
    }
    const month = parseInt(expiryDate.slice(0, 2), 10);
    if (month < 1 || month > 12) {
      Alert.alert('Error', 'Mes de vencimiento inválido.');
      return;
    }
   if (!/^\d{3}$/.test(cvv)) {
     Alert.alert('Error', 'El CVV debe tener 3 dígitos numéricos.');
    return;
   }
    Alert.alert('Éxito', 'Tarjeta ingresada correctamente.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingresar Tarjeta</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* Vista previa de la tarjeta (front/back flip) */}
      <Pressable onPress={flipCard} style={styles.cardContainer}> 
        <Animated.View
          style={[
            styles.card,
            { transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }], backfaceVisibility: 'hidden' },
          ]}
        >
          <View style={styles.cardLogo}>
            <Text style={styles.logoText}>VISA</Text>
          </View>

          <Text style={styles.cardNumber}>
            {cardNumber && cardNumber.length > 0 ? cardNumber : '0000 0000 0000 0000'}
          </Text>

          <View style={styles.cardFooter}>
            <View style={styles.cardHolderContainer}>
              <Text style={styles.smallLabel}>Titular</Text>
              <Text style={styles.cardHolder}>
                {cardHolder && cardHolder.length > 0 ? cardHolder.toUpperCase() : 'NOMBRE APELLIDO'}
              </Text>
            </View>

            <View style={styles.expiryContainer}>
              <Text style={styles.smallLabel}>Vence</Text>
              <Text style={styles.expiry}>{expiryDate && expiryDate.length > 0 ? expiryDate : 'MM/YY'}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.cardBack,
            { transform: [{ perspective: 1000 }, { rotateY: backInterpolate }], backfaceVisibility: 'hidden' },
          ]}
        >
          <Text style={styles.logoText}>VISA</Text>
          <View style={styles.backStripe} />
          <View style={styles.cvvArea}>
            <Text style={styles.smallLabel}>CVV</Text>
            <Text style={styles.cardCvv}>{cvv && cvv.length > 0 ? cvv : '***'}</Text>
          </View>
        </Animated.View>
      </Pressable>

      {/* Formulario */}
      <TextInput
        style={styles.input}
        placeholder="Nombre del Titular"
        placeholderTextColor="#999"
        value={cardHolder}
        onChangeText={setCardHolder}
        maxLength={30}
      />

      <TextInput
        style={styles.cardInput}
        placeholder="0000 0000 0000 0000"
        placeholderTextColor="#999"
        value={cardNumber}
        onChangeText={handleCardInput}
        keyboardType="numeric"
        maxLength={19}
      />

      <View style={styles.rowContainer}>
        <TextInput
          style={styles.smallInput}
          placeholder="MM/YY"
          placeholderTextColor="#999"
          value={expiryDate}
          onChangeText={handleExpiryInput}
          keyboardType="numeric"
          maxLength={5}
        />

        <TextInput
          style={styles.smallInput}
          placeholder="CVV"
          placeholderTextColor="#999"
          value={cvv}
          onChangeText={handleCvvInput}
          keyboardType="numeric"
          maxLength={3}
          secureTextEntry
        />
      </View>

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Ingresar Tarjeta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  cardInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    width: '100%',
    marginVertical: 20,
    letterSpacing: 2,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    width: '100%',
    marginVertical: 10,
    color: '#000',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    gap: 10,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    flex: 1,
    color: '#000',
  },
  card: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#1E3A8A',
    padding: 16,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '100%',
    height: 180,
    marginBottom: 20,
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#1E3A8A',
    padding: 16,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  backStripe: {
    height: 36,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.35)',
    marginTop: 12,
    borderRadius: 4,
  },
  cvvArea: {
    position: 'absolute',
    right: 16,
    top: 86,
    alignItems: 'flex-end',
    backgroundColor: '#1E3A8A',
  },
  cardCvv: {
    color: '#fff',
    fontSize: 18,
    letterSpacing: 2,
    marginTop: 6,
  },
  cardLogo: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  cardNumber: {
    color: '#fff',
    fontSize: 22,
    letterSpacing: 2,
    marginTop: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  smallLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
  },
  cardHolder: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  expiry: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  cardHolderContainer: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    padding: 0,
  },
  expiryContainer: {
    alignItems: 'flex-end',
     backgroundColor: '#1E3A8A',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#0ea5e9',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
