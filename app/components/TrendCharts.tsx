"use client";
import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
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

interface TrendChartsProps {
  bprList: { id: string; name: string }[];
  startYear: number;
  endYear: number;
}

interface BprChartData {
  tahun: number;
  kpmm: number;
  npl: number;
  ppka: number;
  roa: number;
  bopo: number;
  nim: number;
  ldr: number;
  cash_ratio: number;
  total_aset: number;
  total_kredit: number;
  dpk: number;
}

export default function TrendCharts({
  bprList,
  startYear,
  endYear,
}: TrendChartsProps) {
  const [chartBprName, setChartBprName] = useState<string>("");
  const [chartRawData, setChartRawData] = useState<BprChartData[]>([]);

  // Gunakan BPR pertama secara aman sebagai default jika chartBprName belum diatur
  const activeBprName = chartBprName || bprList[0]?.name || "";

  // Ambil data historis lengkap untuk grafik 11 indikator per BPR yang dipilih
  useEffect(() => {
    async function fetchChartData() {
      if (!activeBprName) return;
      try {
        const res = await fetch(
          `/api/bpr?bpr_name=${encodeURIComponent(activeBprName)}`,
        );
        const result = await res.json();
        if (result.success && result.data) {
          const filtered = result.data
            .filter((row: Record<string, unknown>) => {
              const yr = Number(row.tahun);
              return yr >= startYear && yr <= endYear;
            })
            .sort(
              (a: Record<string, unknown>, b: Record<string, unknown>) =>
                Number(a.tahun) - Number(b.tahun),
            );
          setChartRawData(filtered);
        }
      } catch (err) {
        console.error("Gagal memuat data grafik:", err);
      }
    }
    fetchChartData();
  }, [activeBprName, startYear, endYear]);

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
            <TrendingUp size={16} className="text-blue-600 shrink-0" />
            <span>GRAFIK ANALISIS TREN 11 INDIKATOR KEUANGAN</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualisasi pergerakan historis parameter volume usaha dan rasio
            kesehatan per BPR pilihan.
          </p>
        </div>

        {/* Opsi Pilihan BPR untuk Grafik */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-[11px] font-bold text-slate-500">
            Pilih BPR:
          </span>
          <select
            value={activeBprName}
            onChange={(e) => setChartBprName(e.target.value)}
            className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer"
          >
            {bprList.map((b) => (
              <option key={b.id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Grafik untuk 11 Indikator (Dibagi Menjadi 4 Kategori Utama) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Grafik Volume Usaha (Aset, Kredit, DPK) */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Volume Usaha (Aset, Kredit, DPK dalam Jt Rp)
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartRawData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="tahun" fontSize={11} stroke="#64748b" />
                <YAxis fontSize={11} stroke="#64748b" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
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

        {/* 2. Grafik Permodalan & Aset Produktif (KPMM, NPL, PPKA) */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Permodalan & Kualitas Aset (KPMM, NPL, PPKA dalam %)
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartRawData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="tahun" fontSize={11} stroke="#64748b" />
                <YAxis fontSize={11} stroke="#64748b" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
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

        {/* 3. Grafik Rentabilitas & Efisiensi (ROA, BOPO, NIM) */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Rentabilitas & Efisiensi (ROA, BOPO, NIM dalam %)
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartRawData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="tahun" fontSize={11} stroke="#64748b" />
                <YAxis fontSize={11} stroke="#64748b" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
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

        {/* 4. Grafik Likuiditas (LDR & Cash Ratio) */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Likuiditas (LDR & Cash Ratio dalam %)
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartRawData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="tahun" fontSize={11} stroke="#64748b" />
                <YAxis fontSize={11} stroke="#64748b" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
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
  );
}
