import { getDatabase } from './database';
import { Pedido, ItemPedido, StatusPedido } from '../models';

export const PedidoDAO = {
  async listar(status?: StatusPedido): Promise<Pedido[]> {
    const db = getDatabase();
    let query = 'SELECT * FROM pedidos';
    const params: any[] = [];
    if (status) { query += ' WHERE status = ?'; params.push(status); }
    query += ' ORDER BY data_criacao DESC';
    return await db.getAllAsync<Pedido>(query, params);
  },

  async buscarPorId(id: number): Promise<Pedido | null> {
    const db = getDatabase();
    const pedido = await db.getFirstAsync<Pedido>(
      'SELECT * FROM pedidos WHERE id = ?', [id]
    );
    if (!pedido) return null;
    const itens = await db.getAllAsync<ItemPedido>(
      `SELECT ip.*, p.nome as produto_nome, p.preco as produto_preco
       FROM itens_pedido ip
       JOIN produtos p ON ip.produto_id = p.id
       WHERE ip.pedido_id = ?`, [id]
    );
    return { ...pedido, itens };
  },

  async proximoNumero(): Promise<number> {
    const db = getDatabase();
    const result = await db.getFirstAsync<{ max: number }>(
      'SELECT COALESCE(MAX(numero), 0) + 1 as max FROM pedidos'
    );
    return result?.max ?? 1;
  },

  async inserir(pedido: Omit<Pedido, 'id' | 'itens'>, itens: Omit<ItemPedido, 'id' | 'pedido_id'>[]): Promise<number> {
    const db = getDatabase();
    const result = await db.runAsync(
      `INSERT INTO pedidos (numero, cliente_nome, status, observacao, total, data_criacao)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [pedido.numero, pedido.cliente_nome, pedido.status,
       pedido.observacao ?? null, pedido.total, pedido.data_criacao]
    );
    const pedidoId = result.lastInsertRowId;
    for (const item of itens) {
      await db.runAsync(
        'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, subtotal) VALUES (?, ?, ?, ?)',
        [pedidoId, item.produto_id, item.quantidade, item.subtotal]
      );
    }
    return pedidoId;
  },

  async atualizarStatus(id: number, status: StatusPedido): Promise<void> {
    const db = getDatabase();
    await db.runAsync('UPDATE pedidos SET status = ? WHERE id = ?', [status, id]);
  },

  async excluir(id: number): Promise<void> {
    const db = getDatabase();
    await db.runAsync('DELETE FROM itens_pedido WHERE pedido_id = ?', [id]);
    await db.runAsync('DELETE FROM pedidos WHERE id = ?', [id]);
  },

  async contagemPorStatus(): Promise<Record<StatusPedido, number>> {
    const db = getDatabase();
    const rows = await db.getAllAsync<{ status: StatusPedido; count: number }>(
      'SELECT status, COUNT(*) as count FROM pedidos GROUP BY status'
    );
    const result: Record<StatusPedido, number> = { em_preparo: 0, pronto: 0, entregue: 0 };
    rows.forEach((r) => (result[r.status] = r.count));
    return result;
  },

  async totalFaturamento(): Promise<number> {
    const db = getDatabase();
    const result = await db.getFirstAsync<{ total: number }>(
      "SELECT COALESCE(SUM(total), 0) as total FROM pedidos WHERE status = 'entregue'"
    );
    return result?.total ?? 0;
  },

  async totalHoje(): Promise<number> {
    const db = getDatabase();
    const hoje = new Date().toISOString().split('T')[0];
    const result = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM pedidos WHERE data_criacao LIKE ?",
      [`${hoje}%`]
    );
    return result?.count ?? 0;
  },
};