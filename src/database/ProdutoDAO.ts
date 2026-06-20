import db from './database';
import { Produto } from '../models';

export default {
  listar: (search = '', categoriaId?: number, callback?: (rows: Produto[]) => void) => {
    db.transaction(tx => {
      let sql = 'SELECT * FROM produtos';
      const params: any[] = [];
      const where: string[] = [];
      if (search) {
        where.push('(nome LIKE ? OR descricao LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
      }
      if (categoriaId) {
        where.push('categoriaId = ?');
        params.push(categoriaId);
      }
      if (where.length) sql += ' WHERE ' + where.join(' AND ');
      tx.executeSql(sql, params, (_, { rows }) => {
        // @ts-ignore
        callback?.(rows._array);
      });
    });
  },

  buscarPorId: (id: number, callback: (p?: Produto) => void) => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM produtos WHERE id = ?', [id], (_, { rows }) => {
        // @ts-ignore
        callback(rows._array[0]);
      });
    });
  },

  inserir: (produto: Produto, callback?: () => void) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO produtos (nome, descricao, preco, categoriaId, disponivel) VALUES (?, ?, ?, ?, ?)',
        [produto.nome, produto.descricao || '', produto.preco, produto.categoriaId || null, produto.disponivel ? 1 : 0],
        () => callback?.()
      );
    });
  },

  atualizar: (produto: Produto, callback?: () => void) => {
    if (!produto.id) return;
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, categoriaId = ?, disponivel = ? WHERE id = ?',
        [produto.nome, produto.descricao || '', produto.preco, produto.categoriaId || null, produto.disponivel ? 1 : 0, produto.id],
        () => callback?.()
      );
    });
  },

  excluir: (id: number, callback?: () => void) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM produtos WHERE id = ?', [id], () => callback?.());
    });
  }
};
