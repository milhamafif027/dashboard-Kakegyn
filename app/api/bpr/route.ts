import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// Fungsi penelaah status kesehatan otomatis berdasarkan standar OJK
function evaluateBprStatus(row: Record<string, unknown>) {
  const npl = Number(row.npl) || 0;
  const bopo = Number(row.bopo) || 0;
  const car = Number(row.kpmm ?? row.car ?? 0);

  // 1. Kriteria Pengawasan Khusus / High Attention
  if (npl > 5.0 || bopo > 95.0 || (car > 0 && car < 12.0)) {
    return {
      status: "HIGH ATTENTION",
      dominant_trend: "Perhatian Khusus",
    };
  }

  // 2. Kriteria Pemantauan / Watch
  if ((npl > 3.0 && npl <= 5.0) || (bopo > 90.0 && bopo <= 95.0)) {
    return {
      status: "WATCH",
      dominant_trend: "Fluktuatif",
    };
  }

  // 3. Kriteria Sehat / Stable
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
      query = query.eq("bpr_name", decodeURIComponent(bprName));
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

    // Timpa status dan tren dengan hasil kalkulasi otomatis sistem
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
      ppka,
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
    const sanitizedPpka = Math.max(0, Number(ppka) || 0);
    const sanitizedRoa = Number(roa) || 0;
    const sanitizedBopo = Math.max(0, Number(bopo) || 0);
    const sanitizedNim = Number(nim) || 0;
    const sanitizedLdr = Math.max(0, Number(ldr) || 0);
    const sanitizedCashRatio = Math.max(0, Number(cash_ratio) || 0);
    const sanitizedCar = Number(car) || 0;

    // Evaluasi status otomatis sebelum disimpan
    const evaluated = evaluateBprStatus({
      npl: sanitizedNpl,
      bopo: sanitizedBopo,
      kpmm: sanitizedKpmm,
      car: sanitizedCar,
    });

    const payload = {
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
      ppka: sanitizedPpka,
      roa: sanitizedRoa,
      bopo: sanitizedBopo,
      nim: sanitizedNim,
      ldr: sanitizedLdr,
      cash_ratio: sanitizedCashRatio,
      car: sanitizedCar,
      status: evaluated.status,
      dominant_trend: evaluated.dominant_trend,
    };

    const { error } = await supabase.from("bpr_indicators").insert([payload]);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message:
        "Data indikator bulanan berhasil disimpan dan dianalisis otomatis oleh sistem!",
    });
  } catch (error: unknown) {
    console.error("DETAIL ERROR SUPABASE POST:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
