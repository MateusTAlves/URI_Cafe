export interface Categoria {
  id?: number;
  nome: string;
}

export interface Produto {
  id?: number;
  nome: string;
  descricao?: string;
  preco: number;
  categoriaId?: number | null;
  disponivel?: boolean;
}

export interface ItemPedido {
  id?: number;
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
}

export interface Pedido {
  id?: number;
  clienteNome: string;
  status: 'PENDENTE' | 'EM_PREPARO' | 'ENTREGUE' | 'CANCELADO';
  total: number;
  itens?: ItemPedido[];
  criadoEm?: string;
}
