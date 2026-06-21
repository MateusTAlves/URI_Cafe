import { getDatabase } from './database';
import { Categoria } from '../models';

export const CategoriaDAO = {
  async listar(): Promise<Categoria[]> {
    const db = getDatabase();
    return await db.getAllAsync<Categoria>(
      'SELECT * FROM categorias ORDER BY nome'
    );
  },

  async buscarPorId(id: number): Promise<Categoria | null> {
    const db = getDatabase();
    return await db.getFirstAsync<Categoria>(
      'SELECT * FROM categorias WHERE id = ?', [id]
    );
  },

  async inserir(categoria: Omit<Categoria, 'id'>): Promise<number> {
    const db = getDatabase();
    const result = await db.runAsync(
      'INSERT INTO categorias (nome, icone, cor) VALUES (?, ?, ?)',
      [categoria.nome, categoria.icone, categoria.cor]
    );
    return result.lastInsertRowId;
  },

  async atualizar(categoria: Categoria): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      'UPDATE categorias SET nome = ?, icone = ?, cor = ? WHERE id = ?',
      [categoria.nome, categoria.icone, categoria.cor, categoria.id!]
    );
  },

  async excluir(id: number): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM categorias WHERE id = ?', [id]);
  },

  async temProdutos(id: number): Promise<boolean> {
    const db = getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM produtos WHERE categoria_id = ?', [id]
    );
    return (result?.count ?? 0) > 0;
  },
};