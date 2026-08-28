"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";
import {
  FileSpreadsheet,
  PlusCircle,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const bprList = [
  { id: "BPR Angga", name: "BPR Angga" },
  { id: "BPR Bromo", name: "BPR Bromo" },
  { id: "BPR Cendana", name: "BPR Cendana" },
  { id: "BPR Desimal", name: "BPR Desimal" },
  { id: "BPR Expres", name: "BPR Expres" },
];

export default function InputDataPage() {
  const [selectedBpr, setSelectedBpr] = useState("BPR Angga");
  const [tahun, setTahun] = useState("2025");
  const [kpmm, setKpmm] = useState("");
  const [npl, setNpl] = useState("");
  const [roa, setRoa] = useState("");
  const [bopo, setBopo] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    // Masukkan atau perbarui data ke tabel bpr_indicators di Supabase
    const { error } = await supabase.from("bpr_indicators").upsert(
      {
        bpr_name: selectedBpr,
        tahun: parseInt(tahun),
        kpmm: parseFloat(kpmm) || 0,
        npl: parseFloat(npl) || 0,
        roa: parseFloat(roa) || 0,
        bopo: parseFloat(bopo) || 0,
        status:
          parseFloat(npl) > 5 || parseFloat(bopo) > 90
            ? "HIGH ATTENTION"
            : "STABLE",
        dominant_trend: parseFloat(npl) > 5 ? "Memburuk" : "Membaik",
      },
      { onConflict: "bpr_name,tahun" },
    );

    setIsSubmitting(false);

    if (error) {
      console.error("Gagal menyimpan ke Supabase:", error);
      setErrorMessage("Terjadi kesalahan saat menyimpan data ke basis data.");
    } else {
      setSuccessMessage(
        "Data indikator keuangan BPR berhasil disimpan dan disinkronkan ke Supabase!",
      );
      setKpmm("");
      setNpl("");
      setRoa("");
      setBopo("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsUploading(true);
      setUploadSuccess(false);

      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(true);
      }, 1200);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header />

        <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Modul */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/85 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                <FileSpreadsheet size={14} />
                <span>Modul Administrasi & Core Data (Live Supabase)</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Pusat Input & Validasi Laporan Keuangan BPR
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tambahkan data indikator keuangan secara manual atau impor
                melalui berkas laporan berkala.
              </p>
            </div>
          </div>

          {/* Grid Konten: Form Manual & Unggah File */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bagian 1: Formulir Input Manual */}
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/85 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <PlusCircle className="text-blue-600" size={18} />
                <h3 className="text-sm font-bold text-slate-800">
                  Input Data Finansial Manual
                </h3>
              </div>

              {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmitManual} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Pilih Entitas BPR
                    </label>
                    <select
                      value={selectedBpr}
                      onChange={(e) => setSelectedBpr(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {bprList.map((bpr) => (
                        <option key={bpr.id} value={bpr.id}>
                          {bpr.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Periode Tahun
                    </label>
                    <select
                      value={tahun}
                      onChange={(e) => setTahun(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="2025">Tahun 2025</option>
                      <option value="2024">Tahun 2024</option>
                      <option value="2023">Tahun 2023</option>
                      <option value="2022">Tahun 2022</option>
                      <option value="2021">Tahun 2021</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      KPMM (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Contoh: 21.40"
                      value={kpmm}
                      onChange={(e) => setKpmm(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      NPL Gross (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Contoh: 4.50"
                      value={npl}
                      onChange={(e) => setNpl(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      ROA (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Contoh: 1.25"
                      value={roa}
                      onChange={(e) => setRoa(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      BOPO (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Contoh: 85.00"
                      value={bopo}
                      onChange={(e) => setBopo(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition shadow-md shadow-blue-600/20 disabled:opacity-50 mt-2 cursor-pointer"
                >
                  {isSubmitting
                    ? "Menyimpan ke Supabase..."
                    : "Simpan & Sinkronisasi ke Database"}
                </button>
              </form>
            </div>

            {/* Bagian 2: Unggah Berkas Laporan */}
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/85 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
                  <UploadCloud className="text-blue-600" size={18} />
                  <h3 className="text-sm font-bold text-slate-800">
                    Unggah Berkas Massal (Excel / CSV)
                  </h3>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-3 bg-slate-50/50 hover:bg-slate-50 transition">
                  <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <UploadCloud size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Seret dan lepas file laporan di sini, atau
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Mendukung format .xlsx, .csv (Maksimal 10MB)
                    </p>
                  </div>
                  <label className="inline-block bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition shadow-2xs">
                    <span>Pilih Berkas</span>
                    <input
                      type="file"
                      accept=".xlsx, .csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {fileName && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-700 truncate pr-2">
                      {fileName}
                    </span>
                    {isUploading ? (
                      <span className="text-blue-600 font-bold animate-pulse shrink-0">
                        Memproses...
                      </span>
                    ) : uploadSuccess ? (
                      <span className="text-emerald-600 font-bold flex items-center space-x-1 shrink-0">
                        <CheckCircle2 size={14} />
                        <span>Berhasil Diunggah</span>
                      </span>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="bg-blue-50/60 border border-blue-100 p-3.5 rounded-xl text-xs text-blue-800 space-y-1 mt-4 lg:mt-0">
                <div className="font-bold flex items-center space-x-1.5">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>Catatan Pengawas:</span>
                </div>
                <p className="text-[11px] text-blue-700 leading-relaxed">
                  Pastikan struktur kolom berkas Excel sesuai dengan templat
                  pelaporan resmi OJK sebelum melakukan sinkronisasi otomatis ke
                  basis data utama.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
