import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi klien Supabase menggunakan env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function evaluateBprStatus(row: Record<string, unknown>) {
  const npl = Number(row.npl) || 0;
  const bopo = Number(row.bopo) || 0;
  const car = Number(row.kpmm ?? row.car ?? 0);

  if (npl > 5.0 || bopo > 95.0 || (car > 0 && car < 12.0)) {
    return {
      status: "HIGH ATTENTION",
      dominant_trend: "Perhatian Khusus",
    };
  }

  if ((npl > 3.0 && npl <= 5.0) || (bopo > 90.0 && bopo <= 95.0)) {
    return {
      status: "WATCH",
      dominant_trend: "Fluktuatif",
    };
  }

  return {
    status: "STABLE",
    dominant_trend: "Stabil & Sehat",
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tahun = searchParams.get("tahun");
    const bulan = searchParams.get("bulan");
    const bprName = searchParams.get("bpr_name");

    let query = supabase.from("bpr_indicators").select("*");

    if (tahun) {
      query = query.eq("tahun", Number(tahun));
    }
    if (bulan) {
      query = query.eq("bulan", Number(bulan));
    }
    if (bprName) {
      query = query.eq("bpr_name", bprName);
    }

    query = query
      .order("tahun", { ascending: true })
      .order("bulan", { ascending: true })
      .order("bpr_name", { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const dataRows = (data || []) as Record<string, unknown>[];
    const processedData = dataRows.map((row) => {
      const evaluation = evaluateBprStatus(row);
      return {
        ...row,
        status: evaluation.status,
        dominant_trend: evaluation.dominant_trend,
      };
    });

    return NextResponse.json({ success: true, data: processedData });
  } catch (error: unknown) {
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
      bulan,
      total_aset,
      total_kredit,
      dpk,
      kpmm,
      npl,
      kkl_gross,
      miapb,
      roa,
      bopo,
      nim,
      ldr,
      cash_ratio,
      car,
    } = body;

    if (!bpr_name || !tahun || !bulan) {
      return NextResponse.json(
        { success: false, error: "Nama BPR, Tahun, dan Bulan wajib diisi!" },
        { status: 400 },
      );
    }

    const sanitizedTotalAset = Math.max(0, Number(total_aset) || 0);
    const sanitizedTotalKredit = Math.max(0, Number(total_kredit) || 0);
    const sanitizedDpk = Math.max(0, Number(dpk) || 0);
    const sanitizedKpmm = Number(kpmm) || 0;
    const sanitizedNpl = Math.max(0, Number(npl) || 0);
    const sanitizedKklGross = Math.max(0, Number(kkl_gross) || 0);
    const sanitizedMiapb = Math.max(0, Number(miapb) || 0);
    const sanitizedRoa = Number(roa) || 0;
    const sanitizedBopo = Math.max(0, Number(bopo) || 0);
    const sanitizedNim = Number(nim) || 0;
    const sanitizedLdr = Math.max(0, Number(ldr) || 0);
    const sanitizedCashRatio = Math.max(0, Number(cash_ratio) || 0);
    const sanitizedCar = Number(car) || Number(kpmm) || 0;

    const evaluated = evaluateBprStatus({
      npl: sanitizedNpl,
      bopo: sanitizedBopo,
      kpmm: sanitizedKpmm,
      car: sanitizedCar,
    });

    const insertPayload = {
      bpr_name,
      tahun: Number(tahun),
      bulan: Number(bulan),
      total_aset: sanitizedTotalAset,
      total_kredit: sanitizedTotalKredit,
      dpk: sanitizedDpk,
      kpmm: sanitizedKpmm,
      npl: sanitizedNpl,
      kkl_gross: sanitizedKklGross,
      miapb: sanitizedMiapb,
      roa: sanitizedRoa,
      bopo: sanitizedBopo,
      nim: sanitizedNim,
      ldr: sanitizedLdr,
      cash_ratio: sanitizedCashRatio,
      car: sanitizedCar,
      status: evaluated.status,
      dominant_trend: evaluated.dominant_trend,
    };

    const { error } = await supabase
      .from("bpr_indicators")
      .insert([insertPayload]);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Data indikator bulanan berhasil disimpan ke Supabase!",
    });
  } catch (error: unknown) {
    console.error("DETAIL ERROR SUPABASE POST:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const bprName = searchParams.get("bpr_name");
    const tahun = searchParams.get("tahun");
    const bulan = searchParams.get("bulan");

    if (id) {
      const { error } = await supabase
        .from("bpr_indicators")
        .delete()
        .eq("id", Number(id));
      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Data dengan ID ${id} berhasil dihapus.`,
      });
    }

    if (bprName && tahun && bulan) {
      const { error } = await supabase
        .from("bpr_indicators")
        .delete()
        .eq("bpr_name", bprName)
        .eq("tahun", Number(tahun))
        .eq("bulan", Number(bulan));

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Data ${bprName} periode ${bulan}/${tahun} berhasil dihapus.`,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Parameter penghapusan tidak lengkap!",
      },
      { status: 400 },
    );
  } catch (error: unknown) {
    console.error("DETAIL ERROR SUPABASE DELETE:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
