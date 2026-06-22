import * as SQLite from 'expo-sqlite';
import { getDatabase } from './database';
import { Produto } from '../models';

async function salvarImagens(db: SQLite.SQLiteDatabase, produtoId: number, imagens?: string[]): Promise<void> {
  if (!imagens || imagens.length === 0) return;
  for (let i = 0; i < imagens.length; i++) {
    await db.runAsync(
      'INSERT INTO produto_imagens (produto_id, uri, ordem) VALUES (?, ?, ?)',
      [produtoId, imagens[i], i]
    );
  }
}

function mapRow(r: any): Produto {
  return {
    ...r,
    disponivel: r.disponivel === 1,
    destaque: r.destaque === 1,
    imagens: r.imagens_raw ? r.imagens_raw.split('||') : [],
  };
}

const SELECT_BASE = `
  SELECT p.*, c.nome as categoria_nome, c.cor as categoria_cor, c.icone as categoria_icone,
    (SELECT GROUP_CONCAT(uri, '||') FROM (
      SELECT uri FROM produto_imagens WHERE produto_id = p.id ORDER BY ordem
    )) as imagens_raw
  FROM produtos p
  LEFT JOIN categorias c ON p.categoria_id = c.id
`;

export const ProdutoDAO = {
  async listar(filtro?: string, categoriaId?: number, apenasDisponiveis = false): Promise<Produto[]> {
    const db = getDatabase();
    let query = SELECT_BASE + ' WHERE 1=1';
    const params: any[] = [];

    if (apenasDisponiveis) query += ' AND p.disponivel = 1';
    if (filtro) {
      query += ' AND (p.nome LIKE ? OR p.descricao LIKE ?)';
      params.push(`%${filtro}%`, `%${filtro}%`);
    }
    if (categoriaId) {
      query += ' AND p.categoria_id = ?';
      params.push(categoriaId);
    }
    query += ' ORDER BY p.nome';

    const rows = await db.getAllAsync<any>(query, params);
    return rows.map(mapRow);
  },

  async listarDestaques(): Promise<Produto[]> {
    const db = getDatabase();
    const rows = await db.getAllAsync<any>(
      SELECT_BASE + ' WHERE p.destaque = 1 AND p.disponivel = 1 ORDER BY p.nome'
    );
    return rows.map(mapRow);
  },

  async buscarPorId(id: number): Promise<Produto | null> {
    const db = getDatabase();
    const row = await db.getFirstAsync<any>(SELECT_BASE + ' WHERE p.id = ?', [id]);
    if (!row) return null;
    return mapRow(row);
  },

  async inserir(produto: Omit<Produto, 'id'>): Promise<number> {
    const db = getDatabase();
    const result = await db.runAsync(
      `INSERT INTO produtos (nome, descricao, preco, categoria_id, disponivel, destaque)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [produto.nome, produto.descricao, produto.preco, produto.categoria_id,
      produto.disponivel ? 1 : 0, produto.destaque ? 1 : 0]
    );
    const produtoId = result.lastInsertRowId;
    await salvarImagens(db, produtoId, produto.imagens);
    return produtoId;
  },

  async atualizar(produto: Produto): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      `UPDATE produtos SET nome = ?, descricao = ?, preco = ?,
       categoria_id = ?, disponivel = ?, destaque = ? WHERE id = ?`,
      [produto.nome, produto.descricao, produto.preco, produto.categoria_id,
      produto.disponivel ? 1 : 0, produto.destaque ? 1 : 0, produto.id!]
    );
    // mais simples recriar as fotos do que tentar comparar o que mudou
    await db.runAsync('DELETE FROM produto_imagens WHERE produto_id = ?', [produto.id!]);
    await salvarImagens(db, produto.id!, produto.imagens);
  },

  async toggleDisponivel(id: number): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      'UPDATE produtos SET disponivel = CASE WHEN disponivel = 1 THEN 0 ELSE 1 END WHERE id = ?',
      [id]
    );
  },

  async toggleDestaque(id: number): Promise<void> {
    const db = getDatabase();
    await db.runAsync(
      'UPDATE produtos SET destaque = CASE WHEN destaque = 1 THEN 0 ELSE 1 END WHERE id = ?',
      [id]
    );
  },

  async excluir(id: number): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM produto_imagens WHERE produto_id = ?', [id]);
    await db.runAsync('DELETE FROM produtos WHERE id = ?', [id]);
  },
};