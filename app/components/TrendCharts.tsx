"use client";
import { useState } from "react";
import { TrendingUp, AlertCircle, Calendar } from "lucide-react";
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

interface BprSummaryItem {
  id: string;
  name: string;
  evaluationNote: string;
  deepDiveArea: string;
}

interface TrendChartsProps {
  bprList?: BprSummaryItem[];
  startYear?: number;
  endYear?: number;
  data?: Record<string, unknown>[];
}

const namaBulan = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Ags",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export default function TrendCharts({
  bprList = [],
  startYear = 2021,
  endYear = 2025,
  data = [],
}: TrendChartsProps) {
  const [chartBprName, setChartBprName] = useState<string>("");

  const activeBprName =
    chartBprName ||
    (bprList && bprList.length > 0 ? bprList[0]?.name : "") ||
    "";

  // Ekstrak daftar tahun unik dari data secara dinamis
  const dynamicYears: number[] = Array.from(
    new Set(
      data.map((row) => Number(row.tahun)).filter((y) => !isNaN(y) && y > 0),
    ),
  ).sort((a, b) => a - b);

  // Jika data kosong, gunakan rentang cadangan dari props
  const availableYears: number[] =
    dynamicYears.length > 0
      ? dynamicYears
      : (() => {
          const list = [];
          const s = Math.min(startYear, endYear);
          const e = Math.max(startYear, endYear);
          for (let y = s; y <= e; y++) list.push(y);
          return list;
        })();

  const defaultYear =
    availableYears.length > 0
      ? availableYears[availableYears.length - 1]
      : endYear;

  const [selectedChartYear, setSelectedChartYear] =
    useState<number>(defaultYear);

  const activeYear = availableYears.includes(selectedChartYear)
    ? selectedChartYear
    : defaultYear;

  const availableMonthsForBpr = data
    .filter(
      (row) =>
        row.bpr_name === activeBprName && Number(row.tahun) === activeYear,
    )
    .map((row) => Number(row.bulan))
    .filter((m) => !isNaN(m) && m > 0);

  const uniqueMonths = Array.from(new Set(availableMonthsForBpr)).sort(
    (a, b) => a - b,
  );

  const timelineData = uniqueMonths.map((m) => ({
    tahun: activeYear,
    bulan: m,
    label: `${namaBulan[m]} ${activeYear}`,
  }));

  const chartRawData = timelineData.map((t) => {
    const found = data.find(
      (row) =>
        row.bpr_name === activeBprName &&
        Number(row.tahun) === t.tahun &&
        Number(row.bulan) === t.bulan,
    );
    return {
      periodLabel: t.label,
      total_aset: found ? Number(found.total_aset) || 0 : 0,
      total_kredit: found ? Number(found.total_kredit) || 0 : 0,
      dpk: found ? Number(found.dpk) || 0 : 0,
      npl: found ? Number(found.npl) || 0 : 0,
      kkl_gross: found ? Number(found.kkl_gross) || 0 : 0,
      miapb: found ? Number(found.miapb) || 0 : 0,
      roa: found ? Number(found.roa) || 0 : 0,
      bopo: found ? Number(found.bopo) || 0 : 0,
      nim: found ? Number(found.nim) || 0 : 0,
      ldr: found ? Number(found.ldr) || 0 : 0,
      cash_ratio: found ? Number(found.cash_ratio) || 0 : 0,
      car: found ? Number(found.car) || Number(found.kpmm) || 0 : 0,
    };
  });

  const hasDataForSelectedYear = chartRawData.length > 0;

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 select-none">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
            <TrendingUp size={16} className="text-blue-600 shrink-0" />
            <span>GRAFIK ANALISIS TREN BULANAN INDIKATOR KEUANGAN</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualisasi pergerakan historis bulanan parameter volume usaha dan
            rasio kesehatan BPR.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 flex-1 sm:flex-initial">
            <span className="text-[11px] font-bold text-slate-500">
              Pilih BPR:
            </span>
            <select
              value={activeBprName}
              onChange={(e) => setChartBprName(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer w-full sm:w-auto"
            >
              {bprList && bprList.length > 0 ? (
                bprList.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))
              ) : (
                <option value="">Memuat BPR...</option>
              )}
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Calendar size={14} className="text-slate-400 shrink-0" />
            <span className="text-[11px] font-bold text-slate-500">Tahun:</span>
            <select
              value={activeYear}
              onChange={(e) => setSelectedChartYear(Number(e.target.value))}
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
      </div>

      {!hasDataForSelectedYear ? (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center space-y-2">
          <AlertCircle size={24} className="text-amber-500" />
          <p className="text-xs font-bold text-slate-700">
            Belum ada data tren bulanan tersedia untuk {activeBprName} pada
            tahun {activeYear}.
          </p>
          <p className="text-[11px] text-slate-400">
            Silakan pilih tahun lain atau tambahkan data melalui menu Input &
            Validasi Data.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Pertumbuhan: Total Aset, Total Kredit, dan DPK */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              1. Pertumbuhan ({activeYear}) - Jt Rp
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartRawData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="periodLabel" fontSize={11} stroke="#64748b" />
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

          {/* 2. Risiko Kredit: NPL Gross dan KKL Gross */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              2. Risiko Kredit ({activeYear}) - %
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartRawData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="periodLabel" fontSize={11} stroke="#64748b" />
                  <YAxis fontSize={11} stroke="#64748b" />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
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
                    dataKey="kkl_gross"
                    name="KKL Gross"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Rentabilitas: ROA, BOPO, dan NIM */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              3. Rentabilitas ({activeYear}) - %
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartRawData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="periodLabel" fontSize={11} stroke="#64748b" />
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

          {/* 4. Likuiditas: Cash Ratio dan LDR */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              4. Likuiditas ({activeYear}) - %
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartRawData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="periodLabel" fontSize={11} stroke="#64748b" />
                  <YAxis fontSize={11} stroke="#64748b" />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line
                    type="monotone"
                    dataKey="cash_ratio"
                    name="Cash Ratio"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ldr"
                    name="LDR"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5. Permodalan: MIAPB dan CAR/KPMM */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3 lg:col-span-2">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              5. Permodalan ({activeYear}) - %
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartRawData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="periodLabel" fontSize={11} stroke="#64748b" />
                  <YAxis fontSize={11} stroke="#64748b" />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line
                    type="monotone"
                    dataKey="miapb"
                    name="MIAPB"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="car"
                    name="CAR / KPMM"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
