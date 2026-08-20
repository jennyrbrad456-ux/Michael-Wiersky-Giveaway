export const TRANSACTIONS_TABLE_SQL = `CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  payment_method VARCHAR(100),
  receipt_file VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

export interface SqlColumn {
  name: string;
  type: string;
  constraints: string;
  description: string;
}

export const TRANSACTIONS_SCHEMA_COLUMNS: SqlColumn[] = [
  {
    name: 'id',
    type: 'INT',
    constraints: 'AUTO_INCREMENT PRIMARY KEY',
    description: 'Unique sequential identifier for each payment transaction'
  },
  {
    name: 'payment_method',
    type: 'VARCHAR(100)',
    constraints: 'NULLABLE / VARCHAR',
    description: 'Selected crypto network or gift card brand (e.g., BTC, USDT_BEP20, Apple Gift Card)'
  },
  {
    name: 'receipt_file',
    type: 'VARCHAR(255)',
    constraints: 'NULLABLE / VARCHAR',
    description: 'Relative storage path or hash reference to the uploaded proof of payment'
  },
  {
    name: 'created_at',
    type: 'TIMESTAMP',
    constraints: 'DEFAULT CURRENT_TIMESTAMP',
    description: 'Server timestamp when the payment settlement was logged'
  }
];

export function generateSqlDump(transactions: any[]): string {
  let sql = `-- Database Schema & Initial Data Dump for Michael Wiersky Giveaway\n`;
  sql += `-- Generated: ${new Date().toISOString()}\n\n`;
  sql += `${TRANSACTIONS_TABLE_SQL}\n\n`;

  if (transactions.length > 0) {
    sql += `-- Dumping data for table \`transactions\`\n`;
    sql += `INSERT INTO transactions (id, payment_method, receipt_file, created_at) VALUES\n`;
    const rows = transactions.map((tx, idx) => {
      const id = tx.id;
      const method = (tx.payment_method || tx.paymentMethod || 'BTC').replace(/'/g, "''");
      const file = (tx.receipt_file || tx.receiptFileName || 'receipt.jpg').replace(/'/g, "''");
      const date = tx.created_at || tx.createdAt || new Date().toISOString().slice(0, 19).replace('T', ' ');
      const isLast = idx === transactions.length - 1;
      return `  (${id}, '${method}', '${file}', '${date}')${isLast ? ';' : ','}`;
    });
    sql += rows.join('\n');
  }

  return sql;
}
