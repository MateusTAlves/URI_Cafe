import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Fonts, Spacing, Radius } from '../../utils/theme';
import { useProdutos } from '../../viewmodels/useProdutos';
import { useCategorias } from '../../viewmodels/useCategorias';
import { Produto } from '../../models';

export function ProdutoFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const produtoEdicao: Produto | undefined = route.params?.produto;

  const { salvar } = useProdutos();
  const { categorias, carregar: carregarCats } = useCategorias();

  const [nome, setNome] = useState(produtoEdicao?.nome ?? '');
  const [descricao, setDescricao] = useState(produtoEdicao?.descricao ?? '');
  const [preco, setPreco] = useState(produtoEdicao?.preco?.toString() ?? '');
  const [categoriaId, setCategoriaId] = useState<number | null>(produtoEdicao?.categoria_id ?? null);
  const [disponivel, setDisponivel] = useState(produtoEdicao?.disponivel ?? true);
  const [destaque, setDestaque] = useState(produtoEdicao?.destaque ?? false);
  const [imagens, setImagens] = useState<string[]>(produtoEdicao?.imagens ?? []);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => { carregarCats(); }, []);

  const handleAdicionarImagem = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      setErro('Permita o acesso às fotos para adicionar uma imagem.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!resultado.canceled && resultado.assets?.[0]?.uri) {
      setImagens((prev) => [...prev, resultado.assets[0].uri]);
    }
  };

  const handleRemoverImagem = (uri: string) => {
    setImagens((prev) => prev.filter((i) => i !== uri));
  };

  const handleSalvar = async () => {
    setErro('');
    if (!nome.trim()) { setErro('Nome é obrigatório.'); return; }
    if (!preco || parseFloat(preco.replace(',', '.')) <= 0) { setErro('Preço inválido.'); return; }
    if (!categoriaId) { setErro('Selecione uma categoria.'); return; }

    setSalvando(true);
    const produto: Produto = {
      ...(produtoEdicao ?? {}),
      nome: nome.trim(),
      descricao: descricao.trim(),
      preco: parseFloat(preco.replace(',', '.')),
      categoria_id: categoriaId,
      disponivel,
      destaque,
      imagens,
    };

    const ok = await salvar(produto);
    setSalvando(false);
    if (ok) navigation.goBack();
    else setErro('Erro ao salvar produto.');
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={22} color={Colors.primary} />
        <Text style={styles.headerTitle}>{produtoEdicao ? 'Editar Produto' : 'Novo Produto'}</Text>
      </TouchableOpacity>

      <View style={styles.field}>
        <Text style={styles.label}>Nome do Produto</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: X-Salada" placeholderTextColor={Colors.muted} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput style={[styles.input, styles.inputMulti]} value={descricao} onChangeText={setDescricao} placeholder="Pão brioche, hambúrguer 120g..." placeholderTextColor={Colors.muted} multiline numberOfLines={3} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Preço (R$)</Text>
        <TextInput style={styles.input} value={preco} onChangeText={setPreco} placeholder="14,90" placeholderTextColor={Colors.muted} keyboardType="decimal-pad" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Fotos do Produto</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imagensRow}>
          {imagens.map((uri) => (
            <View key={uri} style={styles.imagemThumbWrap}>
              <Image source={{ uri }} style={styles.imagemThumb} />
              <TouchableOpacity style={styles.imagemRemoveBtn} onPress={() => handleRemoverImagem(uri)}>
                <Ionicons name="close" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addImagemBtn} onPress={handleAdicionarImagem}>
            <Ionicons name="camera-outline" size={22} color={Colors.muted} />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Categoria</Text>
        {categorias.map((cat) => {
          const ativo = categoriaId === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.radioOption,
                ativo && { borderColor: cat.cor, backgroundColor: cat.cor + '18' },
              ]}
              onPress={() => setCategoriaId(cat.id!)}
            >
              <View style={[styles.radioOuter, { borderColor: ativo ? cat.cor : Colors.border }]}>
                {ativo && <View style={[styles.radioInner, { backgroundColor: cat.cor }]} />}
              </View>
              <View style={[styles.catIconBox, { backgroundColor: cat.cor + '22' }]}>
                <Ionicons name={cat.icone as any} size={16} color={cat.cor} />
              </View>
              <Text style={[styles.radioLabel, ativo && { color: cat.cor, fontWeight: '700' }]}>{cat.nome}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.switchCard}>
        <Text style={styles.switchLabel}>Disponível no cardápio</Text>
        <Switch value={disponivel} onValueChange={setDisponivel} trackColor={{ false: Colors.border, true: Colors.ready }} thumbColor={Colors.white} />
      </View>

      <View style={styles.switchCard}>
        <Text style={styles.switchLabel}>Produto em destaque</Text>
        <Switch value={destaque} onValueChange={setDestaque} trackColor={{ false: Colors.border, true: Colors.accent }} thumbColor={Colors.white} />
      </View>

      {erro ? (
        <View style={styles.erroBox}>
          <Ionicons name="alert-circle-outline" size={16} color={Colors.delete} />
          <Text style={styles.erroText}>{erro}</Text>
        </View>
      ) : null}

      <TouchableOpacity style={[styles.btnSalvar, salvando && { opacity: 0.6 }]} onPress={handleSalvar} disabled={salvando}>
        {salvando ? <ActivityIndicator color={Colors.background} /> : <Text style={styles.btnSalvarText}>Salvar Produto</Text>}
      </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxl },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: Spacing.sm },
  headerTitle: { fontSize: Fonts.sizes.xl, fontWeight: '800', color: Colors.primary },
  field: { gap: Spacing.sm },
  label: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: Colors.white, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.md, paddingVertical: 12, fontSize: Fonts.sizes.md, color: Colors.primary },
  inputMulti: { height: 80, textAlignVertical: 'top' },
  imagensRow: { flexDirection: 'row', gap: Spacing.sm },
  imagemThumbWrap: { width: 70, height: 70, position: 'relative' },
  imagemThumb: { width: 70, height: 70, borderRadius: Radius.md },
  imagemRemoveBtn: {
    position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.delete, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.background,
  },
  addImagemBtn: {
    width: 70, height: 70, borderRadius: Radius.md, borderWidth: 1.5,
    borderColor: Colors.border, borderStyle: 'dashed', alignItems: 'center',
    justifyContent: 'center', backgroundColor: Colors.white,
  },
  radioOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1.5, borderColor: Colors.border },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  catIconBox: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  radioLabel: { flex: 1, fontSize: Fonts.sizes.md, color: Colors.muted },
  switchCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1.5, borderColor: Colors.border },
  switchLabel: { fontSize: Fonts.sizes.md, color: Colors.primary, fontWeight: '600' },
  erroBox: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: '#FEE2E2', borderRadius: Radius.sm, padding: Spacing.sm },
  erroText: { fontSize: Fonts.sizes.sm, color: Colors.delete, fontWeight: '600' },
  btnSalvar: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: 14, alignItems: 'center', marginTop: Spacing.md },
  btnSalvarText: { fontSize: Fonts.sizes.lg, fontWeight: '700', color: Colors.background },
});