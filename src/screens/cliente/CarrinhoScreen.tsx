import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow, formatCurrency } from '../../utils/theme';
import { usePedidos } from '../../viewmodels/usePedidos';
import { Produto } from '../../models';

interface ItemCarrinho {
  id: number;
  quantidade: number;
  produto: Produto;
}

export function CarrinhoScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { carrinho: carrinhoInicial = [] } = route.params ?? {};

  const [itens, setItens] = useState<ItemCarrinho[]>(carrinhoInicial);
  const [nome, setNome] = useState('');
  const [observacao, setObservacao] = useState('');
  const [salvando, setSalvando] = useState(false);
  const { criarPedido } = usePedidos();

  const handleVoltar = () => {
    navigation.navigate('Cardapio', { carrinhoAtualizado: itens });
  };

  const alterar = (id: number, delta: number) => {
    setItens((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx < 0) return prev;
      const novo = [...prev];
      const novaQtd = novo[idx].quantidade + delta;
      if (novaQtd <= 0) {
        novo.splice(idx, 1);
      } else {
        novo[idx] = { ...novo[idx], quantidade: novaQtd };
      }
      return novo;
    });
  };

  const total = itens.reduce((s, i) => s + i.produto.preco * i.quantidade, 0);
  const totalItens = itens.reduce((s, i) => s + i.quantidade, 0);

  const handleFazerPedido = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe seu nome para continuar.');
      return;
    }
    if (itens.length === 0) {
      Alert.alert('Atenção', 'Seu carrinho está vazio.');
      return;
    }

    setSalvando(true);
    const resultado = await criarPedido(
      nome.trim(),
      observacao.trim(),
      itens.map((i) => ({
        produto_id: i.produto.id!,
        quantidade: i.quantidade,
        subtotal: i.produto.preco * i.quantidade,
        produto_nome: i.produto.nome,
        produto_preco: i.produto.preco,
      }))
    );
    setSalvando(false);

    if (resultado) {
      navigation.navigate('Confirmacao', {
        numero: resultado.numero,
        clienteNome: nome.trim(),
        itens: itens.map((i) => ({
          quantidade: i.quantidade,
          produto: i.produto,
        })),
        total,
      });
    } else {
      Alert.alert('Erro', 'Não foi possível criar o pedido. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleVoltar} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Pedido</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {itens.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="cart-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
          </View>
        ) : (
          itens.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={[styles.itemIcon, { backgroundColor: item.produto.categoria_cor ?? Colors.primary }]}>
                <Ionicons name={(item.produto.categoria_icone as any) ?? 'fast-food'} size={18} color="#fff" />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemNome}>{item.produto.nome}</Text>
                <Text style={styles.itemPreco}>{formatCurrency(item.produto.preco * item.quantidade)}</Text>
              </View>
              <View style={styles.qtdControle}>
                <TouchableOpacity style={styles.qtdBtn} onPress={() => alterar(item.id, -1)}>
                  <Ionicons name="remove" size={16} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.qtdText}>{item.quantidade}</Text>
                <TouchableOpacity style={[styles.qtdBtn, styles.qtdBtnAdd]} onPress={() => alterar(item.id, 1)}>
                  <Ionicons name="add" size={16} color={Colors.background} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={styles.divider} />

        <Text style={styles.fieldLabel}>Seu nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Maria Silva"
          placeholderTextColor={Colors.muted}
        />

        <Text style={styles.fieldLabel}>Observações</Text>
        <TextInput
          style={[styles.input, styles.inputMulti]}
          value={observacao}
          onChangeText={setObservacao}
          placeholder="Sem cebola, sem molho..."
          placeholderTextColor={Colors.muted}
          multiline
          numberOfLines={3}
        />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal ({totalItens} itens)</Text>
          <Text style={styles.totalValorSub}>{formatCurrency(total)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabelBold}>Total</Text>
          <Text style={styles.totalValor}>{formatCurrency(total)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.btnPedido, (!nome.trim() || salvando) && { opacity: 0.5 }]}
          onPress={handleFazerPedido}
          disabled={!nome.trim() || salvando}
        >
          <Text style={styles.btnPedidoText}>
            {salvando ? 'Criando pedido...' : 'Fazer Pedido'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    padding: Spacing.lg, paddingTop: Spacing.xl,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadow.card,
  },
  headerTitle: { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.primary },
  scroll: { padding: Spacing.lg, gap: Spacing.sm, paddingBottom: 200 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: Fonts.sizes.md, color: Colors.muted },
  itemRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, ...Shadow.card,
  },
  itemIcon: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1 },
  itemNome: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.primary },
  itemPreco: { fontSize: Fonts.sizes.sm, color: Colors.muted, marginTop: 2 },
  qtdControle: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  qtdBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center',
  },
  qtdBtnAdd: { backgroundColor: Colors.primary },
  qtdText: {
    fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.primary,
    minWidth: 20, textAlign: 'center',
  },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  fieldLabel: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.muted, marginBottom: 4 },
  input: {
    backgroundColor: Colors.white, borderRadius: Radius.md, borderWidth: 1.5,
    borderColor: Colors.border, paddingHorizontal: Spacing.md, paddingVertical: 12,
    fontSize: Fonts.sizes.md, color: Colors.primary, marginBottom: Spacing.md,
  },
  inputMulti: { height: 80, textAlignVertical: 'top' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white, padding: Spacing.lg,
    borderTopWidth: 1, borderColor: Colors.border, gap: Spacing.xs,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: Fonts.sizes.sm, color: Colors.muted },
  totalValorSub: { fontSize: Fonts.sizes.sm, color: Colors.muted },
  totalLabelBold: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.primary },
  totalValor: { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.accent },
  btnPedido: {
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 14, alignItems: 'center', marginTop: Spacing.sm,
  },
  btnPedidoText: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.background },
});