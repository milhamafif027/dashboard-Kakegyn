"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { SlidersHorizontal, Check } from "lucide-react";

interface BprComparisonRecord {
  bpr_name: string;
  tahun: number;
  status: string;
  dominant_trend: string;
  total_aset: number;
  total_kredit: number;
  dpk: number;
  kpmm: number;
  npl: number;
  ppka: number;
  roa: number;
  bopo: number;
  nim: number;
  ldr: number;
  cash_ratio: number;
}

export default function PerbandinganBPRPage() {
  const [allBprData, setAllBprData] = useState<BprComparisonRecord[]>([]);
  const [availableBprs, setAvailableBprs] = useState<string[]>([]);
  const [selectedBprs, setSelectedBprs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Ambil data tahun 2025 dari Supabase saat komponen dimuat
  useEffect(() => {
    async function fetchComparisonData() {
      setLoading(true);
      const { data, error } = await supabase
        .from("bpr_indicators")
        .select("*")
        .eq("tahun", 2025);

      if (error) {
        console.error("Gagal memuat data perbandingan:", error);
      } else if (data) {
        const records = data as BprComparisonRecord[];
        setAllBprData(records);
        const names = records.map((r) => r.bpr_name);
        setAvailableBprs(names);
        // Default pilih 3 BPR pertama untuk perbandingan head-to-head
        setSelectedBprs(names.slice(0, 3));
      }
      setLoading(false);
    }

    fetchComparisonData();
  }, []);

  const handleCheckboxChange = (bprName: string) => {
    if (selectedBprs.includes(bprName)) {
      if (selectedBprs.length > 1) {
        setSelectedBprs(selectedBprs.filter((item) => item !== bprName));
      }
    } else {
      if (selectedBprs.length < 4) {
        setSelectedBprs([...selectedBprs, bprName]);
      }
    }
  };

  // Filter data berdasarkan BPR yang dipilih di checkbox
  const filteredData = allBprData.filter((bpr) =>
    selectedBprs.includes(bpr.bpr_name),
  );

  // Format data untuk grafik komparasi batang
  const chartComparisonData = filteredData.map((bpr) => ({
    name: bpr.bpr_name,
    "KPMM (%)": bpr.kpmm,
    "NPL Gross (%)": bpr.npl,
    "ROA (%)": bpr.roa,
  }));

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />

        <main className="p-6 space-y-6">
          {/* Header Judul & Filter BPR Modern */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                <SlidersHorizontal size={14} />
                <span>Analisis Komparatif Portofolio (Live Supabase)</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Perbandingan Kinerja Keuangan BPR
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih maksimal 4 entitas BPR untuk evaluasi head-to-head
                indikator utama tahun 2025.
              </p>
            </div>

            {/* Filter Pemilihan BPR Interaktif */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-1">
                Filter BPR:
              </span>
              {availableBprs.map((bprName) => {
                const isSelected = selectedBprs.includes(bprName);
                return (
                  <button
                    key={bprName}
                    onClick={() => handleCheckboxChange(bprName)}
                    className={`flex items-center space-x-1.5 text-xs px-3 py-2 rounded-xl font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                        : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    <span>{bprName}</span>
                    {isSelected && <Check size={13} className="stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tabel Komparasi Head-to-Head */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">
                Matriks Komparasi 11 Indikator Utama (Tahun 2025)
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {loading
                  ? "Memuat..."
                  : `Menampilkan ${filteredData.length} dari ${availableBprs.length} Entitas`}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200/80">
                    <th className="py-3.5 px-4 text-left border-r border-slate-200/60 font-bold uppercase tracking-wider text-[11px]">
                      Indikator Keuangan
                    </th>
                    {filteredData.map((bpr) => (
                      <th
                        key={bpr.bpr_name}
                        className="py-3.5 px-4 border-r border-slate-200/60 font-extrabold text-slate-800"
                      >
                        <div className="text-sm">{bpr.bpr_name}</div>
                        <div className="mt-1">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide inline-block ${
                              bpr.status === "HIGH ATTENTION"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : bpr.status === "WATCH"
                                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                                  : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {bpr.status}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {[
                    {
                      label: "Total Aset (Rp juta)",
                      key: "total_aset",
                      highlight: false,
                    },
                    {
                      label: "Total Kredit (Rp juta)",
                      key: "total_kredit",
                      highlight: false,
                    },
                    { label: "DPK (Rp juta)", key: "dpk", highlight: false },
                    { label: "KPMM (%)", key: "kpmm", highlight: false },
                    {
                      label: "NPL Gross (%)",
                      key: "npl",
                      highlight: true,
                      threshold: 5,
                    },
                    {
                      label: "Cadangan / PPKA (%)",
                      key: "ppka",
                      highlight: false,
                    },
                    { label: "ROA (%)", key: "roa", highlight: false },
                    {
                      label: "BOPO (%)",
                      key: "bopo",
                      highlight: true,
                      threshold: 90,
                    },
                    { label: "NIM (%)", key: "nim", highlight: false },
                    { label: "LDR (%)", key: "ldr", highlight: false },
                    {
                      label: "Cash Ratio (%)",
                      key: "cash_ratio",
                      highlight: false,
                    },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3 px-4 text-left font-semibold text-slate-600 border-r border-slate-100">
                        {row.label}
                      </td>
                      {filteredData.map((bpr) => {
                        const val =
                          (bpr as unknown as Record<string, number>)[row.key] ??
                          0;
                        const isAlert =
                          row.highlight &&
                          typeof val === "number" &&
                          val > (row.threshold ?? 0);

                        return (
                          <td
                            key={bpr.bpr_name}
                            className={`py-3 px-4 border-r border-slate-100 font-bold ${
                              isAlert
                                ? "text-red-600 bg-red-50/40"
                                : "text-slate-800"
                            }`}
                          >
                            {typeof val === "number"
                              ? val.toLocaleString("id-ID")
                              : val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Baris Tren Dominan */}
                  <tr className="bg-slate-50/50">
                    <td className="py-3.5 px-4 text-left font-bold text-slate-800 border-r border-slate-100">
                      Trend Dominan
                    </td>
                    {filteredData.map((bpr) => (
                      <td
                        key={bpr.bpr_name}
                        className="py-3.5 px-4 border-r border-slate-100"
                      >
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider inline-block ${
                            bpr.dominant_trend === "Memburuk"
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {bpr.dominant_trend}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Grafik Batang Komparasi Modern */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Visualisasi Komparasi Kinerja Utama (2025)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Perbandingan parameter KPMM, NPL Gross, dan ROA antar bank
                terpilih.
              </p>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartComparisonData}
                  margin={{ top: 10, right: 30, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
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
                  <Bar
                    dataKey="KPMM (%)"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                  <Bar
                    dataKey="NPL Gross (%)"
                    fill="#dc2626"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                  <Bar
                    dataKey="ROA (%)"
                    fill="#16a34a"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
