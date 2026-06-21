import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius, Shadow } from '../../utils/theme';
import { useCategorias } from '../../viewmodels/useCategorias';
import { Categoria } from '../../models';
import { useFocusEffect } from '@react-navigation/native';
import { ConfirmModal } from '../../components/ConfirmModal';

const ICONES = ['cafe', 'fast-food', 'ice-cream', 'pizza', 'nutrition', 'beer', 'basket'] as const;
const CORES = [
  '#E07B39', '#3A8F5C', '#C8973A', '#3D1C02',
  '#8A6A5A', '#C0392B', '#2980B9', '#8E44AD',
  '#16A085', '#D35400', '#27AE60', '#2C3E50',
];

export function CategoriasScreen() {
  const { categorias, loading, carregar, salvar, excluir } = useCategorias();
  const [nome, setNome] = useState('');
  const [iconeSelecionado, setIconeSelecionado] = useState<string>('cafe');
  const [corSelecionada, setCorSelecionada] = useState(CORES[0]);
  const [modalExcluir, setModalExcluir] = useState<Categoria | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      carregar();
    }, [])
  );

  const handleSalvar = async () => {
    if (!nome.trim()) return;
    const ok = await salvar({ nome: nome.trim(), icone: iconeSelecionado, cor: corSelecionada });
    if (ok) setNome('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.pageTitle}>Categorias</Text>

      {loading ? (
        <ActivityIndicator color={Colors.primary} />
      ) : (
        categorias.map((cat) => (
          <View key={cat.id} style={styles.catRow}>
            <View style={[styles.iconBox, { backgroundColor: cat.cor + '22' }]}>
              <Ionicons name={cat.icone as any} size={22} color={cat.cor} />
            </View>
            <Text style={styles.catNome}>{cat.nome}</Text>
            <View style={[styles.corDot, { backgroundColor: cat.cor }]} />
            <TouchableOpacity style={styles.actionBtn} onPress={() => setModalExcluir(cat)}>
              <Ionicons name="trash-outline" size={18} color={Colors.delete} />
            </TouchableOpacity>
          </View>
        ))
      )}

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Nova Categoria</Text>
        <Text style={styles.formSubtitle}>Preencha os dados abaixo</Text>

        <Text style={styles.fieldLabel}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Sobremesas"
          placeholderTextColor={Colors.muted}
        />

        <Text style={styles.fieldLabel}>Ícone</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
          <View style={styles.iconesRow}>
            {ICONES.map((ic) => (
              <TouchableOpacity
                key={ic}
                style={[styles.iconeBtn, iconeSelecionado === ic && styles.iconeBtnActive]}
                onPress={() => setIconeSelecionado(ic)}
              >
                <Ionicons name={ic as any} size={22} color={iconeSelecionado === ic ? Colors.background : Colors.muted} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.fieldLabel}>Cor</Text>
        <View style={styles.coresRow}>
          {CORES.map((cor) => (
            <TouchableOpacity
              key={cor}
              style={[styles.corBtn, { backgroundColor: cor }, corSelecionada === cor && styles.corBtnActive]}
              onPress={() => setCorSelecionada(cor)}
            >
              {corSelecionada === cor && <Ionicons name="checkmark" size={16} color="#fff" />}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
          <Text style={styles.btnSalvarText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ConfirmModal
        visible={modalExcluir !== null}
        titulo="Excluir categoria"
        mensagem={`Deseja excluir "${modalExcluir?.nome}"?`}
        textoConfirmar="Excluir"
        icone="trash-outline"
        destrutivo
        onCancelar={() => setModalExcluir(null)}
        onConfirmar={() => {
          if (modalExcluir !== null) excluir(modalExcluir.id!);
          setModalExcluir(null);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.sm, paddingBottom: 40 },
  pageTitle: { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.primary, marginBottom: Spacing.sm },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md, ...Shadow.card },
  iconBox: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  catNome: { flex: 1, fontSize: Fonts.sizes.md, fontWeight: '700', color: Colors.primary },
  corDot: { width: 10, height: 10, borderRadius: 5 },
  actionBtn: { padding: 4 },
  formCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, marginTop: Spacing.md, ...Shadow.card, gap: Spacing.xs },
  formTitle: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.primary },
  formSubtitle: { fontSize: Fonts.sizes.sm, color: Colors.accent, marginBottom: Spacing.sm },
  fieldLabel: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.muted, marginTop: Spacing.sm },
  input: { backgroundColor: Colors.background, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.md, paddingVertical: 12, fontSize: Fonts.sizes.md, color: Colors.primary, marginTop: 4 },
  iconesRow: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: 4 },
  iconeBtn: { width: 48, height: 48, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border },
  iconeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  coresRow: { flexDirection: 'row', gap: Spacing.md, flexWrap: 'wrap', marginTop: 4 },
  corBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  corBtnActive: { borderWidth: 3, borderColor: Colors.primary },
  btnSalvar: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: 14, alignItems: 'center', marginTop: Spacing.md },
  btnSalvarText: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.background },
});