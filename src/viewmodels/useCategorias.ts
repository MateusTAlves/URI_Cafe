import { useEffect, useState } from 'react';
import CategoriaDAO from '../database/CategoriaDAO';
import { Categoria } from '../models';

export default function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const load = () => {
    CategoriaDAO.listar((rows) => setCategorias(rows));
  };

  useEffect(() => {
    load();
  }, []);

  return {
    categorias,
    refresh: load,
    add: (c: Categoria) => CategoriaDAO.inserir(c, load),
    update: (c: Categoria) => CategoriaDAO.atualizar(c, load),
    remove: (id: number) => CategoriaDAO.excluir(id, load),
    hasProducts: (id: number, cb: (tem: boolean) => void) => CategoriaDAO.temProdutos(id, cb)
  };
}
