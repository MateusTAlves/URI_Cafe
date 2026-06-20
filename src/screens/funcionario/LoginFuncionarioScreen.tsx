// src/screens/funcionario/LoginFuncionarioScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Vibration } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow } from '../../utils/theme';

const SENHA_CORRETA = '1234';
const TECLAS = ['1','2','3','4','5','6','7','8','9','0'];

export function LoginFuncionarioScreen() {
  const navigation = useNavigation<any>();
  const [pin, setPin] = useState('');
  const [erro, setErro] = useState(false);

  const handleTecla = (tecla: string) => {
    if (pin.length >= 4) return;
    const novoPin = pin + tecla;
    setPin(novoPin);
    setErro(false);

    if (novoPin.length === 4) {
      setTimeout(() => {
        if (novoPin === SENHA_CORRETA) {
          navigation.replace('TabFuncionario');
        } else {
          Vibration.vibrate(300);
          setErro(true);
          setPin('');
        }
      }, 300);
    }
  };

  const handleApagar = () => {
    setPin((prev) => prev.slice(0, -1));
    setErro(false);
  };

  return (
    <View style={styles.container}>
      {/* Botão voltar */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={22} color={Colors.muted} />
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoBox}>
        <Image
          source={require('../../../assets/images/logo_cafe.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Área Restrita</Text>
      <Text style={styles.subtitle}>
        {erro ? '❌ Senha incorreta. Tente novamente.' : 'Digite a senha de acesso'}
      </Text>

      {/* Indicadores PIN */}
      <View style={styles.pinRow}>
        {[0,1,2,3].map((i) => (
          <View key={i} style={[styles.pinDot, pin.length > i && styles.pinDotFilled, erro && styles.pinDotErro]} />
        ))}
      </View>

      {/* Teclado */}
      <View style={styles.teclado}>
        {TECLAS.map((t) => (
          <TouchableOpacity key={t} style={styles.tecla} onPress={() => handleTecla(t)} activeOpacity={0.7}>
            <Text style={styles.teclaText}>{t}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.teclaVazia} />
        <TouchableOpacity style={styles.tecla} onPress={() => handleTecla('0')} activeOpacity={0.7}>
          <Text style={styles.teclaText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tecla} onPress={handleApagar} activeOpacity={0.7}>
          <Ionicons name="backspace-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.btnEntrar, pin.length < 4 && { opacity: 0.5 }]}
        onPress={() => handleTecla('')}
        disabled={pin.length < 4}
      >
        <Text style={styles.btnEntrarText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', padding: Spacing.xl, paddingTop: 60 },
  backBtn: { position: 'absolute', top: 50, left: Spacing.lg, padding: Spacing.sm },

  logoBox: {
    width: 150, height: 150, backgroundColor: 'transparent',
    borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center',
    padding: 16, ...Shadow.card, marginBottom: Spacing.lg,
  },
  logo: { width: 120, height: 120 },

  title: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  subtitle: { fontSize: Fonts.sizes.sm, color: Colors.muted, marginBottom: Spacing.xl },

  pinRow: { flexDirection: 'row', gap: Spacing.xl, marginBottom: Spacing.xl },
  pinDot: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: Colors.border, backgroundColor: 'transparent',
  },
  pinDotFilled: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  pinDotErro: { borderColor: Colors.delete, backgroundColor: Colors.delete },

  teclado: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', gap: Spacing.md,
    width: '80%', marginBottom: Spacing.xl,
  },
  tecla: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
    ...Shadow.card,
  },
  teclaText: { fontSize: Fonts.sizes.xl, fontWeight: '600', color: Colors.primary },
  teclaVazia: { width: 72, height: 72 },

  btnEntrar: {
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 14, paddingHorizontal: 60, alignItems: 'center',
  },
  btnEntrarText: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.background },
});
