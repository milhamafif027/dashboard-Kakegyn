"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EvaluationCard from "../components/EvaluationCard";
import {
  Database,
  Building2,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  Calendar,
} from "lucide-react";
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

interface BprDetailRecord {
  bpr_name: string;
  tahun: number;
  bulan: number;
  total_aset: number;
  total_kredit: number;
  dpk: number;
  kpmm: number;
  npl: number;
  kkl_gross: number;
  miapb: number;
  roa: number;
  bopo: number;
  nim: number;
  ldr: number;
  cash_ratio: number;
  status: string;
  dominant_trend: string;
  [key: string]: unknown;
}

const namaBulanLengkap = [
  "",
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function DetailBPRPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bprList, setBprList] = useState<string[]>([]);
  const [selectedBpr, setSelectedBpr] = useState<string>("BPR Angga");

  const [availableYears, setAvailableYears] = useState<number[]>([2026]);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedBulan, setSelectedBulan] = useState<number>(1);

  const [bprRecords, setBprRecords] = useState<BprDetailRecord[]>([]);
  const [allRawData, setAllRawData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetaData() {
      try {
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        const res = await fetch(`${baseUrl}/api/bpr`);
        const result = await res.json();
        const data = result.data;

        if (result.error) {
          console.error("Gagal memuat data dari database:", result.error);
        } else if (data) {
          setAllRawData(data);
          const uniqueNames = Array.from(
            new Set(
              data.map(
                (item: Record<string, unknown>) => item.bpr_name as string,
              ),
            ),
          ) as string[];
          setBprList(uniqueNames);
          if (uniqueNames.length > 0 && !uniqueNames.includes(selectedBpr)) {
            setSelectedBpr(uniqueNames[0]);
          }

          const yearsSet = new Set<number>();
          data.forEach((item: { tahun: unknown }) => {
            const y = Number(item.tahun);
            if (!isNaN(y) && y > 0) {
              yearsSet.add(y);
            }
          });
          const years: number[] = Array.from(yearsSet).sort((a, b) => a - b);
          if (years.length > 0) {
            setAvailableYears(years);
            setSelectedYear((prev) =>
              years.includes(prev) ? prev : years[years.length - 1],
            );
          }
        }
      } catch (err) {
        console.error("Kesalahan jaringan saat mengambil metadata BPR:", err);
      }
    }
    fetchMetaData();
  }, []);

  useEffect(() => {
    async function fetchBprDetails() {
      setLoading(true);
      try {
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        const res = await fetch(
          `${baseUrl}/api/bpr?bpr_name=${encodeURIComponent(selectedBpr)}`,
        );
        const result = await res.json();
        const data = result.data;

        if (result.error) {
          console.error("Gagal memuat detail BPR:", result.error);
        } else if (data) {
          const sorted = data.sort(
            (a: Record<string, unknown>, b: Record<string, unknown>) => {
              if (Number(a.tahun) !== Number(b.tahun)) {
                return Number(a.tahun) - Number(b.tahun);
              }
              return Number(a.bulan) - Number(b.bulan);
            },
          );
          setBprRecords(sorted as BprDetailRecord[]);
        }
      } catch (err) {
        console.error("Kesalahan jaringan saat mengambil detail BPR:", err);
      } finally {
        setLoading(false);
      }
    }

    if (selectedBpr) {
      fetchBprDetails();
    }
  }, [selectedBpr]);

  const recordAwal = bprRecords[0];
  const recordAkhir =
    bprRecords.find(
      (r) =>
        Number(r.tahun) === selectedYear && Number(r.bulan) === selectedBulan,
    ) || bprRecords[bprRecords.length - 1];

  const rawStatus = recordAkhir?.status || "STABLE";
  const nplVal = Number(recordAkhir?.npl || 0);

  // Pemetaan label status baru yang konsisten
  let currentStatus: "PERLU PERHATIAN" | "ANALISIS LEBIH LANJUT" | "BAIK" =
    "BAIK";
  if (
    rawStatus === "HIGH ATTENTION" ||
    rawStatus === "WARNING" ||
    nplVal > 5.0
  ) {
    currentStatus = "PERLU PERHATIAN";
  } else if (rawStatus === "WATCH" || nplVal > 3.5) {
    currentStatus = "ANALISIS LEBIH LANJUT";
  } else {
    currentStatus = "BAIK";
  }

  const currentTrend = recordAkhir?.dominant_trend || "Stabil";

  const rankMap: Record<string, number> = {
    "BPR Angga": 1,
    "BPR Desimal": 2,
    "BPR Makmur": 3,
    "BPR Sejahtera": 4,
    "BPR Lestari": 5,
  };
  const currentRank = rankMap[selectedBpr] || 1;

  let mainIndication = "Kinerja keuangan stabil dan sehat secara portofolio.";
  if (selectedBpr === "BPR Angga")
    mainIndication =
      "NPL sempat meningkat pada pertengahan tahun, kini berangsur pulih.";
  else if (selectedBpr === "BPR Desimal")
    mainIndication = "Pertumbuhan kredit ekspansif dengan likuiditas terjaga.";
  else if (selectedBpr === "BPR Makmur")
    mainIndication = "Efisiensi operasional sangat baik dengan ROA tinggi.";
  else if (selectedBpr === "BPR Sejahtera")
    mainIndication =
      "Skala aset besar dengan pengawasan reguler pada kualitas aset.";
  else if (selectedBpr === "BPR Lestari")
    mainIndication =
      "Permodalan (CAR) sangat kuat dan likuiditas sangat sehat.";

  const chartDataYear = bprRecords.filter(
    (r) => Number(r.tahun) === selectedYear,
  );

  const evaluationBprList = bprList.map((name, idx) => ({
    id: String(idx + 1),
    name: name,
  }));

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header & Pilihan BPR Modern */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Database size={14} />
                <span>Modul Informasi Lembaga (Local Database)</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Detail Profil & Kinerja Keuangan BPR
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi mendalam rekam jejak historis bulanan dan status
                kesehatan entitas terpilih.
              </p>
            </div>

            {/* Tombol Pilih BPR Interaktif */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <span className="text-xs font-semibold text-slate-400 mr-1">
                Pilih BPR:
              </span>
              {bprList.map((bprName) => {
                const isActive = bprName === selectedBpr;
                return (
                  <button
                    key={bprName}
                    onClick={() => setSelectedBpr(bprName)}
                    className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all border cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                        : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    {bprName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Periode Evaluasi (Bulan & Tahun Dinamis) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs font-extrabold text-slate-700">
              Periode Evaluasi Aktif:{" "}
              <span className="text-blue-600">
                {namaBulanLengkap[selectedBulan]} {selectedYear}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <span className="text-[11px] font-bold text-slate-500">
                  Bulan:
                </span>
                <select
                  value={selectedBulan}
                  onChange={(e) => setSelectedBulan(Number(e.target.value))}
                  className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer"
                >
                  {namaBulanLengkap.slice(1).map((m, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Tahun Dinamis */}
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
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
          </div>

          {/* Kartu Ringkasan Profil BPR Terpilih */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Lembaga Terpilih
                </div>
                <div className="text-xl font-extrabold text-slate-800 mt-2 flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                    <Building2 size={20} />
                  </div>
                  <span className="truncate">{selectedBpr}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                <span>Peringkat Portofolio:</span>
                <span className="font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
                  #{currentRank} dari {bprList.length || 5}
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Status Pengawasan ({namaBulanLengkap[selectedBulan]}{" "}
                  {selectedYear})
                </div>
                <div className="mt-2.5">
                  <span
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-extrabold tracking-wide ${
                      currentStatus === "PERLU PERHATIAN"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : currentStatus === "ANALISIS LEBIH LANJUT"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {currentStatus === "PERLU PERHATIAN" ? (
                      <AlertTriangle size={14} className="shrink-0" />
                    ) : (
                      <CheckCircle size={14} className="shrink-0" />
                    )}
                    <span>{currentStatus}</span>
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 truncate">
                Indikasi:{" "}
                <strong className="text-slate-800">{mainIndication}</strong>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Kecenderungan Tren Bulanan
                </div>
                <div className="mt-2.5">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-extrabold tracking-wide bg-blue-100 text-blue-700 border border-blue-200">
                    <ShieldAlert size={14} className="shrink-0" />
                    <span>{currentTrend}</span>
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                Evaluasi historis multi-tahun portofolio.
              </div>
            </div>
          </div>

          {/* INTEGRASI KARTU EVALUASI PENGAWAS */}
          <EvaluationCard bprList={evaluationBprList} rawApiData={allRawData} />

          {/* 5 GRAFIK UTAMA PERSIS SEPERTI DASHBOARD */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Grafik Analisis Tren Bulanan — {selectedBpr} ({selectedYear})
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Visualisasi pergerakan historis bulanan parameter volume usaha
                dan rasio kesehatan BPR.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* 1. PERTUMBUHAN */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between h-80">
                <div className="text-xs font-bold text-slate-700">
                  1. PERTUMBUHAN ({selectedYear}) - JT RP
                </div>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDataYear}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="bulan"
                        fontSize={10}
                        stroke="#64748b"
                        tickFormatter={(m) =>
                          namaBulanLengkap[m]?.slice(0, 3) || m
                        }
                      />
                      <YAxis fontSize={10} stroke="#64748b" />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: "10px" }} />
                      <Line
                        type="monotone"
                        dataKey="dpk"
                        name="DPK"
                        stroke="#9333ea"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
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
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 2. RISIKO KREDIT */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between h-80">
                <div className="text-xs font-bold text-slate-700">
                  2. RISIKO KREDIT ({selectedYear}) - %
                </div>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDataYear}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="bulan"
                        fontSize={10}
                        stroke="#64748b"
                        tickFormatter={(m) =>
                          namaBulanLengkap[m]?.slice(0, 3) || m
                        }
                      />
                      <YAxis fontSize={10} stroke="#64748b" />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: "10px" }} />
                      <Line
                        type="monotone"
                        dataKey="kkl_gross"
                        name="KKL Gross"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
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
                        dataKey="npl"
                        name="NPL Gross"
                        stroke="#dc2626"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 3. RENTABILITAS */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between h-80">
                <div className="text-xs font-bold text-slate-700">
                  3. RENTABILITAS ({selectedYear}) - %
                </div>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDataYear}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="bulan"
                        fontSize={10}
                        stroke="#64748b"
                        tickFormatter={(m) =>
                          namaBulanLengkap[m]?.slice(0, 3) || m
                        }
                      />
                      <YAxis fontSize={10} stroke="#64748b" />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: "10px" }} />
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
                      <Line
                        type="monotone"
                        dataKey="roa"
                        name="ROA"
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 4. LIKUIDITAS */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between h-80">
                <div className="text-xs font-bold text-slate-700">
                  4. LIKUIDITAS ({selectedYear}) - %
                </div>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDataYear}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="bulan"
                        fontSize={10}
                        stroke="#64748b"
                        tickFormatter={(m) =>
                          namaBulanLengkap[m]?.slice(0, 3) || m
                        }
                      />
                      <YAxis fontSize={10} stroke="#64748b" />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: "10px" }} />
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

              {/* 5. PERMODALAN / CAR (KPMM) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between h-80">
                <div className="text-xs font-bold text-slate-700">
                  5. PERMODALAN / CAR (KPMM) ({selectedYear}) - %
                </div>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDataYear}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="bulan"
                        fontSize={10}
                        stroke="#64748b"
                        tickFormatter={(m) =>
                          namaBulanLengkap[m]?.slice(0, 3) || m
                        }
                      />
                      <YAxis fontSize={10} stroke="#64748b" />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: "10px" }} />
                      <Line
                        type="monotone"
                        dataKey="kpmm"
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
          </div>

          {/* Tabel Detail Indikator Keuangan Historis (LENGKAP 12 INDIKATOR) */}
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Rincian 12 Indikator Keuangan Utama — {selectedBpr}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Perbandingan awal periode vs periode laporan (
                  {namaBulanLengkap[selectedBulan]} {selectedYear}).
                </p>
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-xl shrink-0">
                {loading ? "Memuat Data..." : "Database Lokal Terverifikasi"}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-center text-xs border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200/80">
                    <th className="py-3.5 px-4 text-left border-r border-slate-200/60 font-bold uppercase tracking-wider text-[11px]">
                      Indikator Keuangan
                    </th>
                    <th className="py-3.5 px-4 border-r border-slate-200/60 font-bold w-36">
                      Nilai Awal
                    </th>
                    <th className="py-3.5 px-4 border-r border-slate-200/60 font-bold w-36">
                      Nilai ({namaBulanLengkap[selectedBulan].slice(0, 3)}{" "}
                      {selectedYear})
                    </th>
                    <th className="py-3.5 px-4 font-bold w-36">Arah Tren</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {[
                    {
                      label: "Total Aset (Rp juta)",
                      key: "total_aset",
                      isCurrency: true,
                    },
                    {
                      label: "Total Kredit (Rp juta)",
                      key: "total_kredit",
                      isCurrency: true,
                    },
                    { label: "DPK (Rp juta)", key: "dpk", isCurrency: true },
                    { label: "KPMM / CAR (%)", key: "kpmm" },
                    { label: "NPL Gross (%)", key: "npl", alert: true },
                    { label: "KKL Gross (%)", key: "kkl_gross" },
                    { label: "MIAPB (%)", key: "miapb" },
                    { label: "ROA (%)", key: "roa" },
                    { label: "BOPO (%)", key: "bopo", alert: true },
                    { label: "NIM (%)", key: "nim" },
                    { label: "LDR (%)", key: "ldr" },
                    { label: "Cash Ratio (%)", key: "cash_ratio" },
                  ].map((row, idx) => {
                    const valAwal = recordAwal
                      ? Number(recordAwal[row.key] || 0)
                      : 0;
                    const valAkhir = recordAkhir
                      ? Number(recordAkhir[row.key] || 0)
                      : 0;

                    return (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="py-3 px-4 text-left font-semibold text-slate-600 border-r border-slate-100">
                          {row.label}
                        </td>
                        <td className="py-3 px-4 border-r border-slate-100 text-slate-600 font-semibold">
                          {row.isCurrency
                            ? valAwal.toLocaleString("id-ID")
                            : valAwal.toFixed(2)}
                        </td>
                        <td
                          className={`py-3 px-4 border-r border-slate-100 font-bold ${
                            row.alert && valAkhir > (row.key === "npl" ? 5 : 95)
                              ? "text-red-600 bg-red-50/40"
                              : "text-slate-800"
                          }`}
                        >
                          {row.isCurrency
                            ? valAkhir.toLocaleString("id-ID")
                            : valAkhir.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          <span className="inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                            {currentTrend}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
