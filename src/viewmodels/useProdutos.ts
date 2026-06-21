// src/viewmodels/useProdutos.ts
import { useState, useCallback } from 'react';
import { ProdutoDAO } from '../database/ProdutoDAO';
import { Produto } from '../models';

export function useProdutos(apenasDisponiveis = false) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [destaques, setDestaques] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltroState] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | undefined>(undefined);

  const carregar = useCallback(async (f?: string, catId?: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProdutoDAO.listar(f, catId, apenasDisponiveis);
      setProdutos(data);
    } catch {
      setError('Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  }, [apenasDisponiveis]);

  const carregarDestaques = useCallback(async () => {
    try {
      const data = await ProdutoDAO.listarDestaques();
      setDestaques(data);
    } catch {}
  }, []);

  const buscar = useCallback(async (texto: string) => {
    setFiltroState(texto);
    await carregar(texto, categoriaFiltro);
  }, [carregar, categoriaFiltro]);

  const filtrarCategoria = useCallback(async (catId: number | undefined) => {
    setCategoriaFiltro(catId);
    await carregar(filtro, catId);
  }, [carregar, filtro]);

  const salvar = useCallback(async (produto: Produto): Promise<boolean> => {
    try {
      if (!produto.nome.trim()) { setError('Nome é obrigatório.'); return false; }
      if (produto.preco <= 0) { setError('Preço deve ser maior que zero.'); return false; }
      if (!produto.categoria_id) { setError('Selecione uma categoria.'); return false; }
      if (produto.id) {
        await ProdutoDAO.atualizar(produto);
      } else {
        await ProdutoDAO.inserir(produto);
      }
      await carregar(filtro, categoriaFiltro);
      return true;
    } catch {
      setError('Erro ao salvar produto.');
      return false;
    }
  }, [carregar, filtro, categoriaFiltro]);

  const toggleDisponivel = useCallback(async (id: number): Promise<void> => {
    await ProdutoDAO.toggleDisponivel(id);
    await carregar(filtro, categoriaFiltro);
  }, [carregar, filtro, categoriaFiltro]);

  const excluir = useCallback(async (id: number): Promise<boolean> => {
    try {
      await ProdutoDAO.excluir(id);
      await carregar(filtro, categoriaFiltro);
      return true;
    } catch {
      setError('Erro ao excluir produto.');
      return false;
    }
  }, [carregar, filtro, categoriaFiltro]);

  return {
    produtos, destaques, loading, error, filtro, categoriaFiltro,
    carregar, carregarDestaques, buscar, filtrarCategoria,
    salvar, toggleDisponivel, excluir, setError,
  };
}
