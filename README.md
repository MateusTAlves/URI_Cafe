# URI Café ☕

Sistema de gestão de lancheria desenvolvido para a disciplina de **Desenvolvimento Mobile** da URI (Universidade Regional Integrada do Alto Uruguai e das Missões).

---

## Sobre o projeto

Aplicativo mobile com duas áreas distintas:

- **Área do Cliente** — visualiza o cardápio, adiciona itens ao carrinho e realiza pedidos
- **Área do Funcionário** — gerencia produtos, categorias e acompanha a fila de pedidos em tempo real

---

## Tecnologias

- React Native + Expo (SDK 54)
- TypeScript
- expo-sqlite — banco de dados local
- React Navigation — Stack, Bottom Tabs e Drawer
- Arquitetura MVVM com hooks como ViewModels

---

## Estrutura do projeto
URICafe/

├── App.tsx                          # Inicialização do banco e entrada do app

├── src/

│   ├── models/

│   │   └── index.ts                 # Interfaces TypeScript

│   ├── database/

│   │   ├── database.ts              # Criação das tabelas e seed inicial

│   │   ├── CategoriaDAO.ts          # CRUD de categorias

│   │   ├── ProdutoDAO.ts            # CRUD de produtos

│   │   └── PedidoDAO.ts             # CRUD de pedidos

│   ├── viewmodels/

│   │   ├── useCategorias.ts

│   │   ├── useProdutos.ts

│   │   └── usePedidos.ts

│   ├── screens/

│   │   ├── SplashScreen.tsx

│   │   ├── cliente/

│   │   │   ├── HomeClienteScreen.tsx

│   │   │   ├── CardapioScreen.tsx

│   │   │   ├── CarrinhoScreen.tsx

│   │   │   └── ConfirmacaoScreen.tsx

│   │   └── funcionario/

│   │       ├── LoginFuncionarioScreen.tsx

│   │       ├── PainelScreen.tsx

│   │       ├── FilaPedidosScreen.tsx

│   │       ├── DetalhePedidoScreen.tsx

│   │       ├── CardapioGestaoScreen.tsx

│   │       ├── ProdutoFormScreen.tsx

│   │       └── CategoriasScreen.tsx

│   ├── components/

│   │   ├── ConfirmModal.tsx

│   │   └── ProdutoCardImagem.tsx

│   ├── navigation/

│   │   └── AppNavigator.tsx

│   └── utils/

│       └── theme.ts

---

## Banco de dados

4 tabelas SQLite:

| Tabela | Descrição |
|---|---|
| `categorias` | Categorias do cardápio (nome, ícone, cor) |
| `produtos` | Produtos com preço, categoria, disponibilidade e destaque |
| `pedidos` | Pedidos com cliente, status e total |
| `itens_pedido` | Itens de cada pedido com quantidade e subtotal |

O banco é inicializado automaticamente na primeira execução com dados de exemplo (4 categorias e 8 produtos).

---

## Requisitos atendidos

- ✅ Label, TextInput, Button, Checkbox (Switch), RadioButton
- ✅ ImageView com carrossel de imagens nos cards de produto
- ✅ ListView/FlatList com busca em tempo real e filtros
- ✅ Toast/Snackbar nos feedbacks de ação
- ✅ Modal de confirmação antes de excluir
- ✅ Navigation Pages (Stack), Tabbed Pages (Bottom Tabs) e Flyout Pages (Drawer)
- ✅ CRUD completo — categorias, produtos e pedidos
- ✅ 3 tabelas com campos variados (texto, número, booleano)
- ✅ DAO para manipulação dos dados
- ✅ Arquitetura MVVM

---

## Como executar

### Pré-requisitos

- Node.js 18+
- Expo Go instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar o servidor
npx expo start
```

Escaneie o QR Code com o Expo Go para rodar no celular.

---

## Acesso ao sistema

| Área | Usuário | Senha |
|---|---|---|
| Funcionário | admin | 1234 |

---

## Desenvolvido por

Mateus — URI, 2026
