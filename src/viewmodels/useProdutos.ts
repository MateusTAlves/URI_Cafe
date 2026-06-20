import { useEffect, useState } from 'react';
import ProdutoDAO from '../database/ProdutoDAO';
import { Produto } from '../models';

export default function useProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [search, setSearch] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined);

  const load = () => {
    ProdutoDAO.listar(search, categoriaId, (rows) => setProdutos(rows));
  };

  useEffect(() => {
    load();
  }, [search, categoriaId]);

  return {
    produtos,
    search,
    setSearch,
    categoriaId,
    setCategoriaId,
    refresh: load,
    add: (p: Produto) => ProdutoDAO.inserir(p, load),
    update: (p: Produto) => ProdutoDAO.atualizar(p, load),
    remove: (id: number) => ProdutoDAO.excluir(id, load)
  };
}
