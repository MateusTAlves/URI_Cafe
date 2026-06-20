import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProdutosScreen from '../screens/produtos/ProdutosScreen';
import ProdutoFormScreen from '../screens/produtos/ProdutoFormScreen';
import CategoriasScreen from '../screens/categorias/CategoriasScreen';
import PedidosScreen from '../screens/pedidos/PedidosScreen';
import NovoPedidoScreen from '../screens/pedidos/NovoPedidoScreen';
import PedidoDetalheScreen from '../screens/pedidos/PedidoDetalheScreen';

const Drawer = createDrawerNavigator();
const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ProdutosStack(){
  return (
    <Stack.Navigator>
      <Stack.Screen name="Produtos" component={ProdutosScreen} />
      <Stack.Screen name="ProdutoForm" component={ProdutoFormScreen} />
    </Stack.Navigator>
  );
}

function PedidosStack(){
  return (
    <Stack.Navigator>
      <Stack.Screen name="Pedidos" component={PedidosScreen} />
      <Stack.Screen name="NovoPedido" component={NovoPedidoScreen} />
      <Stack.Screen name="PedidoDetalhe" component={PedidoDetalheScreen} />
    </Stack.Navigator>
  );
}

function TabsNavigator(){
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Produtos" component={ProdutosStack} />
      <Tabs.Screen name="Pedidos" component={PedidosStack} />
    </Tabs.Navigator>
  );
}

export default function AppNavigator(){
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Main" component={TabsNavigator} />
      <Drawer.Screen name="Categorias" component={CategoriasScreen} />
    </Drawer.Navigator>
  );
}
