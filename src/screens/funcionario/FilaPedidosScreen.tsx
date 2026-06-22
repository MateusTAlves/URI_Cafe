import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, ActivityIndicator, Platform, ToastAndroid, Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow } from '../../utils/theme';
import { usePedidos } from '../../viewmodels/usePedidos';
import { StatusPedido } from '../../models';
import { ConfirmModal } from '../../components/ConfirmModal';

function showToast(msg: string) {
  if (Platform.OS === 'android') ToastAndroid.show(msg, ToastAndroid.SHORT);
  else Alert.alert('', msg);
}

const STATUS_FILTROS: { key: StatusPedido | undefined; label: string; icone: string }[] = [
  { key: undefined, label: 'Todos', icone: 'grid-outline' },
  { key: 'em_preparo', label: 'Em preparo', icone: 'flame-outline' },
  { key: 'pronto', label: 'Prontos', icone: 'checkmark-circle-outline' },
  { key: 'entregue', label: 'Entregue', icone: 'cube-outline' },
];

const statusColors: Record<StatusPedido, string> = {
  em_preparo: Colors.preparing,
  pronto: Colors.ready,
  entregue: Colors.muted,
};

const statusLabels: Record<StatusPedido, string> = {
  em_preparo: 'Em preparo',
  pronto: 'Pronto',
  entregue: 'Entregue',
};

const statusIcones: Record<StatusPedido, string> = {
  em_preparo: 'flame-outline',
  pronto: 'checkmark-circle-outline',
  entregue: 'cube-outline',
};

const STATUS_ORDER: StatusPedido[] = ['em_preparo', 'pronto', 'entregue'];

export function FilaPedidosScreen() {
  const navigation = useNavigation<any>();
  const { pedidos, loading, statusFiltro, filtrarStatus, atualizarStatus, excluir, tempoRelativo } = usePedidos();
  const [modalExcluir, setModalExcluir] = useState<number | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      filtrarStatus(undefined);
    }, [])
  );

  const handleAtualizarStatus = async (id: number, status: StatusPedido) => {
    await atualizarStatus(id, status);
    showToast(`Status atualizado para "${statusLabels[status]}"!`);
  };

  const handleExcluir = async () => {
    if (modalExcluir !== null) {
      await excluir(modalExcluir);
      showToast('Pedido excluído!');
      setModalExcluir(null);
    }
  };

  const renderPedido = ({ item }: { item: typeof pedidos[0] }) => {
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
              <Ionicons name={statusIcones[item.status] as any} size={11} color={cor} />
              <Text style={[styles.statusBadgeText, { color: cor }]}>{statusLabels[item.status]}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setModalExcluir(item.id!)}>
            <Ionicons name="trash-outline" size={18} color={Colors.delete} />
          </TouchableOpacity>
        </View>

        <Text style={styles.cardCliente}>{item.cliente_nome}</Text>
        <Text style={styles.cardTempo}>{tempoRelativo(item.data_criacao)}</Text>

        <View style={styles.radioRow}>
          {STATUS_ORDER.map((s) => {
            const ativo = item.status === s;
            const c = statusColors[s];
            return (
              <TouchableOpacity
                key={s}
                style={[styles.radioBtn, ativo && { backgroundColor: c, borderColor: c }]}
                onPress={() => handleAtualizarStatus(item.id!, s)}
              >
                <Ionicons name={statusIcones[s] as any} size={13} color={ativo ? Colors.white : Colors.muted} />
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtroScroll} contentContainerStyle={styles.filtroContent}>
        {STATUS_FILTROS.map((f) => {
          const ativo = statusFiltro === f.key;
          return (
            <TouchableOpacity
              key={String(f.key)}
              style={[styles.filtroChip, ativo && styles.filtroChipActive]}
              onPress={() => filtrarStatus(f.key)}
            >
              <Ionicons name={f.icone as any} size={13} color={ativo ? Colors.background : Colors.muted} />
              <Text style={[styles.filtroText, ativo && styles.filtroTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderPedido}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum pedido encontrado.</Text>}
        />
      )}

      <ConfirmModal
        visible={modalExcluir !== null}
        titulo="Excluir pedido"
        mensagem="Deseja remover este pedido permanentemente?"
        textoConfirmar="Excluir"
        icone="trash-outline"
        destrutivo
        onCancelar={() => setModalExcluir(null)}
        onConfirmar={handleExcluir}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  pageTitle: { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.primary, padding: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  filtroScroll: { flexGrow: 0, flexShrink: 0 },
  filtroContent: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingVertical: Spacing.sm, flexDirection: 'row' },
  filtroChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border },
  filtroChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filtroText: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.muted },
  filtroTextActive: { color: Colors.background },
  list: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxl },
  vazio: { fontSize: Fonts.sizes.md, color: Colors.muted, textAlign: 'center', paddingVertical: Spacing.xl },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, borderLeftWidth: 5, gap: 4, ...Shadow.card },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTopLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  cardNumero: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.primary },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  statusBadgeText: { fontSize: Fonts.sizes.xs, fontWeight: '700' },
  cardCliente: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.primary },
  cardTempo: { fontSize: Fonts.sizes.xs, color: Colors.muted },
  radioRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  radioBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.border },
  radioBtnText: { fontSize: Fonts.sizes.xs, fontWeight: '700', color: Colors.muted },
});