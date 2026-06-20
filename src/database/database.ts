import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('uricafe.db');

export const initDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL
      );`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        preco REAL NOT NULL,
        categoriaId INTEGER,
        disponivel INTEGER DEFAULT 1,
        FOREIGN KEY(categoriaId) REFERENCES categorias(id)
      );`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clienteNome TEXT,
        status TEXT,
        total REAL,
        criadoEm TEXT
      );`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS itens_pedido (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pedidoId INTEGER,
        produtoId INTEGER,
        quantidade INTEGER,
        precoUnitario REAL,
        FOREIGN KEY(pedidoId) REFERENCES pedidos(id),
        FOREIGN KEY(produtoId) REFERENCES produtos(id)
      );`
    );

    tx.executeSql(`SELECT COUNT(*) as c FROM categorias`, [], (_, result) => {
      // @ts-ignore
      const count = result.rows._array[0].c;
      if (count === 0) {
        tx.executeSql(`INSERT INTO categorias (nome) VALUES (?), (?), (?)`, [
          'Bebidas',
          'Doces',
          'Salgados'
        ]);
      }
    });
  });
};

export default db;
