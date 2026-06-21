import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, StatusBar, ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow, formatCurrency } from '../../utils/theme';
import { useProdutos } from '../../viewmodels/useProdutos';

export function HomeClienteScreen() {
  const navigation = useNavigation<any>();
  const { destaques, carregarDestaques, loading } = useProdutos(true);

  useFocusEffect(useCallback(() => {
    carregarDestaques();
  }, []));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.logoArea}>
          <View style={styles.logoBox}>
            <Image
              source={require('../../../assets/images/logo_cafe.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.tagline}>Peça agora, retire na lancheria</Text>
        </View>

        <TouchableOpacity
          style={styles.btnCardapio}
          onPress={() => navigation.navigate('Cardapio')}
          activeOpacity={0.85}
        >
          <Ionicons name="restaurant-outline" size={20} color={Colors.background} />
          <Text style={styles.btnCardapioText}>Ver Cardápio</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Destaques do dia</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cardapio')}>
              <Text style={styles.verTodos}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.destaquesScroll}>
              {destaques.map((item) => (
                <View key={item.id} style={styles.destaqueCard}>
                  <View style={[styles.destaqueImg, { backgroundColor: item.categoria_cor ?? Colors.primary }]}>
                    <Ionicons name={(item.categoria_icone as any) ?? 'restaurant'} size={32} color="#fff" />
                  </View>
                  <Text style={styles.destaqueNome}>{item.nome}</Text>
                  <View style={styles.destaqueFooter}>
                    <Text style={styles.destaquePreco}>{formatCurrency(item.preco)}</Text>
                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={() => navigation.navigate('Cardapio')}
                    >
                      <Ionicons name="add" size={18} color={Colors.background} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.spacer} />

        <TouchableOpacity
          style={styles.funcLink}
          onPress={() => navigation.navigate('LoginFuncionario')}
        >
          <Text style={styles.funcLinkText}>Área do Funcionário</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.xl,
  },
  logoArea: { alignItems: 'center', gap: Spacing.md },
  logoBox: {
    width: 180, height: 180, backgroundColor: 'transparent',
    borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center',
    padding: 16, ...Shadow.card,
  },
  logo: { width: 140, height: 140 },
  tagline: { fontSize: Fonts.sizes.md, color: Colors.muted, letterSpacing: 0.2 },
  btnCardapio: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 16, width: '100%', ...Shadow.card,
  },
  btnCardapioText: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.background },
  section: { width: '100%', gap: Spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.primary },
  verTodos: { fontSize: Fonts.sizes.sm, color: Colors.accent, fontWeight: '600' },
  destaquesScroll: { marginHorizontal: -Spacing.lg },
  destaqueCard: {
    width: 140, backgroundColor: Colors.white, borderRadius: Radius.lg,
    marginLeft: Spacing.lg, overflow: 'hidden', ...Shadow.card,
  },
  destaqueImg: { height: 100, alignItems: 'center', justifyContent: 'center' },
  destaqueNome: {
    fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.primary,
    padding: Spacing.sm, paddingBottom: 0,
  },
  destaqueFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: Spacing.sm,
  },
  destaquePreco: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.accent },
  addBtn: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  spacer: { flex: 1 },
  funcLink: { marginBottom: Spacing.sm },
  funcLinkText: { fontSize: Fonts.sizes.sm, color: Colors.muted, textDecorationLine: 'underline' },
});