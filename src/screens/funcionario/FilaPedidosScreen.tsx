// src/screens/funcionario/FilaPedidosScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow } from '../../utils/theme';

type Status = 'em_preparo' | 'pronto' | 'entregue';

const PEDIDOS_MOCK = [
  { id: 9, numero: 9, clienteNome: 'João Pedro', itens: '2× X-Burguer, 1× Café', status: 'em_preparo' as Status, tempo: 'há 2 min' },
  { id: 8, numero: 8, clienteNome: 'Ana Clara', itens: '1× Cappuccino, 1× Brownie', status: 'pronto' as Status, tempo: 'há 5 min' },
  { id: 7, numero: 7, clienteNome: 'Maria Silva', itens: '2× X-Burguer, 1× Café, 1× Brownie', status: 'em_preparo' as Status, tempo: 'há 7 min' },
  { id: 6, numero: 6, clienteNome: 'Lucas T.', itens: '1× Suco de Laranja', status: 'entregue' as Status, tempo: 'há 12 min' },
];

const STATUS_FILTROS = [
  { key: undefined, label: 'Todos' },
  { key: 'em_preparo', label: '🔥 Em preparo' },
  { key: 'pronto', label: '✅ Prontos' },
  { key: 'entregue', label: '📦 Entregue' },
];

const statusColors: Record<Status, string> = {
  em_preparo: Colors.preparing,
  pronto: Colors.ready,
  entregue: Colors.muted,
};

const statusLabels: Record<Status, string> = {
  em_preparo: 'Em preparo',
  pronto: 'Pronto',
  entregue: 'Entregue',
};

const STATUS_ORDER: Status[] = ['em_preparo', 'pronto', 'entregue'];

export function FilaPedidosScreen() {
  const navigation = useNavigation<any>();
  const [filtro, setFiltro] = useState<Status | undefined>(undefined);
  const [pedidos, setPedidos] = useState(PEDIDOS_MOCK);

  const pedidosFiltrados = filtro ? pedidos.filter((p) => p.status === filtro) : pedidos;

  const mudarStatus = (id: number, status: Status) => {
    setPedidos((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
  };

  const renderPedido = ({ item }: { item: typeof PEDIDOS_MOCK[0] }) => {
    const cor = statusColors[item.status];
    return (
      <TouchableOpacity
        style={[styles.card, { borderLeftColor: cor }]}
        onPress={() => navigation.navigate('DetalhePedido', { pedidoId: item.id })}
        activeOpacity={0.85}
      >
        <View style={styles.cardTop}>
          <View style={styles.cardTopLeft}>
            <Text style={styles.cardNumero}>#{String(item.numero).padStart(3, '0')}</Text>
            <View style={[styles.statusBadge, { backgroundColor: cor + '22' }]}>
              <Text style={[styles.statusBadgeText, { color: cor }]}>{statusLabels[item.status]}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setPedidos((prev) => prev.filter((p) => p.id !== item.id))}>
            <Ionicons name="trash-outline" size={18} color={Colors.delete} />
          </TouchableOpacity>
        </View>

        <Text style={styles.cardCliente}>{item.clienteNome}</Text>
        <Text style={styles.cardItens} numberOfLines={1}>{item.itens}</Text>
        <Text style={styles.cardTempo}>{item.tempo}</Text>

        {/* RadioGroup de status */}
        <View style={styles.radioRow}>
          {STATUS_ORDER.map((s) => {
            const ativo = item.status === s;
            const c = statusColors[s];
            return (
              <TouchableOpacity
                key={s}
                style={[styles.radioBtn, ativo && { backgroundColor: c, borderColor: c }]}
                onPress={() => mudarStatus(item.id, s)}
              >
                <Text style={[styles.radioBtnText, ativo && { color: Colors.white }]}>
                  {statusLabels[s]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Fila de Pedidos</Text>

      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtroScroll} contentContainerStyle={styles.filtroContent}>
        {STATUS_FILTROS.map((f) => (
          <TouchableOpacity
            key={String(f.key)}
            style={[styles.filtroChip, filtro === f.key && styles.filtroChipActive]}
            onPress={() => setFiltro(f.key as Status | undefined)}
          >
            <Text style={[styles.filtroText, filtro === f.key && styles.filtroTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={pedidosFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderPedido}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  pageTitle: { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.primary, padding: Spacing.lg, paddingBottom: Spacing.sm },

  filtroScroll: { maxHeight: 48 },
  filtroContent: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, alignItems: 'center' },
  filtroChip: {
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    borderRadius: Radius.full, backgroundColor: Colors.white,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  filtroChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filtroText: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.muted },
  filtroTextActive: { color: Colors.background },

  list: { padding: Spacing.lg, gap: Spacing.md },

  card: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, borderLeftWidth: 5, gap: 4, ...Shadow.card,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTopLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  cardNumero: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.primary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  statusBadgeText: { fontSize: Fonts.sizes.xs, fontWeight: '700' },
  cardCliente: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.primary },
  cardItens: { fontSize: Fonts.sizes.sm, color: Colors.accent },
  cardTempo: { fontSize: Fonts.sizes.xs, color: Colors.muted },

  radioRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  radioBtn: {
    flex: 1, paddingVertical: 6, borderRadius: Radius.full,
    borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center',
  },
  radioBtnText: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.muted },
});
