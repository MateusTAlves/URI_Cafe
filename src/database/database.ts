import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync('uricafe.db');
  }
  return db;
}

export async function initDatabase(): Promise<void> {
  const database = getDatabase();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      icone TEXT NOT NULL DEFAULT 'fast-food',
      cor TEXT NOT NULL DEFAULT '#C8973A'
    );

    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT NOT NULL DEFAULT '',
      preco REAL NOT NULL DEFAULT 0,
      categoria_id INTEGER NOT NULL,
      disponivel INTEGER NOT NULL DEFAULT 1,
      destaque INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    );

    CREATE TABLE IF NOT EXISTS produto_imagens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      produto_id INTEGER NOT NULL,
      uri TEXT NOT NULL,
      ordem INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (produto_id) REFERENCES produtos(id)
    );

    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero INTEGER NOT NULL,
      cliente_nome TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'em_preparo',
      observacao TEXT,
      total REAL NOT NULL DEFAULT 0,
      data_criacao TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS itens_pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER NOT NULL,
      produto_id INTEGER NOT NULL,
      quantidade INTEGER NOT NULL DEFAULT 1,
      subtotal REAL NOT NULL DEFAULT 0,
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
      FOREIGN KEY (produto_id) REFERENCES produtos(id)
    );
  `);

  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM categorias'
  );

  if (result?.count === 0) {
    await seedDatabase(database);
  }
}

async function seedDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    INSERT INTO categorias (nome, icone, cor) VALUES
      ('Lanches', 'fast-food', '#E07B39'),
      ('Bebidas', 'cafe', '#3D1C02'),
      ('Doces', 'ice-cream', '#C8973A'),
      ('Salgados', 'pizza', '#8A6A5A');

    INSERT INTO produtos (nome, descricao, preco, categoria_id, disponivel, destaque) VALUES
      ('X-Burguer', 'Pão, hambúrguer artesanal e queijo', 12.90, 1, 1, 1),
      ('X-Bacon', 'Hambúrguer com bacon crocante e queijo', 15.00, 1, 1, 0),
      ('Café Expresso', 'Grão arábica torra média', 4.50, 2, 1, 1),
      ('Cappuccino', 'Espresso, leite vaporizado e canela', 7.50, 2, 1, 0),
      ('Suco de Laranja', 'Natural 300ml', 6.50, 2, 1, 0),
      ('Brownie', 'Chocolate belga meio amargo', 6.00, 3, 1, 1),
      ('Coxinha', 'Frango com catupiry', 5.00, 4, 1, 0),
      ('Pão de Queijo', 'Tradicional mineiro, 3 unidades', 4.00, 4, 1, 0);
  `);
}