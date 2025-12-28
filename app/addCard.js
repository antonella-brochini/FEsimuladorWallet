import { StyleSheet, TextInput, Animated, Pressable, Alert ,TouchableOpacity,ScrollView} from 'react-native';
import { useState, useRef,useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { Text, View } from '@/components/Themed';
import { useRouter,Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Snackbar } from 'react-native-paper';

export default function TabOneScreen() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);
  const { userId } = useContext(AuthContext);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackType, setSnackType] = useState('info'); // 'info' | 'error' | 'success'
 const router = useRouter();
  const showSnack = (message, type = 'info') => {
  setSnackMessage(message);
  setSnackType(type);
  setSnackVisible(true);
};
 
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

const handleCardInput = (text) => {
  // Remover espacios y caracteres no numéricos
  const cleaned = text.replace(/\D/g, '');
  
  // Limitar a 16 dígitos
  if (cleaned.length <= 16) {
    // Formatear con espacios cada 4 dígitos
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  }
};


  const handleExpiryInput = (text) => {
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

  const handleCvvInput = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 3) {
      setCvv(cleaned);
    }
  };

  const handleSubmit = () => {
    const digits = cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(digits)) {
     showSnack('El número de tarjeta debe tener 16 dígitos.', 'error');
     return;
      }
    if (!cardHolder || cardHolder.trim().length === 0) { 
      showSnack('Ingrese el nombre del titular.', 'error');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      showSnack('Fecha de vencimiento inválida. Use MM/YY.', 'error');
      return;
    }
    const month = parseInt(expiryDate.slice(0, 2), 10);
    if (month < 1 || month > 12) {
      showSnack('Mes de vencimiento inválido.', 'error');
      return;
    }
   if (!/^\d{3}$/.test(cvv)) {

      showSnack('El CVV debe tener 3 dígitos numéricos.', 'error');
    return;
   }

    newCard()
    showSnack('Tarjeta ingresada correctamente.', 'success');
  };

const newCard = async () => {
  try {
    const response = await fetch(`http://localhost:3000/card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId.toString(),
      },
      body: JSON.stringify({
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardHolder: cardHolder,
        expiryDate: expiryDate,
        cvv: cvv,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showSnack(data.error || 'No se pudo agregar la tarjeta', 'error');
      console.log('Error adding card:', data);
      return null;
    }

    if (data.success) {
      console.log('Card added successfully:', data);
      setCardNumber('');
      setCardHolder('');
      setExpiryDate('');
      setCvv('');
      showSnack('Tarjeta agregada correctamente', 'success');

      router.replace('/cards/page'); // navegar después de mostrar SnackBar
    }

  } catch (err) {
    console.error('Error al agregar tarjeta:', err);
    showSnack(err.message || 'Ocurrió un error', 'error');
  }
};

  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />

    <LinearGradient
  colors={['#6366f1', '#9333ea']} // indigo-500 → purple-600
  style={styles.gradient}
>
  <ScrollView
  style={{ flex: 1 }}
  contentContainerStyle={{ paddingBottom: 20}}
  showsVerticalScrollIndicator={false}
>
  <View style={styles.container}>

<View style={styles.header}>
  <Pressable onPress={() => router.back()} style={styles.backButton}>
          <View style={styles.headerIcon}>
           <Feather name="arrow-left" size={26} color="#fff" />
          </View>
  </Pressable>
          <View style={{ backgroundColor: 'transparent' }}>
             <Text style={styles.headerTitle}>Agregar Tarjeta</Text>
          </View>
 </View>
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
      <View style={styles.form}>
     <View style={styles.inputGroup}>
  <Text style={styles.label}>Nombre del titular</Text>
  <View style={styles.inputWrapper}>
    <TextInput
      style={styles.input}
      placeholder="Como aparece en la tarjeta"
      placeholderTextColor="#9ca3af"
      value={cardHolder}
      onChangeText={setCardHolder}
    />
  </View>
</View>

      <View style={styles.inputGroup}>
  <Text style={styles.label}>Número de tarjeta</Text>
  <View style={styles.inputWrapper}>
    <TextInput
      style={styles.input}
      placeholder="0000 0000 0000 0000"
      placeholderTextColor="#9ca3af"
      value={cardNumber}
      onChangeText={handleCardInput}
      keyboardType="numeric"
      maxLength={19}
    />
  </View>
</View>
    <View style={styles.rowContainer}>
  <View style={{ flex: 1 }}>
    <Text style={styles.label}>Expira</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholder="MM/YY"
        placeholderTextColor="#9ca3af"
        value={expiryDate}
        onChangeText={handleExpiryInput}
        keyboardType="numeric"
        maxLength={5}
      />
    </View>
  </View>

  <View style={{ flex: 1 }}>
    <Text style={styles.label}>CVV</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholder="123"
        placeholderTextColor="#9ca3af"
        value={cvv}
        onChangeText={handleCvvInput}
        keyboardType="numeric"
        secureTextEntry
        maxLength={3}
      />
    </View>
  </View>
</View>
       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Ionicons name="wallet-outline" size={24} color="white" />
          <Text style={styles.buttonText}>
            Agregar a Mi Billetera
          </Text>
        </TouchableOpacity>
<View style={styles.securityInfo}>
  <Feather
    name="lock"
    size={14}
    color="#6b7280"
    style={styles.securityIcon}
  />
  <Text style={styles.securityText}>
    Tu información está protegida con cifrado de nivel bancario.{"\n"}
    No almacenamos tu CVV.
  </Text>
</View>
   
    </View>
</View>
     </ScrollView>
     </LinearGradient>
     <Snackbar
  visible={snackVisible}
  onDismiss={() => setSnackVisible(false)}
  duration={3000} // dura 3 segundos
  style={{
    backgroundColor: snackType === 'error' ? '#f87171' : '#34d399', // rojo o verde
  }}
>
  {snackMessage}
</Snackbar>
</>
  );
}

const styles = StyleSheet.create({
  gradient: {
  flex: 1,
},

container: {
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

  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    gap: 10,
  },
 inputGroup: {
  width: '100%',
  marginBottom: 14,
},
 form: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
  },
  label: {
    color: "#374151",
    marginBottom: 4,
    marginTop: 12,
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
    marginTop: 24,
    backgroundColor: "#6366f1",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
     width: "100%", 
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
   input: {
    flex: 1,
    height: 48,
    marginLeft: 8,
    outlineStyle: "none", // <- quita el borde azul/negro al enfocar en navegador
    outlineWidth: 0,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
 securityInfo: {
    marginTop: 24,          // mt-6
    flexDirection: 'row',   // flex
    alignItems: 'flex-start',
    gap: 8,
  },
  securityIcon: {
    marginTop: 2,           // mt-0.5
  },
  securityText: {
    fontSize: 12,           // text-xs
    color: '#6b7280',       // text-gray-500
    flex: 1,
    lineHeight: 16,
  },

});
