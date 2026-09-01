"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  BarChart2,
  Calendar,
  Building2,
  CheckSquare,
  Square,
  Filter,
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

interface BprComparisonItem {
  bpr_name: string;
  tahun: number;
  bulan: number;
  total_aset: number;
  total_kredit: number;
  dpk: number;
  kpmm: number;
  car?: number;
  npl: number;
  kkl_gross: number;
  miapb: number;
  ppka: number;
  roa: number;
  bopo: number;
  nim: number;
  ldr: number;
  cash_ratio: number;
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

export default function PerbandinganPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rawData, setRawData] = useState<BprComparisonItem[]>([]);
  const [allAvailableBprs, setAllAvailableBprs] = useState<string[]>([]);
  const [selectedBprs, setSelectedBprs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State daftar tahun dinamis dari database dan rentang fallback
  const [availableYears, setAvailableYears] = useState<number[]>([2026]);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedBulan, setSelectedBulan] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("all");

  // 1. Ambil daftar tahun yang tersedia di database terlebih dahulu saat komponen dimuat
  useEffect(() => {
    async function fetchAllYears() {
      try {
        const res = await fetch("/api/bpr");
        const result = await res.json();
        if (result.success && result.data) {
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
        console.error("Gagal memuat daftar tahun:", err);
      }
    }
    fetchAllYears();
  }, []);

  // 2. Ambil data spesifik berdasarkan tahun & bulan yang dipilih
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/bpr?tahun=${selectedYear}&bulan=${selectedBulan}`,
        );
        const result = await res.json();
        if (result.success && result.data) {
          const uniqueData = result.data.filter(
            (
              item: BprComparisonItem,
              index: number,
              self: BprComparisonItem[],
            ) => index === self.findIndex((t) => t.bpr_name === item.bpr_name),
          );

          setRawData(uniqueData);

          const bprNames = uniqueData.map(
            (item: BprComparisonItem) => item.bpr_name,
          );
          setAllAvailableBprs(bprNames);

          // Default pilih semua BPR jika belum ada yang dipilih atau saat ganti periode
          setSelectedBprs((prev) =>
            prev.length === 0
              ? bprNames
              : prev.filter((name) => bprNames.includes(name)),
          );
        }
      } catch (err) {
        console.error("Gagal memuat data perbandingan:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedYear, selectedBulan]);

  // Fungsi toggle pilih/batal pilih BPR
  const handleToggleBpr = (bprName: string) => {
    setSelectedBprs((prev) =>
      prev.includes(bprName)
        ? prev.filter((name) => name !== bprName)
        : [...prev, bprName],
    );
  };

  // Pilih Semua BPR
  const handleSelectAll = () => {
    setSelectedBprs(allAvailableBprs);
  };

  // Batalkan Semua Pilihan BPR
  const handleDeselectAll = () => {
    setSelectedBprs([]);
  };

  // Filter data tabel dan grafik sesuai BPR yang dicentang
  const filteredData = rawData.filter((item) =>
    selectedBprs.includes(item.bpr_name),
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header & Filter Periode */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <BarChart2 size={20} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">
                  Komparasi Antar BPR ({namaBulanLengkap[selectedBulan]}{" "}
                  {selectedYear})
                </h2>
                <p className="text-xs text-slate-500">
                  Pilih entitas BPR dan bandingkan indikator keuangannya secara
                  berdampingan.
                </p>
              </div>
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

              {/* Filter Tahun Dinamis Berdasarkan Database */}
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

          {/* PANEL FILTER PILIH BPR CUSTOM */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                <Filter size={15} className="text-blue-600" />
                <span>
                  Filter Entitas BPR untuk Perbandingan ({selectedBprs.length}{" "}
                  Dipilih)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg transition cursor-pointer"
                >
                  Pilih Semua
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg transition cursor-pointer"
                >
                  Hapus Pilihan
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {allAvailableBprs.map((bprName) => {
                const isSelected = selectedBprs.includes(bprName);
                return (
                  <button
                    key={bprName}
                    type="button"
                    onClick={() => handleToggleBpr(bprName)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare size={14} />
                    ) : (
                      <Square size={14} className="text-slate-400" />
                    )}
                    <span>{bprName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400 font-medium">
              Memuat data komparasi bulanan...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 font-medium bg-white rounded-2xl border border-slate-200">
              Silakan centang minimal satu BPR di atas untuk melihat tabel dan
              grafik perbandingan.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tabel Matriks Komparasi dengan Filter Kategori */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                    <Building2 size={16} className="text-blue-600" />
                    <span>
                      Matriks Komparasi BPR Terpilih (
                      {namaBulanLengkap[selectedBulan]} {selectedYear})
                    </span>
                  </h3>

                  <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-3 py-1 text-[11px] font-extrabold rounded-lg transition-all ${
                        activeTab === "all"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Semua
                    </button>
                    <button
                      onClick={() => setActiveTab("volume")}
                      className={`px-3 py-1 text-[11px] font-extrabold rounded-lg transition-all ${
                        activeTab === "volume"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Volume Usaha
                    </button>
                    <button
                      onClick={() => setActiveTab("risiko")}
                      className={`px-3 py-1 text-[11px] font-extrabold rounded-lg transition-all ${
                        activeTab === "risiko"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Risiko & Permodalan
                    </button>
                    <button
                      onClick={() => setActiveTab("rentabilitas")}
                      className={`px-3 py-1 text-[11px] font-extrabold rounded-lg transition-all ${
                        activeTab === "rentabilitas"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Rentabilitas & Efisiensi
                    </button>
                    <button
                      onClick={() => setActiveTab("likuiditas")}
                      className={`px-3 py-1 text-[11px] font-extrabold rounded-lg transition-all ${
                        activeTab === "likuiditas"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Likuiditas
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-center text-xs border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="py-3 px-4 text-left">Nama BPR</th>
                        {(activeTab === "all" || activeTab === "volume") && (
                          <>
                            <th className="py-3 px-3">Aset (Jt Rp)</th>
                            <th className="py-3 px-3">Kredit (Jt Rp)</th>
                            <th className="py-3 px-3">DPK (Jt Rp)</th>
                          </>
                        )}
                        {(activeTab === "all" || activeTab === "risiko") && (
                          <>
                            <th className="py-3 px-3">KPMM/CAR (%)</th>
                            <th className="py-3 px-3">NPL Gross (%)</th>
                            <th className="py-3 px-3">KKL Gross (%)</th>
                            <th className="py-3 px-3">MIAPB (%)</th>
                            <th className="py-3 px-3">PPKA (%)</th>
                          </>
                        )}
                        {(activeTab === "all" ||
                          activeTab === "rentabilitas") && (
                          <>
                            <th className="py-3 px-3">ROA (%)</th>
                            <th className="py-3 px-3">BOPO (%)</th>
                            <th className="py-3 px-3">NIM (%)</th>
                          </>
                        )}
                        {(activeTab === "all" ||
                          activeTab === "likuiditas") && (
                          <>
                            <th className="py-3 px-3">LDR (%)</th>
                            <th className="py-3 px-3">Cash Ratio (%)</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-3 px-4 text-left font-bold text-slate-900">
                            {row.bpr_name}
                          </td>
                          {(activeTab === "all" || activeTab === "volume") && (
                            <>
                              <td className="py-3 px-3">
                                {Number(row.total_aset || 0).toLocaleString(
                                  "id-ID",
                                )}
                              </td>
                              <td className="py-3 px-3">
                                {Number(row.total_kredit || 0).toLocaleString(
                                  "id-ID",
                                )}
                              </td>
                              <td className="py-3 px-3">
                                {Number(row.dpk || 0).toLocaleString("id-ID")}
                              </td>
                            </>
                          )}
                          {(activeTab === "all" || activeTab === "risiko") && (
                            <>
                              <td className="py-3 px-3 font-bold text-blue-600">
                                {Number(row.kpmm ?? row.car ?? 0).toFixed(2)}
                              </td>
                              <td
                                className={`py-3 px-3 font-bold ${Number(row.npl || 0) > 5 ? "text-red-600 bg-red-50/50" : ""}`}
                              >
                                {Number(row.npl || 0).toFixed(2)}
                              </td>
                              <td className="py-3 px-3">
                                {Number(row.kkl_gross || 0).toFixed(2)}
                              </td>
                              <td className="py-3 px-3">
                                {Number(row.miapb || 0).toFixed(2)}
                              </td>
                              <td className="py-3 px-3">
                                {Number(row.ppka || 0).toFixed(2)}
                              </td>
                            </>
                          )}
                          {(activeTab === "all" ||
                            activeTab === "rentabilitas") && (
                            <>
                              <td className="py-3 px-3">
                                {Number(row.roa || 0).toFixed(2)}
                              </td>
                              <td
                                className={`py-3 px-3 font-bold ${Number(row.bopo || 0) > 95 ? "text-red-600 bg-red-50/50" : ""}`}
                              >
                                {Number(row.bopo || 0).toFixed(2)}
                              </td>
                              <td className="py-3 px-3">
                                {Number(row.nim || 0).toFixed(2)}
                              </td>
                            </>
                          )}
                          {(activeTab === "all" ||
                            activeTab === "likuiditas") && (
                            <>
                              <td className="py-3 px-3">
                                {Number(row.ldr || 0).toFixed(2)}
                              </td>
                              <td className="py-3 px-3">
                                {Number(row.cash_ratio || 0).toFixed(2)}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* VISUALISASI GRAFIK KOMPARASI ANTAR BPR TERPILIH */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Visualisasi Grafik Komparasi BPR Terpilih (
                    {namaBulanLengkap[selectedBulan]} {selectedYear})
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Grafik perbandingan menyesuaikan dengan entitas BPR yang
                    Anda centang pada filter di atas.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-700">
                      1. Komparasi Volume Usaha (Juta Rp)
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredData}>
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

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-700">
                      2. Komparasi Risiko Kredit & Aset (%)
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredData}>
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
                          <Line
                            type="monotone"
                            dataKey="miapb"
                            name="MIAPB"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-700">
                      3. Komparasi Rentabilitas & Efisiensi (%)
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredData}>
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

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-700">
                      4. Komparasi Likuiditas & Permodalan (%)
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredData}>
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
                          <Line
                            type="monotone"
                            dataKey="kpmm"
                            name="CAR/KPMM"
                            stroke="#16a34a"
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
