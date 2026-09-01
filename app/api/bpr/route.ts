import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

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

    const evaluated = evaluateBprStatus({
      npl: Number(npl) || 0,
      bopo: Number(bopo) || 0,
      kpmm: Number(kpmm) || 0,
      car: Number(car) || 0,
    });

    const payload = {
      bpr_name: String(bpr_name).trim(),
      tahun: Number(tahun),
      bulan: Number(bulan),
      total_aset: Number(total_aset) || 0,
      total_kredit: Number(total_kredit) || 0,
      dpk: Number(dpk) || 0,
      kpmm: Number(kpmm) || 0,
      npl: Number(npl) || 0,
      kkl_gross: Number(kkl_gross) || 0,
      miapb: Number(miapb) || 0,
      ppka: Number(ppka) || 0,
      roa: Number(roa) || 0,
      bopo: Number(bopo) || 0,
      nim: Number(nim) || 0,
      ldr: Number(ldr) || 0,
      cash_ratio: Number(cash_ratio) || 0,
      car: Number(car) || Number(kpmm) || 0,
      status: evaluated.status,
      dominant_trend: evaluated.dominant_trend,
    };

    const { error } = await supabase.from("bpr_indicators").insert([payload]);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Data indikator bulanan berhasil disimpan!",
    });
  } catch (error: unknown) {
    console.error("DETAIL ERROR SUPABASE POST:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
