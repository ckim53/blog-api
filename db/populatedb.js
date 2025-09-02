require('dotenv').config();
const { Client } = require('pg');

const SQL = `
CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL UNIQUE,
    contact_info TEXT NOT NULL UNIQUE 
);  

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL UNIQUE, 
  price NUMERIC(10, 2), 
  quantity INTEGER DEFAULT 0, 
  supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS restocks (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 0, 
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    total_amount NUMERIC(10, 2),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);  

INSERT INTO suppliers (name, contact_info)
VALUES
  ('Sweet Source Co.', 'sweetsource@example.com'),
  ('Dough & Co.', 'doughco@example.com'),
  ('GlazeMaster Supplies', 'glazemaster@example.com'),
  ('Baker''s Choice', 'bakerschoice@example.com');

INSERT INTO products (name, sku, price, quantity, supplierId)
VALUES
  ('Glazed Donut', 'DN-GZ-001', 1.50, 120, 1),
  ('Blueberry Muffin', 'MF-BB-003', 2.50, 50, 4),
  ('Cinnamon Roll', 'CR-001', 3.00, 40, 3),
  ('Apple Fritter', 'AF-001', 3.50, 30, 2);

INSERT INTO restocks (product_id, quantity)
VALUES
    (1, 50),
    (2, 20),
    (3, 15), 
    (4, 10);

INSERT INTO sales (total_amount) 
VALUES
    (504.37),
    (275.50),
    (689.99),
    (1020.25);
`;

async function main() {
	const client = new Client({
		connectionString: process.env.DATABASE_URL,
	});
	console.log('seeding...');
	await client.connect();
	await client.query(SQL);
	await client.end();
	console.log('done');
}

main();
