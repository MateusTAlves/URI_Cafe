// src/screens/funcionario/ProdutoFormScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow } from '../../utils/theme';

const CATEGORIAS = [
  { id: 1, nome: 'Lanches' },
  { id: 2, nome: 'Bebidas' },
  { id: 3, nome: 'Doces' },
  { id: 4, nome: 'Salgados' },
];

export function ProdutoFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const produtoEdicao = route.params?.produto;

  const [nome, setNome] = useState(produtoEdicao?.nome ?? '');
  const [descricao, setDescricao] = useState(produtoEdicao?.descricao ?? '');
  const [preco, setPreco] = useState(produtoEdicao?.preco?.toString() ?? '');
  const [categoriaId, setCategoriaId] = useState(produtoEdicao?.categoriaId ?? null);
  const [disponivel, setDisponivel] = useState(produtoEdicao?.disponivel ?? true);
  const [destaque, setDestaque] = useState(produtoEdicao?.destaque ?? false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={22} color={Colors.primary} />
        <Text style={styles.headerTitle}>{produtoEdicao ? 'Editar Produto' : 'Novo Produto'}</Text>
      </TouchableOpacity>

      {/* Nome */}
      <View style={styles.field}>
        <Text style={styles.label}>Nome do Produto</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: X-Salada" placeholderTextColor={Colors.muted} />
      </View>

      {/* Descrição */}
      <View style={styles.field}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput style={[styles.input, styles.inputMulti]} value={descricao} onChangeText={setDescricao} placeholder="Pão brioche, hambúrguer 120g..." placeholderTextColor={Colors.muted} multiline numberOfLines={3} />
      </View>

      {/* Preço */}
      <View style={styles.field}>
        <Text style={styles.label}>Preço (R$)</Text>
        <TextInput style={styles.input} value={preco} onChangeText={setPreco} placeholder="14,90" placeholderTextColor={Colors.muted} keyboardType="decimal-pad" />
      </View>

      {/* Categoria - RadioGroup */}
      <View style={styles.field}>
        <Text style={styles.label}>Categoria</Text>
        {CATEGORIAS.map((cat) => {
          const ativo = categoriaId === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.radioOption, ativo && styles.radioOptionActive]}
              onPress={() => setCategoriaId(cat.id)}
            >
              <View style={[styles.radioOuter, ativo && styles.radioOuterActive]}>
                {ativo && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.radioLabel, ativo && styles.radioLabelActive]}>{cat.nome}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Switches */}
      <View style={styles.switchCard}>
        <Text style={styles.switchLabel}>Disponível no cardápio</Text>
        <Switch value={disponivel} onValueChange={setDisponivel} trackColor={{ false: Colors.border, true: Colors.ready }} thumbColor={Colors.white} />
      </View>
      <View style={styles.switchCard}>
        <Text style={styles.switchLabel}>Produto em destaque</Text>
        <Switch value={destaque} onValueChange={setDestaque} trackColor={{ false: Colors.border, true: Colors.accent }} thumbColor={Colors.white} />
      </View>

      {/* Botão salvar */}
      <TouchableOpacity style={styles.btnSalvar} onPress={() => navigation.goBack()}>
        <Text style={styles.btnSalvarText}>Salvar Produto</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: 40 },

  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: Spacing.sm },
  headerTitle: { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.primary },

  field: { gap: Spacing.sm },
  label: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: Colors.white, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, paddingVertical: 12,
    fontSize: Fonts.sizes.md, color: Colors.primary,
  },
  inputMulti: { height: 80, textAlignVertical: 'top' },

  radioOption: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.white, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1.5, borderColor: Colors.border,
  },
  radioOptionActive: { borderColor: Colors.accent, backgroundColor: Colors.accent + '11' },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: Colors.accent },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.accent },
  radioLabel: { fontSize: Fonts.sizes.md, color: Colors.muted },
  radioLabelActive: { color: Colors.primary, fontWeight: '700' },

  switchCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  switchLabel: { fontSize: Fonts.sizes.md, color: Colors.primary, fontWeight: '600' },

  btnSalvar: {
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 14, alignItems: 'center', marginTop: Spacing.md,
  },
  btnSalvarText: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.background },
});
