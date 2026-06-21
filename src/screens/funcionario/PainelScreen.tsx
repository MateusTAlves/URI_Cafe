import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow, formatCurrency } from '../../utils/theme';
import { usePedidos } from '../../viewmodels/usePedidos';

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

const statusIcons: Record<string, string> = {
  em_preparo: 'flame',
  pronto: 'checkmark-circle',
  entregue: 'bag-check',
};

export function PainelScreen() {
  const navigation = useNavigation<any>();
  const { pedidos, contagem, totalHoje, faturamento, loading, carregar, tempoRelativo } = usePedidos();

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long',
  });

  useFocusEffect(
    React.useCallback(() => {
      carregar();
    }, [])
  );

  const pedidosRecentes = pedidos.slice(0, 4);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>

      <View style={styles.header}>
        <Text style={styles.data}>{hoje.charAt(0).toUpperCase() + hoje.slice(1)}</Text>
        <Text style={styles.greeting}>Olá, URI Café 👋</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} />
      ) : (
        <>
          <View style={styles.metricsRow}>
            <View style={[styles.metricCardBig, { backgroundColor: Colors.primary }]}>
              <View style={styles.metricIconBox}>
                <Ionicons name="receipt" size={20} color={Colors.accent} />
              </View>
              <Text style={[styles.metricNum, { color: Colors.background }]}>{totalHoje}</Text>
              <Text style={[styles.metricLabel, { color: Colors.background, opacity: 0.6 }]}>Pedidos hoje</Text>
            </View>

            <View style={[styles.metricCardBig, { backgroundColor: Colors.accent }]}>
              <View style={[styles.metricIconBox, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Ionicons name="cash" size={20} color={Colors.white} />
              </View>
              <Text style={[styles.metricNum, { color: Colors.white, fontSize: Fonts.sizes.xl }]}>{formatCurrency(faturamento)}</Text>
              <Text style={[styles.metricLabel, { color: Colors.white, opacity: 0.7 }]}>Faturamento</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={[styles.metricCardSmall, { borderLeftColor: Colors.preparing }]}>
              <Ionicons name="flame" size={18} color={Colors.preparing} />
              <Text style={styles.metricNumSmall}>{contagem.em_preparo}</Text>
              <Text style={styles.metricLabelSmall}>Em preparo</Text>
            </View>
            <View style={[styles.metricCardSmall, { borderLeftColor: Colors.ready }]}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.ready} />
              <Text style={styles.metricNumSmall}>{contagem.pronto}</Text>
              <Text style={styles.metricLabelSmall}>Prontos</Text>
            </View>
            <View style={[styles.metricCardSmall, { borderLeftColor: Colors.muted }]}>
              <Ionicons name="bag-check" size={18} color={Colors.muted} />
              <Text style={styles.metricNumSmall}>{contagem.entregue}</Text>
              <Text style={styles.metricLabelSmall}>Entregues</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Últimos Pedidos</Text>
              <TouchableOpacity style={styles.verFilaBtn} onPress={() => navigation.navigate('Fila')}>
                <Text style={styles.verFilaText}>Ver fila</Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.accent} />
              </TouchableOpacity>
            </View>

            {pedidosRecentes.length === 0 ? (
              <Text style={styles.vazio}>Nenhum pedido ainda.</Text>
            ) : (
              pedidosRecentes.map((pedido) => (
                <TouchableOpacity
                  key={pedido.id}
                  style={styles.pedidoRow}
                  onPress={() => navigation.navigate('DetalhePedido', { pedidoId: pedido.id })}
                  activeOpacity={0.8}
                >
                  <View style={[styles.pedidoNumBox, { backgroundColor: Colors.primary + '12' }]}>
                    <Text style={styles.pedidoNum}>#{String(pedido.numero).padStart(3, '0')}</Text>
                  </View>
                  <View style={styles.pedidoInfo}>
                    <Text style={styles.pedidoCliente}>{pedido.cliente_nome}</Text>
                    <Text style={styles.pedidoTempo}>{tempoRelativo(pedido.data_criacao)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColors[pedido.status] + '18' }]}>
                    <Ionicons name={statusIcons[pedido.status] as any} size={12} color={statusColors[pedido.status]} />
                    <Text style={[styles.statusText, { color: statusColors[pedido.status] }]}>
                      {statusLabels[pedido.status]}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.border} />
                </TouchableOpacity>
              ))
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 40 },
  header: { paddingTop: Spacing.md, gap: 4 },
  data: { fontSize: Fonts.sizes.sm, color: Colors.muted },
  greeting: { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.primary },
  metricsRow: { flexDirection: 'row', gap: Spacing.sm },
  metricCardBig: { flex: 1, borderRadius: Radius.lg, padding: Spacing.md, gap: 6, ...Shadow.card },
  metricIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  metricNum: { fontSize: Fonts.sizes.xxl, fontWeight: '800' },
  metricLabel: { fontSize: Fonts.sizes.xs, fontWeight: '600' },
  metricCardSmall: { flex: 1, backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md, borderLeftWidth: 3, gap: 3, ...Shadow.card },
  metricNumSmall: { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.primary },
  metricLabelSmall: { fontSize: Fonts.sizes.xs, color: Colors.muted, fontWeight: '600' },
  section: { gap: Spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.primary },
  verFilaBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verFilaText: { fontSize: Fonts.sizes.sm, color: Colors.accent, fontWeight: '600' },
  vazio: { fontSize: Fonts.sizes.md, color: Colors.muted, textAlign: 'center', paddingVertical: Spacing.xl },
  pedidoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md, ...Shadow.card },
  pedidoNumBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  pedidoNum: { fontSize: Fonts.sizes.sm, fontWeight: '800', color: Colors.primary },
  pedidoInfo: { flex: 1 },
  pedidoCliente: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.primary },
  pedidoTempo: { fontSize: Fonts.sizes.xs, color: Colors.muted },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full },
  statusText: { fontSize: Fonts.sizes.xs, fontWeight: '700' },
});