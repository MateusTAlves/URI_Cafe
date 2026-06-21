import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/database/database';

export default function App() {
  const [pronto, setPronto] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    initDatabase()
      .then(() => {
        console.log('✅ Banco inicializado com sucesso!');
        setPronto(true);
      })
      .catch((e) => {
        console.log('❌ Erro:', e);
        setErro(String(e));
      });
  }, []);

  if (erro) {
    return (
      <View style={styles.center}>
        <Text style={styles.erroTitle}>Erro ao inicializar banco</Text>
        <Text style={styles.erroDesc}>{erro}</Text>
      </View>
    );
  }

  if (!pronto) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3D1C02" />
        <Text style={styles.loadingText}>Carregando URI Café...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: '#F5EDE4',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: '#8A6A5A',
  },
  erroTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#C0392B',
  },
  erroDesc: {
    fontSize: 13,
    color: '#8A6A5A',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});