"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  FileText,
  Download,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
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

interface BprItem {
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
  car?: number;
  dominant_trend: string;
  [key: string]: unknown;
}

const namaBulanLengkap = [
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

export default function LaporanPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bprNames, setBprNames] = useState<string[]>([]);
  const [selectedBpr, setSelectedBpr] = useState<string>("");

  const [availableYears, setAvailableYears] = useState<number[]>([2026]);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const [allBprData, setAllBprData] = useState<BprItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchBprList() {
      try {
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        const res = await fetch(`${baseUrl}/api/bpr`);
        const result = await res.json();
        if (result.success && result.data) {
          const names: string[] = Array.from(
            new Set(result.data.map((item: BprItem) => item.bpr_name)),
          );
          setBprNames(names);
          if (names.length > 0) setSelectedBpr(names[0]);

          const yearsSet = new Set<number>();
          result.data.forEach((item: { tahun: unknown }) => {
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
        console.error("Gagal memuat daftar BPR dan tahun:", err);
      }
    }
    fetchBprList();
  }, []);

  useEffect(() => {
    async function fetchBprReport() {
      if (!selectedBpr) return;
      setLoading(true);
      try {
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        const res = await fetch(
          `${baseUrl}/api/bpr?bpr_name=${encodeURIComponent(selectedBpr)}`,
        );
        const result = await res.json();
        if (result.success && result.data) {
          const sorted = result.data.sort((a: BprItem, b: BprItem) => {
            if (Number(a.tahun) !== Number(b.tahun)) {
              return Number(a.tahun) - Number(b.tahun);
            }
            return Number(a.bulan || 1) - Number(b.bulan || 1);
          });
          setAllBprData(sorted);
        }
      } catch (err) {
        console.error("Gagal memuat data laporan BPR:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBprReport();
  }, [selectedBpr]);

  const currentYearMonthlyData = Array.from({ length: 12 }, (_, index) => {
    const bulanNum = index + 1;
    const found = allBprData.find(
      (item) =>
        Number(item.tahun) === selectedYear && Number(item.bulan) === bulanNum,
    );
    return {
      tahun: selectedYear,
      bulan: bulanNum,
      bulanLabel: namaBulanLengkap[bulanNum],
      total_aset: found ? Number(found.total_aset) || 0 : 0,
      total_kredit: found ? Number(found.total_kredit) || 0 : 0,
      dpk: found ? Number(found.dpk) || 0 : 0,
      kpmm: found ? Number(found.kpmm ?? found.car ?? 0) || 0 : 0,
      npl: found ? Number(found.npl) || 0 : 0,
      kkl_gross: found ? Number(found.kkl_gross) || 0 : 0,
      miapb: found ? Number(found.miapb) || 0 : 0,
      roa: found ? Number(found.roa) || 0 : 0,
      bopo: found ? Number(found.bopo) || 0 : 0,
      nim: found ? Number(found.nim) || 0 : 0,
      ldr: found ? Number(found.ldr) || 0 : 0,
      cash_ratio: found ? Number(found.cash_ratio) || 0 : 0,
      dominant_trend: found
        ? String(found.dominant_trend || "Stabil")
        : "Stabil",
    };
  });

  const validRowsForYear = allBprData.filter(
    (item) => Number(item.tahun) === selectedYear,
  );
  const latestData = validRowsForYear[validRowsForYear.length - 1] || {};

  const prevYearRows = allBprData.filter(
    (item) => Number(item.tahun) === selectedYear - 1,
  );
  const prevData = prevYearRows[prevYearRows.length - 1] || latestData;

  const getTrendIndicator = (current: number, previous: number) => {
    if (current > previous) {
      return (
        <span className="inline-flex items-center text-emerald-600 font-bold">
          <ArrowUpRight size={14} /> Meningkat
        </span>
      );
    } else if (current < previous) {
      return (
        <span className="inline-flex items-center text-red-600 font-bold">
          <ArrowDownRight size={14} /> Menurun
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-blue-600 font-bold">
        <ArrowRight size={14} /> Stabil
      </span>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Kontrol Navigasi & Filter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 print:hidden">
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">
                  Dokumen Laporan Evaluasi Bulanan ({selectedYear})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Laporan kinerja bulanan murni untuk entitas BPR terpilih.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <Building2 size={15} className="text-slate-400 shrink-0" />
                <select
                  value={selectedBpr}
                  onChange={(e) => setSelectedBpr(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  {bprNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Tahun Dinamis */}
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <Calendar size={15} className="text-slate-400 shrink-0" />
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

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20 cursor-pointer shrink-0 ml-auto lg:ml-0"
              >
                <Download size={14} />
                <span>Cetak Laporan</span>
              </button>
            </div>
          </div>

          {/* KERTAS LAPORAN */}
          <div
            id="printable-report"
            className="bg-white p-8 sm:p-14 rounded-2xl border border-slate-200/90 shadow-sm space-y-6 text-xs text-slate-900 leading-relaxed font-sans"
          >
            {loading ? (
              <div className="py-20 text-center text-xs text-slate-400">
                Menyusun laporan bulanan...
              </div>
            ) : (
              <div className="space-y-6">
                {/* HEADER: Tren & Analis BPR */}
                <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                  <div>
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Tren & Analis BPR
                    </div>
                    <h1 className="text-base font-black text-slate-900 mt-0.5">
                      Entitas: {selectedBpr || "BPR Terlapor"} (Tahun{" "}
                      {selectedYear})
                    </h1>
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                    Periode: Tahun Anggaran {selectedYear}
                  </div>
                </div>

                {/* ISI LAPORAN */}
                <div className="space-y-6 text-slate-700">
                  {/* Ringkasan Parameter */}
                  <div className="space-y-2 pt-1 section-block">
                    <div className="font-bold text-slate-900 text-xs">
                      1. Ringkasan Posisi Terakhir ({selectedYear})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">
                          Total Aset
                        </div>
                        <div className="text-xs font-black text-slate-900">
                          Rp{" "}
                          {(Number(latestData.total_aset) || 0).toLocaleString(
                            "id-ID",
                          )}{" "}
                          Jt
                        </div>
                        <div className="text-[10px]">
                          {getTrendIndicator(
                            Number(latestData.total_aset) || 0,
                            Number(prevData.total_aset) || 0,
                          )}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">
                          Total Kredit
                        </div>
                        <div className="text-xs font-black text-slate-900">
                          Rp{" "}
                          {(
                            Number(latestData.total_kredit) || 0
                          ).toLocaleString("id-ID")}{" "}
                          Jt
                        </div>
                        <div className="text-[10px]">
                          {getTrendIndicator(
                            Number(latestData.total_kredit) || 0,
                            Number(prevData.total_kredit) || 0,
                          )}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">
                          Dana Pihak Ketiga (DPK)
                        </div>
                        <div className="text-xs font-black text-slate-900">
                          Rp{" "}
                          {(Number(latestData.dpk) || 0).toLocaleString(
                            "id-ID",
                          )}{" "}
                          Jt
                        </div>
                        <div className="text-[10px]">
                          {getTrendIndicator(
                            Number(latestData.dpk) || 0,
                            Number(prevData.dpk) || 0,
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grafik Visualisasi Bulanan (1 Tahun) */}
                  <div className="space-y-3 pt-2 section-block">
                    <div className="font-bold text-slate-900 text-xs">
                      2. Grafik Pergerakan Tren Bulanan ({selectedYear})
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                        <div className="text-[11px] font-bold text-slate-700">
                          Volume Usaha Bulanan (Aset, Kredit, DPK)
                        </div>
                        <div className="h-52 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={currentYearMonthlyData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#cbd5e1"
                              />
                              <XAxis dataKey="bulanLabel" fontSize={9} />
                              <YAxis fontSize={9} />
                              <Tooltip />
                              <Legend wrapperStyle={{ fontSize: "9px" }} />
                              <Line
                                type="monotone"
                                dataKey="total_aset"
                                name="Aset"
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="total_kredit"
                                name="Kredit"
                                stroke="#16a34a"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="dpk"
                                name="DPK"
                                stroke="#9333ea"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                        <div className="text-[11px] font-bold text-slate-700">
                          Rasio Utama Bulanan (KPMM, NPL, ROA, BOPO)
                        </div>
                        <div className="h-52 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={currentYearMonthlyData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#cbd5e1"
                              />
                              <XAxis dataKey="bulanLabel" fontSize={9} />
                              <YAxis fontSize={9} />
                              <Tooltip />
                              <Legend wrapperStyle={{ fontSize: "9px" }} />
                              <Line
                                type="monotone"
                                dataKey="kpmm"
                                name="KPMM"
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="npl"
                                name="NPL"
                                stroke="#dc2626"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="roa"
                                name="ROA"
                                stroke="#16a34a"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="bopo"
                                name="BOPO"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabel Rekapitulasi Per Bulan (Mengalir Natural, Bisa Banyak Halaman) */}
                  <div className="space-y-2 pt-4 section-block">
                    <div className="font-bold text-slate-900 text-xs">
                      3. Matriks Rekapitulasi Bulanan Tahun {selectedYear}
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-center text-[10px] border-collapse whitespace-nowrap">
                        <thead>
                          <tr className="bg-slate-900 text-white">
                            <th className="py-2.5 px-2 text-left sticky left-0 bg-slate-900 z-10">
                              Bulan
                            </th>
                            <th className="py-2.5 px-2">Aset (Jt)</th>
                            <th className="py-2.5 px-2">Kredit (Jt)</th>
                            <th className="py-2.5 px-2">DPK (Jt)</th>
                            <th className="py-2.5 px-2">KPMM(%)</th>
                            <th className="py-2.5 px-2">NPL(%)</th>
                            <th className="py-2.5 px-2">KKL(%)</th>
                            <th className="py-2.5 px-2">MIAPB(%)</th>
                            <th className="py-2.5 px-2">ROA(%)</th>
                            <th className="py-2.5 px-2">BOPO(%)</th>
                            <th className="py-2.5 px-2">NIM(%)</th>
                            <th className="py-2.5 px-2">LDR(%)</th>
                            <th className="py-2.5 px-2">CashR(%)</th>
                            <th className="py-2.5 px-2 text-right">Trend</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {currentYearMonthlyData.map((row) => (
                            <tr
                              key={row.bulan}
                              className="hover:bg-slate-50 table-row-item"
                            >
                              <td className="py-2 px-2 text-left font-bold text-slate-900 sticky left-0 bg-white z-10">
                                {row.bulanLabel}
                              </td>
                              <td className="py-2 px-2">
                                {row.total_aset
                                  ? row.total_aset.toLocaleString("id-ID")
                                  : 0}
                              </td>
                              <td className="py-2 px-2">
                                {row.total_kredit
                                  ? row.total_kredit.toLocaleString("id-ID")
                                  : 0}
                              </td>
                              <td className="py-2 px-2">
                                {row.dpk ? row.dpk.toLocaleString("id-ID") : 0}
                              </td>
                              <td className="py-2 px-2 font-bold text-blue-600">
                                {Number(row.kpmm || 0).toFixed(2)}
                              </td>
                              <td
                                className={`py-2 px-2 font-bold ${Number(row.npl || 0) > 5 ? "text-red-600 bg-red-50" : "text-slate-800"}`}
                              >
                                {Number(row.npl || 0).toFixed(2)}
                              </td>
                              <td className="py-2 px-2">
                                {Number(row.kkl_gross || 0).toFixed(2)}
                              </td>
                              <td className="py-2 px-2">
                                {Number(row.miapb || 0).toFixed(2)}
                              </td>
                              <td className="py-2 px-2">
                                {Number(row.roa || 0).toFixed(2)}
                              </td>
                              <td
                                className={`py-2 px-2 font-bold ${Number(row.bopo || 0) > 95 ? "text-red-600 bg-red-50" : "text-slate-800"}`}
                              >
                                {Number(row.bopo || 0).toFixed(2)}
                              </td>
                              <td className="py-2 px-2">
                                {Number(row.nim || 0).toFixed(2)}
                              </td>
                              <td className="py-2 px-2">
                                {Number(row.ldr || 0).toFixed(2)}
                              </td>
                              <td className="py-2 px-2">
                                {Number(row.cash_ratio || 0).toFixed(2)}
                              </td>
                              <td className="py-2 px-2 text-right uppercase font-bold text-[9px]">
                                {row.dominant_trend}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Penutup Ringkas */}
                  <div className="pt-6 flex justify-between items-center border-t border-slate-100 text-[11px] text-slate-500 section-block">
                    <div>Dokumen Analisis Otomatis Sistem Pengawasan BPR</div>
                    <div className="text-right">
                      <div>Jakarta, {currentDate}</div>
                      <div className="font-bold text-slate-800 pt-4">
                        Tim Pengawas BPR
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CSS Khusus Cetak Fleksibel Multi-Halaman */}
      {/* CSS Khusus Cetak Fleksibel Multi-Halaman */}
      <style jsx global>{`
        @media print {
          html,
          body,
          div#__next,
          div {
            height: auto !important;
            overflow: visible !important;
            background: white !important;
          }
          nav,
          aside,
          header,
          .print\:hidden {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            display: block !important;
          }
          #printable-report {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            display: block !important;
          }
          .section-block {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .table-row-item {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
