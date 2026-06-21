import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../../utils/theme';

const USUARIO_CORRETO = 'admin';
const SENHA_CORRETA = '1234';

export function LoginFuncionarioScreen() {
  const navigation = useNavigation<any>();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [lembrar, setLembrar] = useState(true);
  const [erro, setErro] = useState('');

  const handleEntrar = () => {
    const usuarioLimpo = usuario.trim();
    const senhaLimpa = senha.trim();

    if (!usuarioLimpo || !senhaLimpa) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (usuarioLimpo === USUARIO_CORRETO && senhaLimpa === SENHA_CORRETA) {
      setErro('');
      navigation.replace('TabFuncionario');
    } else {
      setErro('Usuário ou senha incorretos.');
    }
  };

  const handleEsqueciSenha = () => {
    // Troque por navigation.navigate('NomeDaTela') quando a tela de
    // recuperação de senha existir no seu app.
    Alert.alert(
      'Esqueci a senha',
      'Funcionalidade ainda não disponível. Procure o administrador do sistema.'
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.primary} />
        </TouchableOpacity>

        <View style={styles.topSection}>
          {/* Logo do URI Café */}
          <View style={styles.logoBox}>
            <Image
              source={require('../../../assets/images/logo_cafe.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Área Restrita</Text>
          <Text style={styles.subtitle}>Acesso exclusivo para funcionários</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>USUÁRIO</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholder="funcionario.uri"
                placeholderTextColor={Colors.muted}
                value={usuario}
                onChangeText={(t) => { setUsuario(t); setErro(''); }}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>SENHA</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.muted}
                value={senha}
                onChangeText={(t) => { setSenha(t); setErro(''); }}
                secureTextEntry={!senhaVisivel}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                <Text style={styles.linkText}>
                  {senhaVisivel ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {erro ? (
            <View style={styles.erroBox}>
              <Ionicons name="alert-circle-outline" size={16} color={Colors.delete} />
              <Text style={styles.erroText}>{erro}</Text>
            </View>
          ) : null}

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setLembrar(!lembrar)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, lembrar && styles.checkboxAtivo]}>
                {lembrar && <Ionicons name="checkmark" size={14} color={Colors.background} />}
              </View>
              <Text style={styles.checkboxLabel}>Lembrar de mim</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleEsqueciSenha}>
              <Text style={styles.linkText}>Esqueci a senha</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.btnEntrar}
            onPress={handleEntrar}
            activeOpacity={0.85}
          >
            <Text style={styles.btnEntrarText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  topSection: {
    alignItems: 'center',
    paddingBottom: Spacing.xxl,
    gap: Spacing.xs,
  },
  logoBox: {
    width: 88,
    height: 88,
    borderRadius: Radius.lg ?? 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  logoImage: {
    width: 56,
    height: 56,
  },
  title: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: Fonts.sizes.sm,
    color: Colors.accent,
    fontWeight: '500',
  },
  form: {
    gap: Spacing.lg,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: Fonts.sizes.xs,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg ?? 18,
    paddingHorizontal: Spacing.md,
    paddingVertical: 16,
  },
  input: {
    flex: 1,
    fontSize: Fonts.sizes.md,
    color: Colors.primary,
  },
  linkText: {
    fontSize: Fonts.sizes.sm,
    fontWeight: '700',
    color: Colors.accent,
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
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxAtivo: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.primary,
    fontWeight: '500',
  },
  btnEntrar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl ?? 30,
    paddingVertical: 18,
    marginTop: Spacing.sm,
  },
  btnEntrarText: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '700',
    color: Colors.background,
  },
});