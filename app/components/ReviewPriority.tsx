"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Printer, Calendar, Building2 } from "lucide-react";

interface LaporanItem {
  id: number;
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
}

const namaBulanPendek = [
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
  const [records, setRecords] = useState<LaporanItem[]>([]);
  const [existingBprs, setExistingBprs] = useState<string[]>([]);
  const [selectedBpr, setSelectedBpr] = useState<string>("");
  const [selectedTahun, setSelectedTahun] = useState<number>(2026);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        const res = await fetch(`${baseUrl}/api/bpr`);
        const result = await res.json();
        if (result.success && result.data) {
          setRecords(result.data);
          const names: string[] = Array.from(
            new Set(result.data.map((item: LaporanItem) => item.bpr_name)),
          );
          setExistingBprs(names);
          if (names.length > 0 && !selectedBpr) {
            setSelectedBpr(names[0]);
          }
        }
      } catch (err) {
        console.error("Gagal memuat data laporan:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter data sesuai BPR dan Tahun yang dipilih
  const filteredData = records.filter(
    (item) =>
      item.bpr_name === selectedBpr && Number(item.tahun) === selectedTahun,
  );

  // Petakan data ke 12 bulan (jika kosong diisi 0)
  const monthlyDataMap = Array.from({ length: 12 }, (_, index) => {
    const bulanIndex = index + 1;
    const found = filteredData.find(
      (item) => Number(item.bulan) === bulanIndex,
    );
    return {
      bulan: bulanIndex,
      namaBulan: namaBulanPendek[bulanIndex],
      total_aset: found ? Number(found.total_aset) || 0 : 0,
      total_kredit: found ? Number(found.total_kredit) || 0 : 0,
      dpk: found ? Number(found.dpk) || 0 : 0,
      kpmm: found ? Number(found.kpmm) || 0 : 0,
      npl: found ? Number(found.npl) || 0 : 0,
      kkl_gross: found ? Number(found.kkl_gross) || 0 : 0,
      miapb: found ? Number(found.miapb) || 0 : 0,
      roa: found ? Number(found.roa) || 0 : 0,
      bopo: found ? Number(found.bopo) || 0 : 0,
      nim: found ? Number(found.nim) || 0 : 0,
      ldr: found ? Number(found.ldr) || 0 : 0,
      cash_ratio: found ? Number(found.cash_ratio) || 0 : 0,
    };
  });

  // Ambil data posisi terakhir yang tersedia untuk ringkasan
  const latestRecord = filteredData[filteredData.length - 1];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none relative">
      {/* CSS Global khusus cetak agar terbagi rapi ke beberapa halaman */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            height: auto !important;
            overflow: visible !important;
          }
          nav,
          aside,
          header,
          .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            overflow: visible !important;
          }
          .print-container {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          tr,
          .page-break-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="no-print">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        <div className="no-print">
          <Header onOpenSidebar={() => setSidebarOpen(true)} />
        </div>

        <main className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto w-full">
          {/* Panel Kontrol Atas (Tidak ikut tercetak) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4 no-print">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <Building2 size={15} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500">BPR:</span>
                <select
                  value={selectedBpr}
                  onChange={(e) => setSelectedBpr(e.target.value)}
                  className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer"
                >
                  {existingBprs.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <Calendar size={15} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500">Tahun:</span>
                <select
                  value={selectedTahun}
                  onChange={(e) => setSelectedTahun(Number(e.target.value))}
                  className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                </select>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Printer size={15} />
              <span>Cetak / Export PDF</span>
            </button>
          </div>

          {/* Area Dokumen Laporan yang akan Dicetak */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 print-container">
            {/* Kop / Header Laporan */}
            <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  TREN & ANALISIS BPR
                </span>
                <h1 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  Entitas: {selectedBpr || "Pilih BPR"} ({selectedTahun})
                </h1>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p className="font-bold">
                  Periode: Tahun Anggaran {selectedTahun}
                </p>
              </div>
            </div>

            {/* 1. Ringkasan Posisi Terakhir */}
            <div className="space-y-3 page-break-avoid">
              <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                1. Ringkasan Posisi Terakhir ({selectedTahun})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    TOTAL ASET
                  </span>
                  <p className="text-base font-extrabold text-slate-900 mt-1">
                    Rp{" "}
                    {latestRecord
                      ? latestRecord.total_aset.toLocaleString("id-ID")
                      : "0"}{" "}
                    Jt
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    TOTAL KREDIT
                  </span>
                  <p className="text-base font-extrabold text-slate-900 mt-1">
                    Rp{" "}
                    {latestRecord
                      ? latestRecord.total_kredit.toLocaleString("id-ID")
                      : "0"}{" "}
                    Jt
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    DANA PIHAK KETIGA (DPK)
                  </span>
                  <p className="text-base font-extrabold text-slate-900 mt-1">
                    Rp{" "}
                    {latestRecord
                      ? latestRecord.dpk.toLocaleString("id-ID")
                      : "0"}{" "}
                    Jt
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Matriks Rekapitulasi Bulanan (Januari - Desember) */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                2. Matriks Rekapitulasi Bulanan Tahun {selectedTahun}
              </h2>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-[11px] border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                      <th className="py-2.5 px-3">Bulan</th>
                      <th className="py-2.5 px-3">Aset (Jt)</th>
                      <th className="py-2.5 px-3">Kredit (Jt)</th>
                      <th className="py-2.5 px-3">DPK (Jt)</th>
                      <th className="py-2.5 px-3">KPMM(%)</th>
                      <th className="py-2.5 px-3">NPL(%)</th>
                      <th className="py-2.5 px-3">KKL(%)</th>
                      <th className="py-2.5 px-3">MIAPB(%)</th>
                      <th className="py-2.5 px-3">ROA(%)</th>
                      <th className="py-2.5 px-3">BOPO(%)</th>
                      <th className="py-2.5 px-3">NIM(%)</th>
                      <th className="py-2.5 px-3">LDR(%)</th>
                      <th className="py-2.5 px-3">CashR(%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={13}
                          className="py-6 text-center text-slate-400"
                        >
                          Memuat rekapitulasi data...
                        </td>
                      </tr>
                    ) : (
                      monthlyDataMap.map((row) => (
                        <tr key={row.bulan} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            {row.namaBulan}
                          </td>
                          <td className="py-2.5 px-3">
                            {row.total_aset
                              ? row.total_aset.toLocaleString("id-ID")
                              : "0"}
                          </td>
                          <td className="py-2.5 px-3">
                            {row.total_kredit
                              ? row.total_kredit.toLocaleString("id-ID")
                              : "0"}
                          </td>
                          <td className="py-2.5 px-3">
                            {row.dpk ? row.dpk.toLocaleString("id-ID") : "0"}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-blue-600">
                            {row.kpmm ? row.kpmm.toFixed(2) : "0.00"}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-red-600">
                            {row.npl ? row.npl.toFixed(2) : "0.00"}
                          </td>
                          <td className="py-2.5 px-3">
                            {row.kkl_gross ? row.kkl_gross.toFixed(2) : "0.00"}
                          </td>
                          <td className="py-2.5 px-3">
                            {row.miapb ? row.miapb.toFixed(2) : "0.00"}
                          </td>
                          <td className="py-2.5 px-3">
                            {row.roa ? row.roa.toFixed(2) : "0.00"}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            {row.bopo ? row.bopo.toFixed(2) : "0.00"}
                          </td>
                          <td className="py-2.5 px-3">
                            {row.nim ? row.nim.toFixed(2) : "0.00"}
                          </td>
                          <td className="py-2.5 px-3">
                            {row.ldr ? row.ldr.toFixed(2) : "0.00"}
                          </td>
                          <td className="py-2.5 px-3">
                            {row.cash_ratio
                              ? row.cash_ratio.toFixed(2)
                              : "0.00"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
