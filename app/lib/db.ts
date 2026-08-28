import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // Kosongkan sesuai default Laragon
  database: "db_ojk_bpr",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
