import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow, formatCurrency } from '../../utils/theme';
import { useProdutos } from '../../viewmodels/useProdutos';
import { useCategorias } from '../../viewmodels/useCategorias';
import { Produto } from '../../models';

export function CardapioGestaoScreen() {
  const navigation = useNavigation<any>();
  const [catSelecionada, setCatSelecionada] = useState<number | undefined>(undefined);
  const { produtos, loading, carregar, toggleDisponivel, excluir } = useProdutos();
  const { categorias, carregar: carregarCats } = useCategorias();

  useFocusEffect(
    React.useCallback(() => {
      carregar(undefined, catSelecionada);
      carregarCats();
    }, [catSelecionada])
  );

  const handleExcluir = (id: number) => {
    Alert.alert('Excluir produto', 'Deseja remover este produto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluir(id) },
    ]);
  };

  const renderProduto = ({ item }: { item: Produto }) => (
    <View style={styles.card}>
      <View style={[styles.cardImg, { backgroundColor: item.categoria_cor ?? Colors.accent }]}>
        <Ionicons name="fast-food" size={36} color="#fff" />
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('ProdutoForm', { produto: item })}>
            <Ionicons name="pencil" size={14} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleExcluir(item.id!)}>
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
          onValueChange={() => toggleDisponivel(item.id!)}
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
        <TouchableOpacity
          style={[styles.catChip, catSelecionada === undefined && styles.catChipActive]}
          onPress={() => setCatSelecionada(undefined)}
        >
          <Text style={[styles.catText, catSelecionada === undefined && styles.catTextActive]}>Todos</Text>
        </TouchableOpacity>
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.catChip, catSelecionada === cat.id && styles.catChipActive]}
            onPress={() => setCatSelecionada(cat.id)}
          >
            <Text style={[styles.catText, catSelecionada === cat.id && styles.catTextActive]}>{cat.nome}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={renderProduto}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum produto encontrado.</Text>}
        />
      )}

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
  catScroll: { flexGrow: 0, flexShrink: 0 },
  catContent: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, gap: Spacing.sm, flexDirection: 'row' },
  catChip: { paddingHorizontal: Spacing.lg, paddingVertical: 10, borderRadius: Radius.full, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catText: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.muted },
  catTextActive: { color: Colors.background },
  list: { padding: Spacing.lg, paddingBottom: 100 },
  row: { justifyContent: 'space-between', marginBottom: Spacing.md },
  vazio: { fontSize: Fonts.sizes.md, color: Colors.muted, textAlign: 'center', paddingVertical: Spacing.xl },
  card: { width: '48%', backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.card },
  cardImg: { height: 100, alignItems: 'center', justifyContent: 'center' },
  cardActions: { position: 'absolute', top: 6, right: 6, flexDirection: 'row', gap: 4 },
  actionBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  cardNome: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.primary, padding: Spacing.sm, paddingBottom: 0 },
  cardDesc: { fontSize: Fonts.sizes.xs, color: Colors.muted, paddingHorizontal: Spacing.sm },
  cardPreco: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.accent, paddingHorizontal: Spacing.sm },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.sm, paddingBottom: Spacing.sm },
  switchLabel: { fontSize: Fonts.sizes.xs, color: Colors.muted },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center', ...Shadow.card },
});