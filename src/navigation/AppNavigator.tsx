import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Modal, Animated, Dimensions, TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { SplashScreen } from '../screens/SplashScreen';
import { HomeClienteScreen } from '../screens/cliente/HomeClienteScreen';
import { CardapioScreen } from '../screens/cliente/CardapioScreen';
import { CarrinhoScreen } from '../screens/cliente/CarrinhoScreen';
import { ConfirmacaoScreen } from '../screens/cliente/ConfirmacaoScreen';
import { LoginFuncionarioScreen } from '../screens/funcionario/LoginFuncionarioScreen';
import { PainelScreen } from '../screens/funcionario/PainelScreen';
import { FilaPedidosScreen } from '../screens/funcionario/FilaPedidosScreen';
import { DetalhePedidoScreen } from '../screens/funcionario/DetalhePedidoScreen';
import { CardapioGestaoScreen } from '../screens/funcionario/CardapioGestaoScreen';
import { ProdutoFormScreen } from '../screens/funcionario/ProdutoFormScreen';
import { CategoriasScreen } from '../screens/funcionario/CategoriasScreen';
import { Colors, Fonts, Spacing, Radius } from '../utils/theme';

const Stack = createNativeStackNavigator();
const DRAWER_WIDTH = Dimensions.get('window').width * 0.75;

// ─── Drawer customizado ───────────────────────────────────────────────────────

interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

function CustomDrawer({ visible, onClose, onNavigate }: DrawerProps) {
  const navigation = useNavigation<any>();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -DRAWER_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const itens = [
    { nome: 'Painel', icone: 'grid-outline', tab: 'Painel' },
    { nome: 'Fila de Pedidos', icone: 'list-outline', tab: 'Fila' },
    { nome: 'Cardápio', icone: 'restaurant-outline', tab: 'Cardapio' },
    { nome: 'Categorias', icone: 'pricetag-outline', tab: 'Categorias' },
  ];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.drawerOverlay} />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        {/* Header */}
        <View style={styles.drawerHeader}>
          <Image
            source={require('../../assets/images/logo_cafe.png')}
            style={styles.drawerLogo}
            resizeMode="contain"
          />
          <Text style={styles.drawerTitulo}>URI Café</Text>
          <Text style={styles.drawerSubtitulo}>Área do Funcionário</Text>
        </View>

        {/* Menu */}
        <View style={styles.drawerMenu}>
          {itens.map((item) => (
            <TouchableOpacity
              key={item.nome}
              style={styles.drawerItem}
              onPress={() => {
                onClose();
                onNavigate(item.tab);
              }}
            >
              <Ionicons name={item.icone as any} size={22} color={Colors.accent} />
              <Text style={styles.drawerItemText}>{item.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sair */}
        <TouchableOpacity
          style={styles.drawerSair}
          onPress={() => {
            onClose();
            navigation.navigate('HomeCliente');
          }}
        >
          <Ionicons name="exit-outline" size={22} color={Colors.delete} />
          <Text style={styles.drawerSairText}>Sair</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

// ─── Tabs + Drawer do Funcionário ─────────────────────────────────────────────

const TELAS: Record<string, React.ComponentType<any>> = {
  Painel: PainelScreen,
  Fila: FilaPedidosScreen,
  Cardapio: CardapioGestaoScreen,
  Categorias: CategoriasScreen,
};

const TABS = [
  { nome: 'Painel', icone: 'grid', iconeOutline: 'grid-outline', label: 'Painel' },
  { nome: 'Fila', icone: 'list', iconeOutline: 'list-outline', label: 'Fila' },
  { nome: 'Cardapio', icone: 'restaurant', iconeOutline: 'restaurant-outline', label: 'Cardápio' },
  { nome: 'Categorias', icone: 'pricetag', iconeOutline: 'pricetag-outline', label: 'Categorias' },
];

function TabFuncionario() {
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('Painel');

  const TelaAtiva = TELAS[abaAtiva];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setDrawerAberto(true)} style={styles.headerBtn}>
          <Ionicons name="menu" size={26} color={Colors.background} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>URI Café</Text>
        <View style={styles.headerBtn} />
      </View>

      {/* Drawer */}
      <CustomDrawer
        visible={drawerAberto}
        onClose={() => setDrawerAberto(false)}
        onNavigate={(tab) => setAbaAtiva(tab)}
      />

      {/* Conteúdo da aba ativa */}
      <View style={{ flex: 1 }}>
        <TelaAtiva />
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const ativo = abaAtiva === tab.nome;
          return (
            <TouchableOpacity
              key={tab.nome}
              style={styles.tabItem}
              onPress={() => setAbaAtiva(tab.nome)}
            >
              <Ionicons
                name={(ativo ? tab.icone : tab.iconeOutline) as any}
                size={22}
                color={ativo ? Colors.primary : Colors.muted}
              />
              <Text style={[styles.tabLabel, { color: ativo ? Colors.primary : Colors.muted }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// ─── Navigator Principal ──────────────────────────────────────────────────────

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="HomeCliente" component={HomeClienteScreen} />
        <Stack.Screen name="Cardapio" component={CardapioScreen} />
        <Stack.Screen name="Carrinho" component={CarrinhoScreen} />
        <Stack.Screen name="Confirmacao" component={ConfirmacaoScreen} />
        <Stack.Screen name="LoginFuncionario" component={LoginFuncionarioScreen} />
        <Stack.Screen name="TabFuncionario" component={TabFuncionario} />
        <Stack.Screen name="DetalhePedido" component={DetalhePedidoScreen} />
        <Stack.Screen name="ProdutoForm" component={ProdutoFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '800',
    color: Colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: Fonts.sizes.xs,
    fontWeight: '600',
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: Colors.background,
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  drawerHeader: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  drawerLogo: {
    width: 80,
    height: 80,
    marginBottom: Spacing.sm,
  },
  drawerTitulo: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: '800',
    color: Colors.background,
  },
  drawerSubtitulo: {
    fontSize: Fonts.sizes.sm,
    color: Colors.background,
    opacity: 0.6,
  },
  drawerMenu: {
    flex: 1,
    padding: Spacing.lg,
    gap: Spacing.sm,
    paddingTop: Spacing.xl,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
  },
  drawerItemText: {
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    color: Colors.primary,
  },
  drawerSair: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    margin: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.delete + '44',
    backgroundColor: Colors.delete + '0A',
  },
  drawerSairText: {
    fontSize: Fonts.sizes.md,
    fontWeight: '700',
    color: Colors.delete,
  },
});