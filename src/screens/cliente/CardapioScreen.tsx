import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, FlatList, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow, formatCurrency } from '../../utils/theme';
import { useProdutos } from '../../viewmodels/useProdutos';
import { useCategorias } from '../../viewmodels/useCategorias';
import { Produto } from '../../models';

export function CardapioScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { produtos, loading, buscar, filtrarCategoria, categoriaFiltro } = useProdutos(true);
  const { categorias, carregar: carregarCategorias } = useCategorias();
  const [carrinho, setCarrinho] = useState<{ id: number; quantidade: number; produto: Produto }[]>([]);

  useEffect(() => {
    buscar('');
    carregarCategorias();
  }, []);

  // Recebe o carrinho atualizado vindo do CarrinhoScreen
  useEffect(() => {
    if (route.params?.carrinhoAtualizado) {
      setCarrinho(route.params.carrinhoAtualizado);
    }
  }, [route.params?.carrinhoAtualizado]);

  const totalItens = carrinho.reduce((s, i) => s + i.quantidade, 0);

  const adicionarAoCarrinho = (produto: Produto) => {
    setCarrinho((prev) => {
      const idx = prev.findIndex((i) => i.id === produto.id);
      if (idx >= 0) {
        const novo = [...prev];
        novo[idx] = { ...novo[idx], quantidade: novo[idx].quantidade + 1 };
        return novo;
      }
      return [...prev, { id: produto.id!, quantidade: 1, produto }];
    });
  };

  const renderProduto = ({ item }: { item: Produto }) => {
    const qtdNoCarrinho = carrinho.find((i) => i.id === item.id)?.quantidade ?? 0;
    return (
      <View style={styles.produtoCard}>
        <View style={[styles.produtoImg, { backgroundColor: item.categoria_cor ?? Colors.primary }]}>
          <Ionicons name={(item.categoria_icone as any) ?? 'restaurant'} size={36} color="#fff" />
        </View>
        <Text style={styles.produtoNome}>{item.nome}</Text>
        <Text style={styles.produtoDesc} numberOfLines={1}>{item.descricao}</Text>
        <Text style={styles.produtoPreco}>{formatCurrency(item.preco)}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => adicionarAoCarrinho(item)}>
          <Text style={styles.addBtnText}>
            {qtdNoCarrinho > 0 ? `+ Adicionar (${qtdNoCarrinho})` : '+ Adicionar'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cardápio</Text>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={Colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto..."
          placeholderTextColor={Colors.muted}
          onChangeText={buscar}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriasContent}
        style={styles.categoriasScroll}
      >
        <TouchableOpacity
          style={[
            styles.categoriaChip,
            !categoriaFiltro && { backgroundColor: Colors.primary, borderColor: Colors.primary },
          ]}
          onPress={() => filtrarCategoria(undefined)}
        >
          <Ionicons name="grid" size={14} color={!categoriaFiltro ? Colors.background : Colors.muted} />
          <Text style={[styles.categoriaText, !categoriaFiltro && styles.categoriaTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>

        {categorias.map((cat) => {
          const ativo = categoriaFiltro === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoriaChip,
                ativo && { backgroundColor: cat.cor, borderColor: cat.cor },
              ]}
              onPress={() => filtrarCategoria(cat.id)}
            >
              <Ionicons name={cat.icone as any} size={14} color={ativo ? Colors.background : Colors.muted} />
              <Text style={[styles.categoriaText, ativo && styles.categoriaTextActive]}>
                {cat.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          renderItem={renderProduto}
          showsVerticalScrollIndicator={false}
        />
      )}

      {totalItens > 0 && (
        <TouchableOpacity
          style={styles.carrinhoBadge}
          onPress={() => navigation.navigate('Carrinho', { carrinho })}
        >
          <Ionicons name="cart" size={24} color={Colors.background} />
          <View style={styles.badgeCount}>
            <Text style={styles.badgeCountText}>{totalItens}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadow.card,
  },
  headerTitle: { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.primary },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.white, marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
    borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: 10, ...Shadow.card,
  },
  searchInput: { flex: 1, fontSize: Fonts.sizes.md, color: Colors.primary },
  categoriasScroll: { flexGrow: 0, flexShrink: 0 },
  categoriasContent: {
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    gap: Spacing.sm, flexDirection: 'row',
  },
  categoriaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: Radius.full,
    backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border,
  },
  categoriaText: { fontSize: Fonts.sizes.sm, fontWeight: '600', color: Colors.muted },
  categoriaTextActive: { color: Colors.background },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: Spacing.lg, paddingBottom: 100 },
  row: { justifyContent: 'space-between', marginBottom: Spacing.md },
  produtoCard: {
    width: '48%', backgroundColor: Colors.white,
    borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.card,
  },
  produtoImg: { height: 110, alignItems: 'center', justifyContent: 'center' },
  produtoNome: {
    fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.primary,
    paddingHorizontal: Spacing.sm, paddingTop: Spacing.sm,
  },
  produtoDesc: { fontSize: Fonts.sizes.xs, color: Colors.accent, paddingHorizontal: Spacing.sm, paddingTop: 2 },
  produtoPreco: { fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.accent, paddingHorizontal: Spacing.sm, paddingTop: 4 },
  addBtn: {
    backgroundColor: Colors.primary, margin: Spacing.sm,
    borderRadius: Radius.md, paddingVertical: 8, alignItems: 'center',
  },
  addBtnText: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.background },
  carrinhoBadge: {
    position: 'absolute', bottom: 24, right: 24, width: 56, height: 56,
    borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center',
    justifyContent: 'center', ...Shadow.card, shadowOpacity: 0.3,
  },
  badgeCount: {
    position: 'absolute', top: -4, right: -4, width: 20, height: 20,
    borderRadius: 10, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  badgeCountText: { fontSize: Fonts.sizes.xs, fontWeight: '800', color: Colors.background },
});