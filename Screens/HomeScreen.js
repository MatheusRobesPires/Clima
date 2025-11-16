import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
  Button,
  Switch,
} from 'react-native';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);


  const getWeather = async (latitude, longitude) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const data = await res.json();
      return data.current_weather;
    } catch (error) {
      console.error(error);
      return null;
    }
  };


  const getCityName = async (latitude, longitude) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await res.json();


      const address = data.address || {};
      const cityName =
        address.city ||
        address.town ||
        address.village ||
        address.suburb ||
        address.state_district ||
        address.state ||
        'Localidade desconhecida';

      return `${cityName}, ${address.state || ''}`;
    } catch (error) {
      console.error(error);
      return 'Localidade desconhecida';
    }
  };

 
  const loadWeather = async () => {
    try {
      setLoading(true);
      let coords = null;

      if (Platform.OS === 'web') {
        coords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            (err) => reject(err)
          );
        });
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'Não foi possível acessar sua localização');
          setLoading(false);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        coords = loc.coords;
      }

      const [weatherData, cityName] = await Promise.all([
        getWeather(coords.latitude, coords.longitude),
        getCityName(coords.latitude, coords.longitude),
      ]);

      setWeather(weatherData);
      setCity(cityName);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert('Erro', 'Não foi possível obter o clima');
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);


  const getWeatherIcon = (code) => {
    if (code === 0) return { name: 'sun', label: 'Céu limpo' };
    if ([1, 2, 3].includes(code)) return { name: 'cloud', label: 'Parcialmente nublado' };
    if ([45, 48].includes(code)) return { name: 'cloud-drizzle', label: 'Névoa' };
    if ([51, 53, 55, 61, 63, 65].includes(code)) return { name: 'cloud-rain', label: 'Chuva' };
    if ([71, 73, 75, 77].includes(code)) return { name: 'cloud-snow', label: 'Neve' };
    if ([95, 96, 99].includes(code)) return { name: 'cloud-lightning', label: 'Tempestade' };
    return { name: 'cloud', label: 'Clima desconhecido' };
  };


  if (loading) {
    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={[styles.text, isDarkMode && styles.darkText]}>Carregando clima...</Text>
      </View>
    );
  }

 
  if (!weather) {
    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>
          Não foi possível carregar o clima
        </Text>
      </View>
    );
  }

 
  const { name, label } = getWeatherIcon(weather.weathercode);
  const temperature = isCelsius
    ? weather.temperature
    : (weather.temperature * 9) / 5 + 32;

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Clima Atual</Text>
      <Text style={[styles.city, isDarkMode && styles.darkText]}>{city}</Text>

      <TouchableOpacity
        style={[styles.card, isDarkMode && styles.darkCard]}
        onPress={() =>
          navigation.navigate('Detalhes', {
            weather,
            city,
            isDarkMode,
            isCelsius,
            temperature: temperature.toFixed(1),
          })
        }
      >
        <Feather name={name} size={64} color="#fff" />
        <Text style={styles.cardTemp}>
          {temperature.toFixed(1)}°{isCelsius ? 'C' : 'F'}
        </Text>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardSub}>Toque para ver detalhes</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 20 }}>
        <Button title="🔄 Atualizar Clima" color="#4A90E2" onPress={loadWeather} />
      </View>

      <View style={styles.switchRow}>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>Modo Escuro</Text>
        <Switch value={isDarkMode} onValueChange={() => setIsDarkMode(!isDarkMode)} />
      </View>

      <View style={styles.switchRow}>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>Mostrar em °F</Text>
        <Switch value={!isCelsius} onValueChange={() => setIsCelsius(!isCelsius)} />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F9FF' },
  darkContainer: { backgroundColor: '#1C1C1C' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  city: { fontSize: 18, color: '#4A90E2', marginBottom: 20 },
  card: {
    backgroundColor: '#4A90E2',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    width: '70%',
    elevation: 5,
  },
  darkCard: { backgroundColor: '#333' },
  cardTemp: { fontSize: 48, color: '#fff', fontWeight: 'bold', marginTop: 10 },
  cardLabel: { fontSize: 18, color: '#EAF4FE', marginTop: 5 },
  cardSub: { fontSize: 14, color: '#D0E6FF', marginTop: 10 },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15, gap: 10 },
  text: { fontSize: 16, color: '#333' },
  darkText: { color: '#fff' },
});
