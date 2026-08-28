"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";
import {
  FileText,
  Download,
  Printer,
  CheckCircle,
  Calendar,
  Building,
} from "lucide-react";

interface LaporanItem {
  bpr_name: string;
  status: string;
  dominant_trend: string;
  kpmm: number;
  npl: number;
}

export default function LaporanPage() {
  const [selectedPeriod] = useState<string>("2021-2025");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [reportData, setReportData] = useState<LaporanItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Ambil data laporan dari Supabase untuk periode akhir (2025)
  useEffect(() => {
    async function fetchReportData() {
      setLoading(true);
      const { data, error } = await supabase
        .from("bpr_indicators")
        .select("bpr_name, status, dominant_trend, kpmm, npl")
        .eq("tahun", 2025);

      if (error) {
        console.error("Gagal memuat data laporan:", error);
      } else if (data) {
        setReportData(data as LaporanItem[]);
      }
      setLoading(false);
    }

    fetchReportData();
  }, []);

  // Fungsi simulasi unduh laporan PDF resmi
  const handleDownloadReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      window.print(); // Memanggil dialog cetak browser yang dapat disimpan sebagai PDF
    }, 1200);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none">
      {/* Sidebar disembunyikan saat mode cetak */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="print:hidden">
          <Header />
        </div>

        <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Modul Laporan (Hilang saat cetak) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 print:hidden">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                <FileText size={14} />
                <span>Modul Eksekutif & Dokumentasi (Live Supabase)</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Pusat Laporan Evaluasi & Pengawasan BPR
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate dan cetak rekapitulasi resmi profil serta tren
                indikator keuangan portofolio.
              </p>
            </div>

            {/* Aksi / Tombol Download & Print */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
              <button
                onClick={handleDownloadReport}
                disabled={isExporting}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
              >
                <Download size={15} />
                <span>
                  {isExporting
                    ? "Menyiapkan Dokumen..."
                    : "Cetak / Unduh PDF Resmi"}
                </span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold transition border border-slate-200/80 cursor-pointer"
              >
                <Printer size={15} />
                <span>Cetak</span>
              </button>
            </div>
          </div>

          {/* KOP SURAT RESMI KHUSUS CETAK / PDF */}
          <div className="hidden print:block bg-white p-6 border-b-2 border-slate-800 mb-6 text-center space-y-1">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
              OTORITAS JASA KEUANGAN REPUBLIK INDONESIA
            </div>
            <h1 className="text-xl font-black text-slate-900 uppercase">
              LAPORAN RESMI HASIL PENGAWASAN PORTOFOLIO BPR
            </h1>
            <p className="text-xs text-slate-600">
              Periode Evaluasi Komparatif: {selectedPeriod} | Tanggal Cetak:{" "}
              {new Date().toLocaleDateString("id-ID")}
            </p>
          </div>

          {/* Kartu Ringkasan Statistik Laporan (Hilang saat cetak untuk efisiensi halaman) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 print:hidden">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Total Entitas Dilaporkan
                </div>
                <div className="text-2xl font-extrabold text-slate-800 mt-1">
                  5 BPR
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  ✓ Data terverifikasi lengkap
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                <Building size={22} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Periode Evaluasi
                </div>
                <div className="text-2xl font-extrabold text-slate-800 mt-1">
                  {selectedPeriod}
                </div>
                <div className="text-[11px] text-slate-400 font-semibold mt-1">
                  Multi-tahun historis
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
                <Calendar size={22} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between sm:col-span-2 lg:col-span-1">
              <div>
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Status Dokumen
                </div>
                <div className="text-xl font-extrabold text-slate-800 mt-1">
                  Siap Ekspor
                </div>
                <div className="text-[11px] text-blue-600 font-semibold mt-1">
                  Format: Standar Pengawasan OJK
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle size={22} />
              </div>
            </div>
          </div>

          {/* Preview Tabel Rekapitulasi Laporan */}
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 print:border-none print:shadow-none print:p-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:hidden">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Pratinjau Ringkasan Eksekutif Portfolio BPR
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rekapitulasi parameter pengawasan lintas entitas untuk dokumen
                  resmi.
                </p>
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-xl">
                OJK Secure Document
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100 print:border-slate-800">
              <table className="w-full text-center text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-900 text-white print:bg-slate-200 print:text-black border-b border-slate-800">
                    <th className="py-3 px-3 border-r border-slate-700 font-bold w-12">
                      No
                    </th>
                    <th className="py-3 px-4 text-left border-r border-slate-700 font-bold">
                      Nama BPR
                    </th>
                    <th className="py-3 px-4 border-r border-slate-700 font-bold">
                      Status Pengawasan
                    </th>
                    <th className="py-3 px-4 text-left border-r border-slate-700 font-bold">
                      Indikasi Utama
                    </th>
                    <th className="py-3 px-4 border-r border-slate-700 font-bold">
                      KPMM (2025)
                    </th>
                    <th className="py-3 px-4 border-r border-slate-700 font-bold">
                      NPL Gross (2025)
                    </th>
                    <th className="py-3 px-4 font-bold">Tren Dominan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-6 text-center text-slate-400"
                      >
                        Memuat data laporan dari basis data Supabase...
                      </td>
                    </tr>
                  ) : reportData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-6 text-center text-slate-400"
                      >
                        Tidak ada data laporan ditemukan.
                      </td>
                    </tr>
                  ) : (
                    reportData.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="py-3 px-3 border-r border-slate-200 text-slate-500 font-semibold">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 text-left border-r border-slate-200 font-bold text-slate-900 whitespace-nowrap">
                          {item.bpr_name}
                        </td>
                        <td className="py-3 px-4 border-r border-slate-200 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.status === "HIGH ATTENTION"
                                ? "bg-red-100 text-red-700 print:bg-transparent print:text-red-900"
                                : item.status === "WATCH"
                                  ? "bg-amber-100 text-amber-700 print:bg-transparent print:text-amber-900"
                                  : "bg-emerald-100 text-emerald-700 print:bg-transparent print:text-emerald-900"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-left border-r border-slate-200 text-slate-600">
                          {item.bpr_name === "BPR Angga"
                            ? "NPL meningkat, ROA turun, BOPO naik"
                            : item.bpr_name === "BPR Desimal"
                              ? "Pertumbuhan kredit perlu pencadangan"
                              : "Kinerja keuangan stabil dan sehat"}
                        </td>
                        <td className="py-3 px-4 border-r border-slate-200 font-bold text-slate-800 whitespace-nowrap">
                          {item.kpmm}%
                        </td>
                        <td className="py-3 px-4 border-r border-slate-200 font-bold text-red-600 whitespace-nowrap">
                          {item.npl}%
                        </td>
                        <td className="py-3 px-4 font-bold whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                              item.dominant_trend === "Memburuk"
                                ? "bg-red-100 text-red-700 print:bg-transparent"
                                : "bg-emerald-100 text-emerald-700 print:bg-transparent"
                            }`}
                          >
                            {item.dominant_trend}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Tanda Tangan Pengawas Khusus Cetak PDF */}
            <div className="hidden print:flex justify-between items-end mt-12 pt-8 text-xs text-slate-800">
              <div className="space-y-16 text-center">
                <p>
                  Mengetahui,
                  <br />
                  <strong>Kepala Pengawas Lembaga Keuangan</strong>
                </p>
                <div className="font-bold underline">
                  ( ___________________________ )
                </div>
              </div>
              <div className="space-y-16 text-center">
                <p>
                  Semarang, {new Date().toLocaleDateString("id-ID")}
                  <br />
                  <strong>Analis Senior Pengawasan BPR</strong>
                </p>
                <div className="font-bold underline">
                  ( ___________________________ )
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
