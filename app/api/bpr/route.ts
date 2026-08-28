import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tahun = searchParams.get("tahun");
    const bprName = searchParams.get("bpr_name");

    let query = supabase
      .from("bpr_indicators")
      .select("*")
      .order("tahun", { ascending: true })
      .order("bpr_name", { ascending: true });

    if (tahun) {
      query = query.eq("tahun", Number(tahun));
    }
    if (bprName) {
      query = query.eq("bpr_name", bprName);
    }

    const { data: rows, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("DETAIL ERROR SUPABASE GET:", error);
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

    const newRecord = {
      bpr_name,
      tahun: Number(tahun),
      total_aset: total_aset || 0,
      total_kredit: total_kredit || 0,
      dpk: dpk || 0,
      kpmm: kpmm || 0,
      npl: npl || 0,
      ppka: ppka || 0,
      roa: roa || 0,
      bopo: bopo || 0,
      nim: nim || 0,
      ldr: ldr || 0,
      cash_ratio: cash_ratio || 0,
      status: status || "STABLE",
      dominant_trend: dominant_trend || "Stabil",
    };

    const { error } = await supabase.from("bpr_indicators").insert([newRecord]);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Data berhasil disimpan ke Supabase!",
    });
  } catch (error) {
    console.error("DETAIL ERROR SUPABASE POST:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
