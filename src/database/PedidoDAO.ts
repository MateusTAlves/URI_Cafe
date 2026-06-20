import db from './database';
import { Pedido, ItemPedido } from '../models';

export default {
  listar: (callback: (rows: Pedido[]) => void) => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM pedidos ORDER BY criadoEm DESC', [], (_, { rows }) => {
        // @ts-ignore
        callback(rows._array);
      });
    });
  },

  buscarPorId: (id: number, callback: (p?: Pedido, itens?: ItemPedido[]) => void) => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM pedidos WHERE id = ?', [id], (_, { rows }) => {
        // @ts-ignore
        const pedido = rows._array[0];
        tx.executeSql('SELECT * FROM itens_pedido WHERE pedidoId = ?', [id], (_, { rows: itensRows }) => {
          // @ts-ignore
          callback(pedido, itensRows._array);
        });
      });
    });
  },

  inserir: (pedido: Pedido, callback?: () => void) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO pedidos (clienteNome, status, total, criadoEm) VALUES (?, ?, ?, ?)',
        [pedido.clienteNome, pedido.status, pedido.total, pedido.criadoEm || new Date().toISOString()],
        (_, result) => {
          // @ts-ignore
          const pedidoId = result.insertId;
          if (pedido.itens && pedido.itens.length) {
            pedido.itens.forEach(item => {
              tx.executeSql(
                'INSERT INTO itens_pedido (pedidoId, produtoId, quantidade, precoUnitario) VALUES (?, ?, ?, ?)',
                [pedidoId, item.produtoId, item.quantidade, item.precoUnitario]
              );
            });
          }
          callback?.();
        }
      );
    });
  },

  atualizarStatus: (id: number, status: Pedido['status'], callback?: () => void) => {
    db.transaction(tx => {
      tx.executeSql('UPDATE pedidos SET status = ? WHERE id = ?', [status, id], () => callback?.());
    });
  },

  excluir: (id: number, callback?: () => void) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM itens_pedido WHERE pedidoId = ?', [id]);
      tx.executeSql('DELETE FROM pedidos WHERE id = ?', [id], () => callback?.());
    });
  }
};
