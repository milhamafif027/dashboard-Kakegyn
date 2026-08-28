"use client";
import { useState, useEffect } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  Building2,
} from "lucide-react";
import { supabase } from "../lib/supabase";

interface BprRowData {
  id: string | number;
  name: string;
  dominantTrend: string;
  kpmm: { [year: number]: number };
  npl: { [year: number]: number };
  ppka: { [year: number]: number };
  roa: { [year: number]: number };
  bopo: { [year: number]: number };
  nim: { [year: number]: number };
  ldr: { [year: number]: number };
  cashRatio: { [year: number]: number };
}

export default function SummaryTable() {
  const [bprData, setBprData] = useState<BprRowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTableData() {
      const { data, error } = await supabase
        .from("bpr_indicators")
        .select("*")
        .in("tahun", [2021, 2025]);

      if (error) {
        console.error("Gagal memuat data tabel:", error);
      } else if (data) {
        // Gunakan Record<string, BprRowData> alih-alih 'any'
        const grouped: Record<string, BprRowData> = {};

        data.forEach((row: Record<string, unknown>) => {
          const bprName = row.bpr_name as string;
          if (!grouped[bprName]) {
            grouped[bprName] = {
              id: bprName,
              name: bprName,
              dominantTrend: (row.dominant_trend as string) || "Stabil",
              kpmm: {},
              npl: {},
              ppka: {},
              roa: {},
              bopo: {},
              nim: {},
              ldr: {},
              cashRatio: {},
            };
          }
          const yr = row.tahun as number;
          grouped[bprName].kpmm[yr] = row.kpmm as number;
          grouped[bprName].npl[yr] = row.npl as number;
          grouped[bprName].ppka[yr] = row.ppka as number;
          grouped[bprName].roa[yr] = row.roa as number;
          grouped[bprName].bopo[yr] = row.bopo as number;
          grouped[bprName].nim[yr] = row.nim as number;
          grouped[bprName].ldr[yr] = row.ldr as number;
          grouped[bprName].cashRatio[yr] = row.cash_ratio as number;

          if (yr === 2025) {
            grouped[bprName].dominantTrend =
              (row.dominant_trend as string) || "Stabil";
          }
        });

        setBprData(Object.values(grouped));
      }
      setLoading(false);
    }

    fetchTableData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 select-none">
      {/* Header Judul Komponen */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
            <Building2 size={16} className="text-blue-600" />
            <span>RINGKASAN INDIKATOR KEUANGAN PER BPR (2021 - 2025)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Matriks komparatif multi-tahun portofolio lembaga perkreditan rakyat
            (Live Supabase).
          </p>
        </div>
        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-xl uppercase tracking-wider">
          {loading ? "Memuat Data..." : "Database Connected"}
        </span>
      </div>

      {/* Kontainer Tabel dengan Border Melengkung */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 shadow-2xs">
        <table className="w-full text-center text-xs border-collapse">
          <thead>
            {/* Header Utama Kolom */}
            <tr className="bg-slate-900 text-white border-b border-slate-800">
              <th
                rowSpan={2}
                className="py-3 px-2 border-r border-slate-800 font-bold w-12"
              >
                No
              </th>
              <th
                rowSpan={2}
                className="py-3 px-3 border-r border-slate-800 font-bold text-left min-w-[110px]"
              >
                BPR
              </th>
              <th
                colSpan={2}
                className="py-2 px-2 border-r border-slate-800 font-bold bg-blue-950/60"
              >
                KPMM (%)
              </th>
              <th
                colSpan={2}
                className="py-2 px-2 border-r border-slate-800 font-bold bg-blue-950/60"
              >
                NPL Gross (%)
              </th>
              <th
                colSpan={2}
                className="py-2 px-2 border-r border-slate-800 font-bold bg-blue-950/60"
              >
                Cadangan/PPKA (%)
              </th>
              <th
                colSpan={2}
                className="py-2 px-2 border-r border-slate-800 font-bold bg-blue-950/60"
              >
                ROA (%)
              </th>
              <th
                colSpan={2}
                className="py-2 px-2 border-r border-slate-800 font-bold bg-blue-950/60"
              >
                BOPO (%)
              </th>
              <th
                colSpan={2}
                className="py-2 px-2 border-r border-slate-800 font-bold bg-blue-950/60"
              >
                NIM (%)
              </th>
              <th
                colSpan={2}
                className="py-2 px-2 border-r border-slate-800 font-bold bg-blue-950/60"
              >
                LDR (%)
              </th>
              <th
                colSpan={2}
                className="py-2 px-2 border-r border-slate-800 font-bold bg-blue-950/60"
              >
                Cash Ratio (%)
              </th>
              <th rowSpan={2} className="py-3 px-4 font-bold bg-slate-900">
                Trend Dominan
              </th>
            </tr>
            {/* Sub-Header Tahun (2021 & 2025) */}
            <tr className="bg-slate-800 text-slate-300 border-b border-slate-700 text-[11px]">
              {Array(8)
                .fill(null)
                .map((_, i) => (
                  <FragmentColumns key={i} />
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {loading ? (
              <tr>
                <td colSpan={19} className="py-6 text-center text-slate-400">
                  Menyinkronkan data dari basis data Supabase...
                </td>
              </tr>
            ) : bprData.length === 0 ? (
              <tr>
                <td colSpan={19} className="py-6 text-center text-slate-400">
                  Tidak ada data ditemukan di tabel Supabase.
                </td>
              </tr>
            ) : (
              bprData.map((item, index) => {
                const isEven = index % 2 === 0;
                const isMembaik = item.dominantTrend === "Membaik";
                const isMemburuk = item.dominantTrend === "Memburuk";

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-blue-50/40 ${isEven ? "bg-white" : "bg-slate-50/50"}`}
                  >
                    <td className="py-3 px-2 border-r border-slate-200/80 font-bold text-slate-400">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3 border-r border-slate-200/80 font-extrabold text-slate-800 text-left">
                      {item.name}
                    </td>

                    {/* KPMM */}
                    <td className="py-3 px-1.5 border-r border-slate-100 text-slate-400">
                      {item.kpmm[2021]?.toFixed(2) ?? "-"}
                    </td>
                    <td
                      className={`py-3 px-1.5 border-r border-slate-200/80 font-bold ${isMembaik ? "text-emerald-600 bg-emerald-50/30" : "text-slate-800"}`}
                    >
                      {item.kpmm[2025]?.toFixed(2) ?? "-"}
                    </td>

                    {/* NPL Gross */}
                    <td className="py-3 px-1.5 border-r border-slate-100 text-slate-400">
                      {item.npl[2021]?.toFixed(2) ?? "-"}
                    </td>
                    <td
                      className={`py-3 px-1.5 border-r border-slate-200/80 font-bold ${(item.npl[2025] ?? 0) > 5 ? "text-red-600 bg-red-50/60" : "text-slate-800"}`}
                    >
                      {item.npl[2025]?.toFixed(2) ?? "-"}
                    </td>

                    {/* Cadangan/PPKA */}
                    <td className="py-3 px-1.5 border-r border-slate-100 text-slate-400">
                      {item.ppka[2021]?.toFixed(2) ?? "-"}
                    </td>
                    <td className="py-3 px-1.5 border-r border-slate-200/80 font-bold text-slate-800">
                      {item.ppka[2025]?.toFixed(2) ?? "-"}
                    </td>

                    {/* ROA */}
                    <td className="py-3 px-1.5 border-r border-slate-100 text-slate-400">
                      {item.roa[2021]?.toFixed(2) ?? "-"}
                    </td>
                    <td
                      className={`py-3 px-1.5 border-r border-slate-200/80 font-bold ${isMembaik ? "text-emerald-600 bg-emerald-50/30" : "text-slate-800"}`}
                    >
                      {item.roa[2025]?.toFixed(2) ?? "-"}
                    </td>

                    {/* BOPO */}
                    <td className="py-3 px-1.5 border-r border-slate-100 text-slate-400">
                      {item.bopo[2021]?.toFixed(2) ?? "-"}
                    </td>
                    <td
                      className={`py-3 px-1.5 border-r border-slate-200/80 font-bold ${(item.bopo[2025] ?? 0) > 90 ? "text-red-600 bg-red-50/60" : "text-slate-800"}`}
                    >
                      {item.bopo[2025]?.toFixed(2) ?? "-"}
                    </td>

                    {/* NIM */}
                    <td className="py-3 px-1.5 border-r border-slate-100 text-slate-400">
                      {item.nim[2021]?.toFixed(2) ?? "-"}
                    </td>
                    <td className="py-3 px-1.5 border-r border-slate-200/80 font-bold text-slate-800">
                      {item.nim[2025]?.toFixed(2) ?? "-"}
                    </td>

                    {/* LDR */}
                    <td className="py-3 px-1.5 border-r border-slate-100 text-slate-400">
                      {item.ldr[2021]?.toFixed(2) ?? "-"}
                    </td>
                    <td className="py-3 px-1.5 border-r border-slate-200/80 font-bold text-slate-800">
                      {item.ldr[2025]?.toFixed(2) ?? "-"}
                    </td>

                    {/* Cash Ratio */}
                    <td className="py-3 px-1.5 border-r border-slate-100 text-slate-400">
                      {item.cashRatio[2021]?.toFixed(2) ?? "-"}
                    </td>
                    <td className="py-3 px-1.5 border-r border-slate-200/80 font-bold text-slate-800">
                      {item.cashRatio[2025]?.toFixed(2) ?? "-"}
                    </td>

                    {/* Trend Dominan */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                          isMemburuk
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : isMembaik
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {isMemburuk && (
                          <ArrowDownRight size={12} className="stroke-[3]" />
                        )}
                        {isMembaik && (
                          <ArrowUpRight size={12} className="stroke-[3]" />
                        )}
                        {!isMemburuk && !isMembaik && (
                          <ArrowRight size={12} className="stroke-[3]" />
                        )}
                        <span>{item.dominantTrend}</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FragmentColumns() {
  return (
    <>
      <th className="py-1.5 px-1.5 border-r border-slate-700 font-semibold text-slate-400 text-[10px]">
        2021
      </th>
      <th className="py-1.5 px-1.5 border-r border-slate-700 font-bold text-slate-200 text-[10px]">
        2025
      </th>
    </>
  );
}
