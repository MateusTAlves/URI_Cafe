import db from './database';
import { Categoria } from '../models';

export default {
  listar: (callback: (rows: Categoria[]) => void) => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM categorias', [], (_, { rows }) => {
        // @ts-ignore
        callback(rows._array);
      });
    });
  },

  buscarPorId: (id: number, callback: (cat?: Categoria) => void) => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM categorias WHERE id = ?', [id], (_, { rows }) => {
        // @ts-ignore
        callback(rows._array[0]);
      });
    });
  },

  inserir: (categoria: Categoria, callback?: () => void) => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO categorias (nome) VALUES (?)', [categoria.nome], () => {
        callback?.();
      });
    });
  },

  atualizar: (categoria: Categoria, callback?: () => void) => {
    if (!categoria.id) return;
    db.transaction(tx => {
      tx.executeSql('UPDATE categorias SET nome = ? WHERE id = ?', [categoria.nome, categoria.id], () => {
        callback?.();
      });
    });
  },

  excluir: (id: number, callback?: () => void) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM categorias WHERE id = ?', [id], () => {
        callback?.();
      });
    });
  },

  temProdutos: (categoriaId: number, callback: (tem: boolean) => void) => {
    db.transaction(tx => {
      tx.executeSql('SELECT COUNT(*) as c FROM produtos WHERE categoriaId = ?', [categoriaId], (_, { rows }) => {
        // @ts-ignore
        callback(rows._array[0].c > 0);
      });
    });
  }
};
