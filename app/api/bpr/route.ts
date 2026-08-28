import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Konfigurasi koneksi database lokal Laragon/MySQL
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "db_ojk_bpr",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tahun = searchParams.get("tahun");
    const bprName = searchParams.get("bpr_name");

    const connection = await mysql.createConnection(dbConfig);

    let query = "SELECT * FROM bpr_indicators WHERE 1=1";
    const params: (string | number)[] = [];

    if (tahun) {
      query += " AND tahun = ?";
      params.push(Number(tahun));
    }
    if (bprName) {
      query += " AND bpr_name = ?";
      params.push(bprName);
    }

    query += " ORDER BY tahun ASC, bpr_name ASC";

    const [rows] = await connection.execute(query, params);
    await connection.end();

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("DETAIL ERROR MYSQL GET:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      bpr_name,
      tahun,
      total_aset,
      total_kredit,
      dpk,
      kpmm,
      npl,
      ppka,
      roa,
      bopo,
      nim,
      ldr,
      cash_ratio,
      status,
      dominant_trend,
    } = body;

    const connection = await mysql.createConnection(dbConfig);

    const query = `
      INSERT INTO bpr_indicators 
      (bpr_name, tahun, total_aset, total_kredit, dpk, kpmm, npl, ppka, roa, bopo, nim, ldr, cash_ratio, status, dominant_trend) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      bpr_name,
      tahun,
      total_aset || 0,
      total_kredit || 0,
      dpk || 0,
      kpmm || 0,
      npl || 0,
      ppka || 0,
      roa || 0,
      bopo || 0,
      nim || 0,
      ldr || 0,
      cash_ratio || 0,
      status || "STABLE",
      dominant_trend || "Stabil",
    ];

    await connection.execute(query, values);
    await connection.end();

    return NextResponse.json({
      success: true,
      message: "Data berhasil disimpan!",
    });
  } catch (error) {
    console.error("DETAIL ERROR MYSQL POST:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
