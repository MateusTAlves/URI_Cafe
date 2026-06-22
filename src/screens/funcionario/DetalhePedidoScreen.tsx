import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Platform, ToastAndroid, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow, formatCurrency } from '../../utils/theme';
import { PedidoDAO } from '../../database/PedidoDAO';
import { Pedido, StatusPedido } from '../../models';
import { ConfirmModal } from '../../components/ConfirmModal';

function showToast(msg: string) {
  if (Platform.OS === 'android') ToastAndroid.show(msg, ToastAndroid.SHORT);
  else Alert.alert('', msg);
}

const STATUS_OPTIONS: { key: StatusPedido; label: string; icone: string }[] = [
  { key: 'em_preparo', label: 'Em preparo', icone: 'flame-outline' },
  { key: 'pronto', label: 'Pronto', icone: 'checkmark-circle-outline' },
  { key: 'entregue', label: 'Entregue', icone: 'cube-outline' },
];

const statusColors: Record<StatusPedido, string> = {
  em_preparo: Colors.preparing,
  pronto: Colors.ready,
  entregue: Colors.muted,
};

export function DetalhePedidoScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { pedidoId } = route.params;

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalExcluir, setModalExcluir] = useState(false);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    setLoading(true);
    const data = await PedidoDAO.buscarPorId(pedidoId);
    setPedido(data);
    setLoading(false);
  };

  const handleStatus = async (status: StatusPedido) => {
    if (!pedido) return;
    await PedidoDAO.atualizarStatus(pedido.id!, status);
    setPedido((prev) => prev ? { ...prev, status } : prev);
    showToast(`Status atualizado para "${STATUS_OPTIONS.find(s => s.key === status)?.label}"!`);
  };

  const handleExcluir = async () => {
    await PedidoDAO.excluir(pedidoId);
    setModalExcluir(false);
    showToast('Pedido excluído!');
    navigation.goBack();
  };

  if (loading) return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    </SafeAreaView>
  );

  if (!pedido) return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: Colors.muted }}>Pedido não encontrado.</Text>
      </View>
    </SafeAreaView>
  );

  const cor = statusColors[pedido.status];
  const statusAtual = STATUS_OPTIONS.find((s) => s.key === pedido.status);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll}>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={22} color={Colors.primary} />
        <Text style={styles.backText}>Pedido</Text>
      </TouchableOpacity>

      <View style={[styles.pedidoCard, { borderLeftColor: cor }]}>
        <View style={styles.pedidoTop}>
          <View>
            <Text style={styles.pedidoNumero}>#{String(pedido.numero).padStart(3, '0')}</Text>
            <Text style={styles.pedidoCliente}>{pedido.cliente_nome}</Text>
            <Text style={styles.pedidoData}>{new Date(pedido.data_criacao).toLocaleString('pt-BR')}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cor + '22' }]}>
            <Ionicons name={statusAtual?.icone as any} size={12} color={cor} />
            <Text style={[styles.statusText, { color: cor }]}>{statusAtual?.label}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ITENS DO PEDIDO</Text>
        {(pedido.itens ?? []).map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <View style={styles.qtdBadge}>
              <Text style={styles.qtdText}>{item.quantidade}×</Text>
            </View>
            <Text style={styles.itemNome}>{(item as any).produto_nome}</Text>
            <Text style={styles.itemSubtotal}>{formatCurrency(item.subtotal)}</Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.itemRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValor}>{formatCurrency(pedido.total)}</Text>
        </View>
      </View>

      {pedido.observacao ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>OBSERVAÇÃO</Text>
          <View style={styles.obsBox}>
            <Ionicons name="document-text-outline" size={16} color={Colors.accent} />
            <Text style={styles.obsText}>{pedido.observacao}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ATUALIZAR STATUS</Text>
        {STATUS_OPTIONS.map((opt) => {
          const ativo = pedido.status === opt.key;
          const c = statusColors[opt.key];
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.radioOption, ativo && { borderColor: c, backgroundColor: c + '11' }]}
              onPress={() => handleStatus(opt.key)}
            >
              <View style={[styles.radioOuter, { borderColor: ativo ? c : Colors.border }]}>
                {ativo && <View style={[styles.radioInner, { backgroundColor: c }]} />}
              </View>
              <Ionicons name={opt.icone as any} size={18} color={ativo ? c : Colors.muted} />
              <Text style={[styles.radioLabel, ativo && { color: c, fontWeight: '700' }]}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.btnExcluir} onPress={() => setModalExcluir(true)}>
        <Ionicons name="trash-outline" size={18} color={Colors.delete} />
        <Text style={styles.btnExcluirText}>Excluir Pedido</Text>
      </TouchableOpacity>

      <ConfirmModal
        visible={modalExcluir}
        titulo="Excluir pedido"
        mensagem="Deseja remover este pedido permanentemente?"
        textoConfirmar="Excluir"
        icone="trash-outline"
        destrutivo
        onCancelar={() => setModalExcluir(false)}
        onConfirmar={handleExcluir}
      />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxl },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.primary },
  pedidoCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, borderLeftWidth: 5, ...Shadow.card },
  pedidoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pedidoNumero: { fontSize: Fonts.sizes.xxl, fontWeight: '900', color: Colors.primary },
  pedidoCliente: { fontSize: Fonts.sizes.md, color: Colors.muted },
  pedidoData: { fontSize: Fonts.sizes.sm, color: Colors.muted },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full },
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
  obsBox: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, backgroundColor: Colors.accent + '18', borderRadius: Radius.md, padding: Spacing.md },
  obsText: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.primary, fontStyle: 'italic' },
  radioOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 2, borderColor: Colors.border },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 11, height: 11, borderRadius: 6 },
  radioLabel: { fontSize: Fonts.sizes.md, color: Colors.muted },
  btnExcluir: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, borderWidth: 1.5, borderColor: Colors.delete, borderRadius: Radius.md, paddingVertical: 14 },
  btnExcluirText: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.delete },
});