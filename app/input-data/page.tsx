"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Database, Save, CheckCircle2 } from "lucide-react";

export default function InputDataPage() {
  const [formData, setFormData] = useState({
    bpr_name: "",
    tahun: 2025,
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
    status: "STABLE",
    dominant_trend: "Stabil",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    try {
      const res = await fetch("/api/bpr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        setSuccessMessage(
          "Data 11 indikator BPR berhasil disimpan ke database lokal!",
        );
        // Reset form ringan
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
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header />

        <main className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Database size={14} />
                <span>Modul Manajemen Data (Local Database)</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Input & Perbarui 11 Indikator Keuangan BPR
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama BPR
                </label>
                <input
                  type="text"
                  name="bpr_name"
                  required
                  placeholder="Contoh: BPR Angga"
                  value={formData.bpr_name}
                  onChange={handleChange}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

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
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
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
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
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
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  />
                </div>
              </div>
            </div>

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
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
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
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
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
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
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
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
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
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
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
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
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
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
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
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status Pengawasan
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700"
                >
                  <option value="STABLE">STABLE</option>
                  <option value="WATCH">WATCH</option>
                  <option value="HIGH ATTENTION">HIGH ATTENTION</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trend Dominan
                </label>
                <select
                  name="dominant_trend"
                  value={formData.dominant_trend}
                  onChange={handleChange}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700"
                >
                  <option value="Stabil">Stabil</option>
                  <option value="Membaik">Membaik</option>
                  <option value="Memburuk">Memburuk</option>
                </select>
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
                  {loading ? "Menyimpan..." : "Simpan Data Indikator"}
                </span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
