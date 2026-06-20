// src/screens/funcionario/PainelScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow, formatCurrency, formatDate } from '../../utils/theme';

// Mock
const PEDIDOS_RECENTES = [
  { id: 9, numero: 9, clienteNome: 'João P.', status: 'em_preparo', tempo: 'há 2 min' },
  { id: 8, numero: 8, clienteNome: 'Ana C.', status: 'pronto', tempo: 'há 5 min' },
  { id: 7, numero: 7, clienteNome: 'Maria S.', status: 'em_preparo', tempo: 'há 7 min' },
  { id: 6, numero: 6, clienteNome: 'Lucas T.', status: 'entregue', tempo: 'há 12 min' },
];

const statusColors: Record<string, string> = {
  em_preparo: Colors.preparing,
  pronto: Colors.ready,
  entregue: Colors.muted,
};

const statusLabels: Record<string, string> = {
  em_preparo: 'Em preparo',
  pronto: 'Pronto',
  entregue: 'Entregue',
};

export function PainelScreen() {
  const navigation = useNavigation<any>();
  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.data}>{hoje.charAt(0).toUpperCase() + hoje.slice(1)}</Text>
          <Text style={styles.greeting}>Olá, URI Café 👋</Text>
        </View>
      </View>

      {/* Métricas */}
      <View style={styles.grid}>
        <View style={[styles.metricCard, { borderLeftColor: Colors.preparing }]}>
          <Ionicons name="flame" size={20} color={Colors.preparing} />
          <Text style={styles.metricNum}>5</Text>
          <Text style={styles.metricLabel}>Em preparo</Text>
        </View>
        <View style={[styles.metricCard, { borderLeftColor: Colors.ready }]}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.ready} />
          <Text style={styles.metricNum}>3</Text>
          <Text style={styles.metricLabel}>Prontos</Text>
        </View>
        <View style={[styles.metricCard, { borderLeftColor: Colors.primary }]}>
          <Ionicons name="receipt" size={20} color={Colors.primary} />
          <Text style={styles.metricNum}>42</Text>
          <Text style={styles.metricLabel}>Pedidos hoje</Text>
        </View>
        <View style={[styles.metricCard, { borderLeftColor: Colors.accent }]}>
          <Ionicons name="cash" size={20} color={Colors.accent} />
          <Text style={[styles.metricNum, { fontSize: Fonts.sizes.lg }]}>{formatCurrency(487)}</Text>
          <Text style={styles.metricLabel}>Faturamento</Text>
        </View>
      </View>

      {/* Últimos pedidos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimos Pedidos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Fila')}>
            <Text style={styles.verFila}>Ver fila</Text>
          </TouchableOpacity>
        </View>

        {PEDIDOS_RECENTES.map((pedido) => (
          <TouchableOpacity
            key={pedido.id}
            style={styles.pedidoRow}
            onPress={() => navigation.navigate('DetalhePedido', { pedidoId: pedido.id })}
          >
            <View style={styles.pedidoNumBox}>
              <Text style={styles.pedidoNum}>#{String(pedido.numero).padStart(3, '0')}</Text>
            </View>
            <View style={styles.pedidoInfo}>
              <Text style={styles.pedidoCliente}>{pedido.clienteNome}</Text>
              <Text style={styles.pedidoTempo}>{pedido.tempo}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColors[pedido.status] + '22' }]}>
              <Text style={[styles.statusText, { color: statusColors[pedido.status] }]}>
                {statusLabels[pedido.status]}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 40 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.md },
  data: { fontSize: Fonts.sizes.sm, color: Colors.muted },
  greeting: { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.primary },
  logoMini: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', ...Shadow.card },
  logoMiniImg: { width: 36, height: 36 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  metricCard: {
    flex: 1, minWidth: '45%', backgroundColor: Colors.white,
    borderRadius: Radius.md, padding: Spacing.md, borderLeftWidth: 4,
    gap: 4, ...Shadow.card,
  },
  metricNum: { fontSize: Fonts.sizes.xxl, fontWeight: '800', color: Colors.primary },
  metricLabel: { fontSize: Fonts.sizes.xs, color: Colors.muted, fontWeight: '600' },

  section: { gap: Spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.primary },
  verFila: { fontSize: Fonts.sizes.sm, color: Colors.accent, fontWeight: '600' },

  pedidoRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md, ...Shadow.card,
  },
  pedidoNumBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  pedidoNum: { fontSize: Fonts.sizes.sm, fontWeight: '800', color: Colors.primary },
  pedidoInfo: { flex: 1 },
  pedidoCliente: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.primary },
  pedidoTempo: { fontSize: Fonts.sizes.xs, color: Colors.muted },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  statusText: { fontSize: Fonts.sizes.xs, fontWeight: '700' },
});
