import { useEffect, useState } from 'react';
import PedidoDAO from '../database/PedidoDAO';
import { Pedido } from '../models';

export default function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const load = () => {
    PedidoDAO.listar((rows) => setPedidos(rows));
  };

  useEffect(() => {
    load();
  }, []);

  const countsByStatus = () => {
    return pedidos.reduce((acc: Record<string, number>, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  return {
    pedidos,
    refresh: load,
    create: (p: Pedido) => PedidoDAO.inserir(p, load),
    updateStatus: (id: number, status: Pedido['status']) => PedidoDAO.atualizarStatus(id, status, load),
    remove: (id: number) => PedidoDAO.excluir(id, load),
    countsByStatus
  };
}
