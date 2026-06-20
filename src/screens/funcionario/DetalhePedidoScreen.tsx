// src/screens/funcionario/DetalhePedidoScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow, formatCurrency } from '../../utils/theme';

type Status = 'em_preparo' | 'pronto' | 'entregue';

const STATUS_OPTIONS: { key: Status; label: string; icon: string }[] = [
  { key: 'em_preparo', label: '🔥 Em preparo', icon: 'flame' },
  { key: 'pronto', label: '✅ Pronto', icon: 'checkmark-circle' },
  { key: 'entregue', label: '📦 Entregue', icon: 'cube' },
];

const statusColors: Record<Status, string> = {
  em_preparo: Colors.preparing,
  pronto: Colors.ready,
  entregue: Colors.muted,
};

// Mock
const PEDIDO_MOCK = {
  numero: 7, clienteNome: 'Maria Silva', status: 'em_preparo' as Status,
  data: 'Hoje · 09:32', observacao: 'Sem cebola, sem molho extra.',
  itens: [
    { nome: 'X-Burguer', quantidade: 2, subtotal: 25.80 },
    { nome: 'Café Expresso', quantidade: 1, subtotal: 4.50 },
    { nome: 'Brownie', quantidade: 1, subtotal: 6.00 },
  ],
  total: 36.30,
};

export function DetalhePedidoScreen() {
  const navigation = useNavigation<any>();
  const [status, setStatus] = useState<Status>(PEDIDO_MOCK.status);
  const cor = statusColors[status];

  const handleExcluir = () => {
    Alert.alert(
      'Excluir pedido',
      'Deseja remover este pedido permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Cabeçalho */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={22} color={Colors.primary} />
        <Text style={styles.backText}>Pedido</Text>
      </TouchableOpacity>

      {/* Card do pedido */}
      <View style={[styles.pedidoCard, { borderLeftColor: cor }]}>
        <View style={styles.pedidoTop}>
          <View>
            <Text style={styles.pedidoNumero}>#{String(PEDIDO_MOCK.numero).padStart(3, '0')}</Text>
            <Text style={styles.pedidoCliente}>{PEDIDO_MOCK.clienteNome}</Text>
            <Text style={styles.pedidoData}>{PEDIDO_MOCK.data}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cor + '22' }]}>
            <Text style={[styles.statusText, { color: cor }]}>
              {STATUS_OPTIONS.find((s) => s.key === status)?.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Itens */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ITENS DO PEDIDO</Text>
        {PEDIDO_MOCK.itens.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <View style={styles.qtdBadge}>
              <Text style={styles.qtdText}>{item.quantidade}×</Text>
            </View>
            <Text style={styles.itemNome}>{item.nome}</Text>
            <Text style={styles.itemSubtotal}>{formatCurrency(item.subtotal)}</Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.itemRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValor}>{formatCurrency(PEDIDO_MOCK.total)}</Text>
        </View>
      </View>

      {/* Observação */}
      {PEDIDO_MOCK.observacao ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>OBSERVAÇÃO</Text>
          <View style={styles.obsBox}>
            <Ionicons name="document-text-outline" size={16} color={Colors.accent} />
            <Text style={styles.obsText}>{PEDIDO_MOCK.observacao}</Text>
          </View>
        </View>
      ) : null}

      {/* RadioGroup status */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ATUALIZAR STATUS</Text>
        {STATUS_OPTIONS.map((opt) => {
          const ativo = status === opt.key;
          const c = statusColors[opt.key];
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.radioOption, ativo && { borderColor: c, backgroundColor: c + '11' }]}
              onPress={() => setStatus(opt.key)}
            >
              <View style={[styles.radioOuter, { borderColor: ativo ? c : Colors.border }]}>
                {ativo && <View style={[styles.radioInner, { backgroundColor: c }]} />}
              </View>
              <Text style={[styles.radioLabel, ativo && { color: c, fontWeight: '700' }]}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Botão excluir */}
      <TouchableOpacity style={styles.btnExcluir} onPress={handleExcluir}>
        <Ionicons name="trash-outline" size={18} color={Colors.delete} />
        <Text style={styles.btnExcluirText}>Excluir Pedido</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 40 },

  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.primary },

  pedidoCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.lg, borderLeftWidth: 5, ...Shadow.card,
  },
  pedidoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pedidoNumero: { fontSize: Fonts.sizes.xxl, fontWeight: '900', color: Colors.primary },
  pedidoCliente: { fontSize: Fonts.sizes.md, color: Colors.muted },
  pedidoData: { fontSize: Fonts.sizes.sm, color: Colors.muted },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full },
  statusText: { fontSize: Fonts.sizes.xs, fontWeight: '700' },

  section: { gap: Spacing.sm },
  sectionLabel: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.muted, letterSpacing: 1.5 },

  itemRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 4 },
  qtdBadge: { backgroundColor: Colors.primary, borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  qtdText: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.background },
  itemNome: { flex: 1, fontSize: Fonts.sizes.md, color: Colors.primary },
  itemSubtotal: { fontSize: Fonts.sizes.md, color: Colors.muted },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  totalLabel: { flex: 1, fontSize: Fonts.sizes.md, fontWeight: '800', color: Colors.primary },
  totalValor: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.accent },

  obsBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    backgroundColor: Colors.accent + '18', borderRadius: Radius.md, padding: Spacing.md,
  },
  obsText: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.primary, fontStyle: 'italic' },

  radioOption: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 2, borderColor: Colors.border,
  },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 11, height: 11, borderRadius: 6 },
  radioLabel: { fontSize: Fonts.sizes.md, color: Colors.muted },

  btnExcluir: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    borderWidth: 1.5, borderColor: Colors.delete, borderRadius: Radius.md,
    paddingVertical: 14, marginTop: Spacing.sm,
  },
  btnExcluirText: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.delete },
});
