export interface Categoria {
  id?: number;
  nome: string;
  icone: string;
  cor: string;
}

export interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria_id: number;
  categoria_nome?: string;
  categoria_cor?: string;
  disponivel: boolean;
  destaque: boolean;
}

export type StatusPedido = 'em_preparo' | 'pronto' | 'entregue';

export interface ItemPedido {
  id?: number;
  pedido_id?: number;
  produto_id: number;
  produto_nome?: string;
  produto_preco?: number;
  quantidade: number;
  subtotal: number;
}

export interface Pedido {
  id?: number;
  numero: number;
  cliente_nome: string;
  status: StatusPedido;
  observacao?: string;
  total: number;
  data_criacao: string;
  itens?: ItemPedido[];
}