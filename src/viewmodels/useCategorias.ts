// src/viewmodels/useCategorias.ts
import { useState, useCallback } from 'react';
import { CategoriaDAO } from '../database/CategoriaDAO';
import { Categoria } from '../models';

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CategoriaDAO.listar();
      setCategorias(data);
    } catch {
      setError('Erro ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  }, []);

  const salvar = useCallback(async (categoria: Categoria): Promise<boolean> => {
    try {
      if (!categoria.nome.trim()) { setError('Nome é obrigatório.'); return false; }
      if (categoria.id) {
        await CategoriaDAO.atualizar(categoria);
      } else {
        await CategoriaDAO.inserir(categoria);
      }
      await carregar();
      return true;
    } catch {
      setError('Erro ao salvar categoria.');
      return false;
    }
  }, [carregar]);

  const excluir = useCallback(async (id: number): Promise<boolean> => {
    try {
      const temProdutos = await CategoriaDAO.temProdutos(id);
      if (temProdutos) {
        setError('Essa categoria possui produtos. Remova-os antes de excluir.');
        return false;
      }
      await CategoriaDAO.excluir(id);
      await carregar();
      return true;
    } catch {
      setError('Erro ao excluir categoria.');
      return false;
    }
  }, [carregar]);

  return { categorias, loading, error, carregar, salvar, excluir, setError };
}
