"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  Database,
  Save,
  CheckCircle2,
  Calendar,
  Building2,
} from "lucide-react";

interface BprExistingItem {
  bpr_name: string;
  tahun: number;
  bulan: number;
  [key: string]: unknown;
}

export default function InputDataPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [existingBprs, setExistingBprs] = useState<string[]>([]);
  const [isNewBpr, setIsNewBpr] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    bpr_name: "",
    tahun: 2026,
    bulan: 1,
    total_aset: "",
    total_kredit: "",
    dpk: "",
    kpmm: "",
    npl: "",
    ppka: "",
    roa: "",
    bopo: "",
    nim: "",
    ldr: "",
    cash_ratio: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Ambil daftar nama BPR yang sudah ada di database untuk opsi dropdown
  useState(() => {
    async function fetchBprNames() {
      try {
        const res = await fetch("/api/bpr");
        const result = await res.json();
        if (result.success && result.data) {
          const names: string[] = Array.from(
            new Set(result.data.map((item: BprExistingItem) => item.bpr_name)),
          );
          setExistingBprs(names);
          if (names.length > 0) {
            setFormData((prev) => ({ ...prev, bpr_name: names[0] }));
          }
        }
      } catch (err) {
        console.error("Gagal memuat daftar BPR:", err);
      }
    }
    fetchBprNames();
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Kalkulasi Status Pengawasan Otomatis Berdasarkan SEOJK 11/2022 & POJK 28/2023
  const calculateSystemStatus = () => {
    const npl = Number(formData.npl) || 0;
    const bopo = Number(formData.bopo) || 0;
    const kpmm = Number(formData.kpmm) || 0;
    const roa = Number(formData.roa) || 0;
    const cashRatio = Number(formData.cash_ratio) || 0;

    if (
      npl > 5 ||
      bopo > 95 ||
      (kpmm > 0 && kpmm < 12) ||
      (roa > 0 && roa < 0.5) ||
      (cashRatio > 0 && cashRatio < 5)
    ) {
      return "HIGH ATTENTION";
    } else if (
      (npl > 3 && npl <= 5) ||
      (bopo > 90 && bopo <= 95) ||
      (kpmm >= 12 && kpmm < 13) ||
      (roa >= 0.5 && roa < 1)
    ) {
      return "WATCH";
    }
    return "STABLE";
  };

  // Kalkulasi Trend Dominan Otomatis Berdasarkan Pergerakan Parameter Risiko
  const calculateSystemTrend = () => {
    const npl = Number(formData.npl) || 0;
    const roa = Number(formData.roa) || 0;
    const bopo = Number(formData.bopo) || 0;
    const kpmm = Number(formData.kpmm) || 0;

    if (npl > 4 || bopo > 92 || roa < 0.5 || kpmm < 13) {
      return "Memburuk";
    } else if (npl < 2.5 && bopo < 85 && roa > 1.5 && kpmm >= 15) {
      return "Membaik";
    }
    return "Stabil";
  };

  const systemCalculatedStatus = calculateSystemStatus();
  const systemCalculatedTrend = calculateSystemTrend();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    const payload = {
      ...formData,
      status: systemCalculatedStatus,
      dominant_trend: systemCalculatedTrend,
    };

    try {
      const res = await fetch("/api/bpr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setSuccessMessage(
          `Data indikator BPR (${formData.bpr_name}) periode Bulan ${formData.bulan} Tahun ${formData.tahun} berhasil disimpan! (Status OJK: ${systemCalculatedStatus}, Trend: ${systemCalculatedTrend})`,
        );
        setFormData((prev) => ({
          ...prev,
          total_aset: "",
          total_kredit: "",
          dpk: "",
          kpmm: "",
          npl: "",
          ppka: "",
          roa: "",
          bopo: "",
          nim: "",
          ldr: "",
          cash_ratio: "",
        }));
      } else {
        alert("Gagal menyimpan data: " + result.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Database size={14} />
                <span>Modul Manajemen Data (Standar SEOJK & POJK)</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Input Data Mentah Bulanan Indikator BPR
              </h2>
            </div>
          </div>

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form Input */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6"
          >
            {/* Opsi Pilih BPR & Periode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Pilih Entitas BPR
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewBpr(!isNewBpr);
                      setFormData((prev) => ({ ...prev, bpr_name: "" }));
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    {isNewBpr
                      ? "← Pilih dari BPR Terdaftar"
                      : "+ Tambah BPR Baru"}
                  </button>
                </div>

                {isNewBpr ? (
                  <input
                    type="text"
                    name="bpr_name"
                    required
                    placeholder="Masukkan nama BPR baru..."
                    value={formData.bpr_name}
                    onChange={handleChange}
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="relative flex items-center">
                    <Building2
                      size={15}
                      className="absolute left-3 text-slate-400"
                    />
                    <select
                      name="bpr_name"
                      value={formData.bpr_name}
                      onChange={handleChange}
                      className="w-full text-xs bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 font-bold text-slate-900 focus:outline-none cursor-pointer"
                    >
                      {existingBprs.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tahun Periode
                </label>
                <input
                  type="number"
                  name="tahun"
                  required
                  value={formData.tahun}
                  onChange={handleChange}
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                  <Calendar size={14} className="text-blue-600" />
                  <span>Pilih Bulan Pelaporan</span>
                </label>
                <select
                  name="bulan"
                  value={formData.bulan}
                  onChange={handleChange}
                  className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value={1}>Januari</option>
                  <option value={2}>Februari</option>
                  <option value={3}>Maret</option>
                  <option value={4}>April</option>
                  <option value={5}>Mei</option>
                  <option value={6}>Juni</option>
                  <option value={7}>Juli</option>
                  <option value={8}>Agustus</option>
                  <option value={9}>September</option>
                  <option value={10}>Oktober</option>
                  <option value={11}>November</option>
                  <option value={12}>Desember</option>
                </select>
              </div>
            </div>

            {/* Volume Usaha */}
            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">
                Volume Usaha (Dalam Rp Juta)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Total Aset
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="total_aset"
                    value={formData.total_aset}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Total Kredit
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="total_kredit"
                    value={formData.total_kredit}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    DPK
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="dpk"
                    value={formData.dpk}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* 11 Indikator Rasio Keuangan */}
            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">
                11 Indikator Rasio Keuangan Utama (%)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    KPMM (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="kpmm"
                    value={formData.kpmm}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    NPL Gross (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="npl"
                    value={formData.npl}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Cadangan/PPKA (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="ppka"
                    value={formData.ppka}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    ROA (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="roa"
                    value={formData.roa}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    BOPO (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="bopo"
                    value={formData.bopo}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    NIM (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="nim"
                    value={formData.nim}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    LDR (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="ldr"
                    value={formData.ldr}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Cash Ratio (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="cash_ratio"
                    value={formData.cash_ratio}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
              >
                <Save size={15} />
                <span>
                  {loading ? "Menyimpan..." : "Simpan Data Mentah Bulanan"}
                </span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
