import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import { Colors, Fonts } from '../utils/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabFuncionario() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top', 'bottom']}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.muted,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ color, focused }) => {
            const icons: Record<string, string> = {
              Painel: focused ? 'grid' : 'grid-outline',
              Fila: focused ? 'list' : 'list-outline',
              Cardapio: focused ? 'restaurant' : 'restaurant-outline',
              Categorias: focused ? 'pricetag' : 'pricetag-outline',
            };
            return <Ionicons name={icons[route.name] as any} size={22} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Painel" component={PainelScreen} options={{ title: 'Painel' }} />
        <Tab.Screen name="Fila" component={FilaPedidosScreen} options={{ title: 'Fila' }} />
        <Tab.Screen name="Cardapio" component={CardapioGestaoScreen} options={{ title: 'Cardápio' }} />
        <Tab.Screen name="Categorias" component={CategoriasScreen} options={{ title: 'Categorias' }} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

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

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 6,
  },
  tabLabel: {
    fontSize: Fonts.sizes.xs,
    fontWeight: '600',
  },
}); 