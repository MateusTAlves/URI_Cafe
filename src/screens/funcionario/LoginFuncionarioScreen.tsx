// src/screens/funcionario/LoginFuncionarioScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow } from '../../utils/theme';

const USUARIO_CORRETO = 'admin';
const SENHA_CORRETA = '1234';

export function LoginFuncionarioScreen() {
  const navigation = useNavigation<any>();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erro, setErro] = useState('');

  const handleEntrar = () => {
    if (!usuario || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (usuario === USUARIO_CORRETO && senha === SENHA_CORRETA) {
      setErro('');
      navigation.replace('TabFuncionario');
    } else {
      setErro('Usuário ou senha incorretos.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Botão voltar */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.background} />
        </TouchableOpacity>

        {/* Topo escuro com título */}
        <View style={styles.topSection}>
          <View style={styles.iconBox}>
            <Ionicons name="lock-closed" size={32} color={Colors.accent} />
          </View>
          <Text style={styles.title}>Área Restrita</Text>
          <Text style={styles.subtitle}>Acesso exclusivo para funcionários</Text>
        </View>

        {/* Card de formulário */}
        <View style={styles.card}>
          {/* Campo usuário */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Usuário</Text>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={18} color={Colors.muted} />
              <TextInput
                style={styles.input}
                placeholder="Digite seu usuário"
                placeholderTextColor={Colors.muted}
                value={usuario}
                onChangeText={(t) => { setUsuario(t); setErro(''); }}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Campo senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputBox}>
              <Ionicons name="key-outline" size={18} color={Colors.muted} />
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor={Colors.muted}
                value={senha}
                onChangeText={(t) => { setSenha(t); setErro(''); }}
                secureTextEntry={!senhaVisivel}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                <Ionicons
                  name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={Colors.muted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Erro */}
          {erro ? (
            <View style={styles.erroBox}>
              <Ionicons name="alert-circle-outline" size={16} color={Colors.delete} />
              <Text style={styles.erroText}>{erro}</Text>
            </View>
          ) : null}

          {/* Botão entrar */}
          <TouchableOpacity style={styles.btnEntrar} onPress={handleEntrar} activeOpacity={0.85}>
            <Text style={styles.btnEntrarText}>Entrar</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.background} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.primary,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: Spacing.lg,
    zIndex: 10,
    padding: Spacing.sm,
  },

  topSection: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(200,151,58,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(200,151,58,0.3)',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: '800',
    color: Colors.background,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: Fonts.sizes.sm,
    color: Colors.background,
    opacity: 0.5,
  },

  card: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: Spacing.xl,
    gap: Spacing.lg,
    paddingTop: Spacing.xxl,
  },

  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: Fonts.sizes.sm,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 4,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    fontSize: Fonts.sizes.md,
    color: Colors.primary,
  },

  erroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: '#FEE2E2',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  erroText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.delete,
    fontWeight: '600',
  },

  btnEntrar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 16,
    marginTop: Spacing.sm,
  },
  btnEntrarText: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '700',
    color: Colors.background,
  },
});