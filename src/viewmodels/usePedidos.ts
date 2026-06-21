// src/viewmodels/usePedidos.ts
import { useState, useCallback } from 'react';
import { PedidoDAO } from '../database/PedidoDAO';
import { Pedido, ItemPedido, StatusPedido } from '../models';

export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFiltro, setStatusFiltro] = useState<StatusPedido | undefined>(undefined);
  const [contagem, setContagem] = useState<Record<StatusPedido, number>>({
    em_preparo: 0,
    pronto: 0,
    entregue: 0,
  });
  const [totalHoje, setTotalHoje] = useState(0);
  const [faturamento, setFaturamento] = useState(0);

  const carregar = useCallback(async (status?: StatusPedido) => {
    setLoading(true);
    setError(null);
    try {
      const [data, counts, hoje, fat] = await Promise.all([
        PedidoDAO.listar(status),
        PedidoDAO.contagemPorStatus(),
        PedidoDAO.totalHoje(),
        PedidoDAO.totalFaturamento(),
      ]);
      setPedidos(data);
      setContagem(counts);
      setTotalHoje(hoje);
      setFaturamento(fat);
    } catch {
      setError('Erro ao carregar pedidos.');
    } finally {
      setLoading(false);
    }
  }, []);

  const filtrarStatus = useCallback(async (status: StatusPedido | undefined) => {
    setStatusFiltro(status);
    await carregar(status);
  }, [carregar]);

  const criarPedido = useCallback(async (
    clienteNome: string,
    observacao: string,
    itens: Omit<ItemPedido, 'id' | 'pedido_id'>[]
  ): Promise<{ id: number; numero: number } | null> => {
    try {
      if (!clienteNome.trim()) { setError('Nome do cliente é obrigatório.'); return null; }
      if (itens.length === 0) { setError('Adicione pelo menos um item.'); return null; }

      const numero = await PedidoDAO.proximoNumero();
      const total = itens.reduce((s, i) => s + i.subtotal, 0);

      const id = await PedidoDAO.inserir(
        {
          numero,
          cliente_nome: clienteNome,
          status: 'em_preparo',
          observacao,
          total,
          data_criacao: new Date().toISOString(),
        },
        itens
      );

      await carregar(statusFiltro);
      return { id, numero };
    } catch {
      setError('Erro ao criar pedido.');
      return null;
    }
  }, [carregar, statusFiltro]);

  const atualizarStatus = useCallback(async (
    id: number,
    status: StatusPedido
  ): Promise<boolean> => {
    try {
      await PedidoDAO.atualizarStatus(id, status);
      await carregar(statusFiltro);
      return true;
    } catch {
      setError('Erro ao atualizar status.');
      return false;
    }
  }, [carregar, statusFiltro]);

  const excluir = useCallback(async (id: number): Promise<boolean> => {
    try {
      await PedidoDAO.excluir(id);
      await carregar(statusFiltro);
      return true;
    } catch {
      setError('Erro ao excluir pedido.');
      return false;
    }
  }, [carregar, statusFiltro]);

  const tempoRelativo = useCallback((dataISO: string): string => {
    const diff = Math.floor((Date.now() - new Date(dataISO).getTime()) / 60000);
    if (diff < 1) return 'agora';
    if (diff === 1) return 'há 1 min';
    if (diff < 60) return `há ${diff} min`;
    return `há ${Math.floor(diff / 60)}h`;
  }, []);

  return {
    pedidos, loading, error, statusFiltro, contagem, totalHoje, faturamento,
    carregar, filtrarStatus, criarPedido, atualizarStatus, excluir,
    tempoRelativo, setError,
  };
}
