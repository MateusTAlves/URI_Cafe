// src/screens/cliente/CardapioScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow, formatCurrency } from '../../utils/theme';

const CATEGORIAS = [
  { id: 0, nome: 'Todos', icone: 'grid' },
  { id: 1, nome: 'Lanches', icone: 'fast-food' },
  { id: 2, nome: 'Bebidas', icone: 'cafe' },
  { id: 3, nome: 'Doces', icone: 'ice-cream' },
  { id: 4, nome: 'Salgados', icone: 'pizza' },
];

const PRODUTOS = [
  { id: 1, nome: 'Café Expresso', descricao: 'Grão arábica torra média', preco: 4.50, categoriaId: 2, cor: '#3D1C02' },
  { id: 2, nome: 'Cappuccino', descricao: 'Espresso, leite, canela', preco: 7.50, categoriaId: 2, cor: '#3D1C02' },
  { id: 3, nome: 'X-Burguer', descricao: 'Pão, hambúrguer, queijo', preco: 12.90, categoriaId: 1, cor: '#E07B39' },
  { id: 4, nome: 'Brownie', descricao: 'Chocolate belga', preco: 6.00, categoriaId: 3, cor: '#C8973A' },
  { id: 5, nome: 'Coxinha', descricao: 'Frango com catupiry', preco: 5.00, categoriaId: 4, cor: '#8A6A5A' },
  { id: 6, nome: 'Suco de Laranja', descricao: 'Natural 300ml', preco: 6.50, categoriaId: 2, cor: '#E07B39' },
];

export function CardapioScreen() {
  const navigation = useNavigation<any>();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(0);
  const [busca, setBusca] = useState('');
  const [carrinho, setCarrinho] = useState<{ id: number; quantidade: number }[]>([]);

  const totalItens = carrinho.reduce((s, i) => s + i.quantidade, 0);

  const produtosFiltrados = PRODUTOS.filter((p) => {
    const matchCategoria = categoriaSelecionada === 0 || p.categoriaId === categoriaSelecionada;
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  const adicionarAoCarrinho = (produtoId: number) => {
    setCarrinho((prev) => {
      const idx = prev.findIndex((i) => i.id === produtoId);
      if (idx >= 0) {
        const novo = [...prev];
        novo[idx] = { ...novo[idx], quantidade: novo[idx].quantidade + 1 };
        return novo;
      }
      return [...prev, { id: produtoId, quantidade: 1 }];
    });
  };

  const renderProduto = ({ item }: { item: typeof PRODUTOS[0] }) => (
    <View style={styles.produtoCard}>
      <View style={[styles.produtoImg, { backgroundColor: item.cor }]}>
        <Ionicons name="fast-food" size={36} color="#fff" />
      </View>
      <Text style={styles.produtoNome}>{item.nome}</Text>
      <Text style={styles.produtoDesc} numberOfLines={1}>{item.descricao}</Text>
      <Text style={styles.produtoPreco}>{formatCurrency(item.preco)}</Text>
      <TouchableOpacity style={styles.addBtn} onPress={() => adicionarAoCarrinho(item.id)}>
        <Text style={styles.addBtnText}>+ Adicionar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cardápio</Text>
      </View>

      {/* Busca */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={Colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produto..."
          placeholderTextColor={Colors.muted}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {/* Categorias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriasContent}
        style={styles.categoriasScroll}
      >
        {CATEGORIAS.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoriaChip,
              categoriaSelecionada === cat.id && styles.categoriaChipActive,
            ]}
            onPress={() => setCategoriaSelecionada(cat.id)}
          >
            <Ionicons
              name={cat.icone as any}
              size={14}
              color={categoriaSelecionada === cat.id ? Colors.background : Colors.muted}
            />
            <Text style={[
              styles.categoriaText,
              categoriaSelecionada === cat.id && styles.categoriaTextActive,
            ]}>
              {cat.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Grid de produtos */}
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={renderProduto}
        showsVerticalScrollIndicator={false}
      />

      {/* Badge do carrinho */}
      {totalItens > 0 && (
        <TouchableOpacity
          style={styles.carrinhoBadge}
          onPress={() => navigation.navigate('Carrinho', { carrinho, produtos: PRODUTOS })}
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  headerTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: '800',
    color: Colors.primary,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    ...Shadow.card,
  },
  searchInput: {
    flex: 1,
    fontSize: Fonts.sizes.md,
    color: Colors.primary,
  },

  categoriasScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  categoriasContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    flexDirection: 'row',
  },
  categoriaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  categoriaChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoriaText: {
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
    color: Colors.muted,
  },
  categoriaTextActive: {
    color: Colors.background,
  },

  listContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },

  produtoCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.card,
  },
  produtoImg: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  produtoNome: {
    fontSize: Fonts.sizes.md,
    fontWeight: '700',
    color: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  produtoDesc: {
    fontSize: Fonts.sizes.xs,
    color: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingTop: 2,
  },
  produtoPreco: {
    fontSize: Fonts.sizes.md,
    fontWeight: '700',
    color: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingTop: 4,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    margin: Spacing.sm,
    borderRadius: Radius.md,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: Fonts.sizes.sm,
    fontWeight: '700',
    color: Colors.background,
  },

  carrinhoBadge: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
    shadowOpacity: 0.3,
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCountText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: '800',
    color: Colors.background,
  },
});