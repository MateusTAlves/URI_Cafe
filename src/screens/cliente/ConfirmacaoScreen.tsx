// src/screens/cliente/ConfirmacaoScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow, formatCurrency } from '../../utils/theme';

export function ConfirmacaoScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { numero, clienteNome, itens = [], total } = route.params ?? {};

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Ícone de sucesso */}
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={40} color={Colors.white} />
        </View>

        {/* Número do pedido */}
        <Text style={styles.labelNumero}>SEU NÚMERO</Text>
        <Text style={styles.numero}>#{String(numero).padStart(3, '0')}</Text>
        <Text style={styles.successTitle}>Pedido realizado com sucesso!</Text>
        <Text style={styles.clienteNome}>Cliente: {clienteNome}</Text>

        {/* Itens */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ITENS</Text>
          {itens.map((item: any, idx: number) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemNome}>{item.quantidade}× {item.produto?.nome}</Text>
              <Text style={styles.itemValor}>{formatCurrency((item.produto?.preco ?? 0) * item.quantidade)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.itemRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValor}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* Aviso de retirada */}
        <View style={styles.avisoBox}>
          <Ionicons name="notifications-outline" size={18} color={Colors.accent} />
          <Text style={styles.avisoText}>
            Retire na lancheria quando seu número for chamado 🎉
          </Text>
        </View>

      </ScrollView>

      {/* Botão voltar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btnVoltar}
          onPress={() => navigation.navigate('HomeCliente')}
        >
          <Text style={styles.btnVoltarText}>Voltar ao Início</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.xl, alignItems: 'center', gap: Spacing.md, paddingBottom: 120 },

  successIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.ready, alignItems: 'center', justifyContent: 'center',
    marginTop: Spacing.xl,
  },

  labelNumero: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.muted, letterSpacing: 2, marginTop: Spacing.md },
  numero: { fontSize: 48, fontWeight: '900', color: Colors.primary },
  successTitle: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.primary },
  clienteNome: { fontSize: Fonts.sizes.sm, color: Colors.muted },

  card: {
    width: '100%', backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.lg, gap: Spacing.sm, ...Shadow.card, marginTop: Spacing.md,
  },
  cardLabel: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.muted, letterSpacing: 1.5 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between' },
  itemNome: { fontSize: Fonts.sizes.md, color: Colors.primary },
  itemValor: { fontSize: Fonts.sizes.md, color: Colors.muted },
  divider: { height: 1, backgroundColor: Colors.border },
  totalLabel: { fontSize: Fonts.sizes.md, fontWeight: '800', color: Colors.primary },
  totalValor: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.accent },

  avisoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    backgroundColor: Colors.accent + '22', borderRadius: Radius.md,
    padding: Spacing.md, width: '100%',
  },
  avisoText: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.primary, lineHeight: 20 },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, padding: Spacing.lg,
    borderTopWidth: 1, borderColor: Colors.border,
  },
  btnVoltar: {
    borderWidth: 2, borderColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 14, alignItems: 'center',
  },
  btnVoltarText: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.primary },
});
