"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Filter, AlertTriangle, CheckCircle2 } from "lucide-react";

interface TrendRecord {
  year: number;
  kpmm: number;
  npl: number;
  roa: number;
  bopo: number;
}

interface BprSummaryItem {
  id: string;
  name: string;
  dominantTrend: string;
  mainIndication: string;
}

export default function AnalisisTrenPage() {
  const [selectedIndicator, setSelectedIndicator] = useState<string>("all");
  const [chartData, setChartData] = useState<TrendRecord[]>([]);
  const [bprList, setBprList] = useState<BprSummaryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTrendData() {
      setLoading(true);
      // Ambil seluruh data historis dari Supabase (2021 - 2025)
      const { data, error } = await supabase
        .from("bpr_indicators")
        .select("bpr_name, tahun, kpmm, npl, roa, bopo, status, dominant_trend")
        .order("tahun", { ascending: true });

      if (error) {
        console.error("Gagal memuat data tren:", error);
      } else if (data) {
        // 1. Hitung rata-rata portofolio per tahun untuk grafik garis
        const yearMap: Record<
          number,
          {
            count: number;
            kpmm: number;
            npl: number;
            roa: number;
            bopo: number;
          }
        > = {};

        data.forEach((row) => {
          const yr = row.tahun;
          if (!yearMap[yr]) {
            yearMap[yr] = { count: 0, kpmm: 0, npl: 0, roa: 0, bopo: 0 };
          }
          yearMap[yr].count += 1;
          yearMap[yr].kpmm += Number(row.kpmm) || 0;
          yearMap[yr].npl += Number(row.npl) || 0;
          yearMap[yr].roa += Number(row.roa) || 0;
          yearMap[yr].bopo += Number(row.bopo) || 0;
        });

        const formattedChartData: TrendRecord[] = Object.keys(yearMap).map(
          (yrStr) => {
            const yr = Number(yrStr);
            const item = yearMap[yr];
            return {
              year: yr,
              kpmm: +(item.kpmm / item.count).toFixed(2),
              npl: +(item.npl / item.count).toFixed(2),
              roa: +(item.roa / item.count).toFixed(2),
              bopo: +(item.bopo / item.count).toFixed(2),
            };
          },
        );

        setChartData(formattedChartData);

        // 2. Ambil data entitas untuk periode terbaru (2025) untuk ringkasan kategori respon
        const latestRows = data.filter((row) => row.tahun === 2025);
        const mappedBprList: BprSummaryItem[] = latestRows.map((row) => {
          let indication = "Kinerja keuangan stabil dan sehat";
          if (row.bpr_name === "BPR Angga")
            indication = "NPL meningkat, ROA turun, BOPO naik";
          else if (row.bpr_name === "BPR Desimal")
            indication = "Pertumbuhan kredit perlu diimbangi pencadangan";
          else if (row.bpr_name === "BPR Cendana")
            indication = "Fluktuasi pada rasio efisiensi operasional";

          return {
            id: row.bpr_name,
            name: row.bpr_name,
            dominantTrend: row.dominant_trend || "Stabil",
            mainIndication: indication,
          };
        });

        setBprList(mappedBprList);
      }
      setLoading(false);
    }

    fetchTrendData();
  }, []);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />

        <main className="p-6 space-y-6">
          {/* Header Judul & Filter Indikator */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                <TrendingUp size={14} />
                <span>Modul Evaluasi Portofolio (Live Supabase)</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Analisis Tren Historis Keuangan BPR
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi pergerakan indikator makro portofolio untuk
                identifikasi dini risiko sistemik (2021 - 2025).
              </p>
            </div>

            {/* Dropdown / Tombol Filter Indikator */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200/80 p-1.5 rounded-xl">
              <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1 pl-2">
                <Filter size={13} />
                <span>Fokus:</span>
              </span>
              <select
                value={selectedIndicator}
                onChange={(e) => setSelectedIndicator(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
              >
                <option value="all">Semua Indikator Utama</option>
                <option value="kpmm">KPMM (%) - Permodalan</option>
                <option value="npl">NPL Gross (%) - Risiko Kredit</option>
                <option value="roa">ROA (%) - Rentabilitas</option>
                <option value="bopo">BOPO (%) - Efisiensi</option>
              </select>
            </div>
          </div>

          {/* Grafik Tren Utama */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Grafik Pergerakan Tren Multi-Tahun
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fluktuasi rasio keuangan gabungan portofolio BPR.
                </p>
              </div>
              <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-xl border border-blue-100">
                {loading ? "Memuat..." : "Periode: 2021 — 2025"}
              </span>
            </div>

            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="year"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                  />

                  {(selectedIndicator === "all" ||
                    selectedIndicator === "kpmm") && (
                    <Line
                      type="monotone"
                      dataKey="kpmm"
                      name="KPMM (%)"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#2563eb" }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {(selectedIndicator === "all" ||
                    selectedIndicator === "npl") && (
                    <Line
                      type="monotone"
                      dataKey="npl"
                      name="NPL Gross (%)"
                      stroke="#dc2626"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#dc2626" }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {(selectedIndicator === "all" ||
                    selectedIndicator === "roa") && (
                    <Line
                      type="monotone"
                      dataKey="roa"
                      name="ROA (%)"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#16a34a" }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {(selectedIndicator === "all" ||
                    selectedIndicator === "bopo") && (
                    <Line
                      type="monotone"
                      dataKey="bopo"
                      name="BOPO (%)"
                      stroke="#9333ea"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#9333ea" }}
                      activeDot={{ r: 6 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grid Bawah: Catatan Analisis & Rincian Per BPR */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Box Kesimpulan Analisis Tren */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <AlertTriangle size={16} />
                </div>
                <span>Peringatan Dini & Catatan Kritis Pengawas</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                  <p className="text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">
                      Lonjakan NPL Gross:
                    </strong>{" "}
                    Meningkat signifikan dari periode awal, mengindikasikan
                    pelemahan kualitas aset kredit portofolio.
                  </p>
                </div>

                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <p className="text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">
                      Tekanan Efisiensi (BOPO):
                    </strong>{" "}
                    Mendekati batas atas ketentuan sehat, menekan margin laba
                    operasional secara keseluruhan.
                  </p>
                </div>

                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex items-start space-x-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                  <p className="text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">
                      Koreksi Permodalan (KPMM):
                    </strong>{" "}
                    Menuntut pengawasan ketat terhadap kecukupan bantalan modal
                    risiko di setiap entitas.
                  </p>
                </div>
              </div>
            </div>

            {/* Ringkasan Status Tren per BPR */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={16} />
                </div>
                <span>Kategori Respon Pengawasan Berdasarkan Tren</span>
              </h3>

              <div className="space-y-2">
                {bprList.map((bpr) => (
                  <div
                    key={bpr.id}
                    className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <span className="font-extrabold text-slate-800">
                        {bpr.name}
                      </span>
                      <span className="text-slate-400 font-medium ml-2">
                        • {bpr.mainIndication}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider ${
                        bpr.dominantTrend === "Memburuk"
                          ? "bg-red-100 text-red-700"
                          : bpr.dominantTrend === "Membaik"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {bpr.dominantTrend}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
