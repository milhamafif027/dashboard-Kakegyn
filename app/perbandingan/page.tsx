"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { BarChart2, Calendar, Building2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface BprComparisonItem {
  bpr_name: string;
  tahun: number;
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

export default function PerbandinganPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rawData, setRawData] = useState<BprComparisonItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const availableYears = [2021, 2022, 2023, 2024, 2025];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/bpr?tahun=${selectedYear}`);
        const result = await res.json();
        if (result.success && result.data) {
          setRawData(result.data);
        }
      } catch (err) {
        console.error("Gagal memuat data perbandingan:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedYear]);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header & Filter Tahun */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <BarChart2 size={20} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">
                  Komparasi Antar BPR
                </h2>
                <p className="text-xs text-slate-500">
                  Perbandingan 11 indikator keuangan seluruh entitas berdasarkan
                  tahun.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full sm:w-auto">
              <Calendar size={16} className="text-slate-400" />
              <span className="text-[11px] font-bold text-slate-500">
                Tahun:
              </span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer"
              >
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400 font-medium">
              Memuat data komparasi...
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tabel Matriks Komparasi */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                  <Building2 size={16} className="text-blue-600" />
                  <span>Matriks Komparasi 11 Indikator ({selectedYear})</span>
                </h3>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-center text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="py-3 px-3 text-left">Nama BPR</th>
                        <th className="py-3 px-2">Aset (Jt)</th>
                        <th className="py-3 px-2">Kredit (Jt)</th>
                        <th className="py-3 px-2">DPK (Jt)</th>
                        <th className="py-3 px-2">KPMM (%)</th>
                        <th className="py-3 px-2">NPL (%)</th>
                        <th className="py-3 px-2">PPKA (%)</th>
                        <th className="py-3 px-2">ROA (%)</th>
                        <th className="py-3 px-2">BOPO (%)</th>
                        <th className="py-3 px-2">NIM (%)</th>
                        <th className="py-3 px-2">LDR (%)</th>
                        <th className="py-3 px-2">Cash (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {rawData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-3 px-3 text-left font-bold text-slate-900">
                            {row.bpr_name}
                          </td>
                          <td className="py-3 px-2">
                            {(row.total_aset || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 px-2">
                            {(row.total_kredit || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 px-2">
                            {(row.dpk || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 px-2 font-bold text-blue-600">
                            {row.kpmm?.toFixed(2)}
                          </td>
                          <td
                            className={`py-3 px-2 font-bold ${row.npl > 5 ? "text-red-600" : ""}`}
                          >
                            {row.npl?.toFixed(2)}
                          </td>
                          <td className="py-3 px-2">{row.ppka?.toFixed(2)}</td>
                          <td className="py-3 px-2">{row.roa?.toFixed(2)}</td>
                          <td
                            className={`py-3 px-2 font-bold ${row.bopo > 90 ? "text-red-600" : ""}`}
                          >
                            {row.bopo?.toFixed(2)}
                          </td>
                          <td className="py-3 px-2">{row.nim?.toFixed(2)}</td>
                          <td className="py-3 px-2">{row.ldr?.toFixed(2)}</td>
                          <td className="py-3 px-2">
                            {row.cash_ratio?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* VISUALISASI GRAFIK KOMPARASI 11 INDIKATOR LENGKAP */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Visualisasi Grafik Komparasi 11 Indikator Antar BPR (
                    {selectedYear})
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Grafik garis komparasi lengkap mencakup volume usaha,
                    permodalan, rentabilitas, efisiensi, dan likuiditas.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  {/* 1. Volume Usaha (Aset, Kredit, DPK) */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-700">
                      1. Komparasi Volume Usaha (Juta Rp)
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rawData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis dataKey="bpr_name" fontSize={10} />
                          <YAxis fontSize={10} />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: "10px" }} />
                          <Line
                            type="monotone"
                            dataKey="total_aset"
                            name="Total Aset"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="total_kredit"
                            name="Total Kredit"
                            stroke="#16a34a"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="dpk"
                            name="DPK"
                            stroke="#9333ea"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 2. Permodalan & Kualitas Aset (KPMM, NPL, PPKA) */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-700">
                      2. Komparasi Permodalan & Kualitas Aset (%)
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rawData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis dataKey="bpr_name" fontSize={10} />
                          <YAxis fontSize={10} />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: "10px" }} />
                          <Line
                            type="monotone"
                            dataKey="kpmm"
                            name="KPMM"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="npl"
                            name="NPL Gross"
                            stroke="#dc2626"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="ppka"
                            name="Cadangan/PPKA"
                            stroke="#16a34a"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 3. Rentabilitas & Efisiensi (ROA, BOPO, NIM) */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-700">
                      3. Komparasi Rentabilitas & Efisiensi (%)
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rawData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis dataKey="bpr_name" fontSize={10} />
                          <YAxis fontSize={10} />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: "10px" }} />
                          <Line
                            type="monotone"
                            dataKey="roa"
                            name="ROA"
                            stroke="#16a34a"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="bopo"
                            name="BOPO"
                            stroke="#dc2626"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="nim"
                            name="NIM"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 4. Likuiditas (LDR & Cash Ratio) */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-700">
                      4. Komparasi Likuiditas (%)
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rawData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis dataKey="bpr_name" fontSize={10} />
                          <YAxis fontSize={10} />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: "10px" }} />
                          <Line
                            type="monotone"
                            dataKey="ldr"
                            name="LDR"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="cash_ratio"
                            name="Cash Ratio"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
