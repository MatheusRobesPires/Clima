import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailsScreen({ route }) {
  const weather = route?.params?.weather;
  const city = route?.params?.city;
  const isDarkMode = route?.params?.isDarkMode || false;
  const isCelsius = route?.params?.isCelsius ?? true;
  const temperature = route?.params?.temperature; 

  if (!weather) {
    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Nenhum dado disponível</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Detalhes do Clima</Text>
      <Text style={[styles.city, isDarkMode && styles.darkText]}>{city}</Text>
      <Text style={[styles.text, isDarkMode && styles.darkText]}>
        Temperatura: {temperature}°{isCelsius ? 'C' : 'F'}
      </Text>
      <Text style={[styles.text, isDarkMode && styles.darkText]}>
        Velocidade do vento: {weather.windspeed} km/h
      </Text>
      <Text style={[styles.text, isDarkMode && styles.darkText]}>
        Código do clima: {weather.weathercode}
      </Text>
      <Text style={[styles.text, isDarkMode && styles.darkText]}>
        Horário: {weather.time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  darkContainer: { backgroundColor: '#1C1C1C' },
  title: { fontSize: 24, marginBottom: 10 },
  city: { fontSize: 20, color: '#4A90E2', marginBottom: 20 },
  text: { fontSize: 18, marginBottom: 10 },
  darkText: { color: '#fff' },
});