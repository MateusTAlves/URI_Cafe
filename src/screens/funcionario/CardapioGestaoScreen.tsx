// src/screens/funcionario/CardapioGestaoScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow, formatCurrency } from '../../utils/theme';

const CATEGORIAS = [
  { id: 0, nome: 'Todos' },
  { id: 1, nome: 'Lanches' },
  { id: 2, nome: 'Bebidas' },
  { id: 3, nome: 'Doces' },
];

const PRODUTOS_MOCK = [
  { id: 1, nome: 'Café Expresso', descricao: 'Grão arábica', preco: 4.50, categoriaId: 2, disponivel: true, cor: '#3D1C02' },
  { id: 2, nome: 'Cappuccino', descricao: 'Leite vaporizado', preco: 7.50, categoriaId: 2, disponivel: true, cor: '#3D1C02' },
  { id: 3, nome: 'X-Burguer', descricao: 'Pão, hambúrguer', preco: 12.90, categoriaId: 1, disponivel: false, cor: '#E07B39' },
  { id: 4, nome: 'Brownie', descricao: 'Chocolate belga', preco: 6.00, categoriaId: 3, disponivel: true, cor: '#C8973A' },
];

export function CardapioGestaoScreen() {
  const navigation = useNavigation<any>();
  const [catSelecionada, setCatSelecionada] = useState(0);
  const [produtos, setProdutos] = useState(PRODUTOS_MOCK);

  const toggleDisponivel = (id: number) => {
    setProdutos((prev) => prev.map((p) => p.id === id ? { ...p, disponivel: !p.disponivel } : p));
  };

  const filtrados = catSelecionada === 0 ? produtos : produtos.filter((p) => p.categoriaId === catSelecionada);

  const renderProduto = ({ item }: { item: typeof PRODUTOS_MOCK[0] }) => (
    <View style={styles.card}>
      <View style={[styles.cardImg, { backgroundColor: item.cor }]}>
        <Ionicons name="fast-food" size={36} color="#fff" />
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ProdutoForm', { produto: item })}>
            <Ionicons name="pencil" size={14} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="trash" size={14} color={Colors.delete} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.cardNome}>{item.nome}</Text>
      <Text style={styles.cardDesc} numberOfLines={1}>{item.descricao}</Text>
      <Text style={styles.cardPreco}>{formatCurrency(item.preco)}</Text>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Disponível</Text>
        <Switch
          value={item.disponivel}
          onValueChange={() => toggleDisponivel(item.id)}
          trackColor={{ false: Colors.border, true: Colors.ready }}
          thumbColor={Colors.white}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Cardápio</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContent}>
        {CATEGORIAS.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.catChip, catSelecionada === cat.id && styles.catChipActive]}
            onPress={() => setCatSelecionada(cat.id)}
          >
            <Text style={[styles.catText, catSelecionada === cat.id && styles.catTextActive]}>{cat.nome}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={renderProduto}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ProdutoForm', {})}>
        <Ionicons name="add" size={28} color={Colors.background} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, paddingBottom: Spacing.sm },
  pageTitle: { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.primary },
  catScroll: { marginTop: Spacing.md, minHeight: 56 },
  catContent: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, alignItems: 'center', paddingVertical: 10 },
  catChip: {
    paddingHorizontal: Spacing.lg, paddingVertical: 10,
    borderRadius: Radius.full, backgroundColor: Colors.white,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catText: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.muted },
  catTextActive: { color: Colors.background },

  list: { padding: Spacing.lg, paddingBottom: 100 },
  row: { justifyContent: 'space-between', marginBottom: Spacing.md },

  card: { width: '48%', backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.card },
  cardImg: { height: 100, alignItems: 'center', justifyContent: 'center' },
  cardActions: { position: 'absolute', top: 6, right: 6, flexDirection: 'row', gap: 4 },
  actionBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
  },
  cardNome: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.primary, padding: Spacing.sm, paddingBottom: 0 },
  cardDesc: { fontSize: Fonts.sizes.xs, color: Colors.muted, paddingHorizontal: Spacing.sm },
  cardPreco: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.accent, paddingHorizontal: Spacing.sm },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.sm, paddingBottom: Spacing.sm },
  switchLabel: { fontSize: Fonts.sizes.xs, color: Colors.muted },

  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center', ...Shadow.card,
  },
});
