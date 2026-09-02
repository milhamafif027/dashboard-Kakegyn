"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  Database,
  Save,
  CheckCircle2,
  Calendar,
  Building2,
  Trash2,
  Filter,
  Upload,
} from "lucide-react";

interface BprExistingItem {
  id: number;
  bpr_name: string;
  tahun: number;
  bulan: number;
  status: string;
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

export default function InputDataPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allRecords, setAllRecords] = useState<BprExistingItem[]>([]);
  const [existingBprs, setExistingBprs] = useState<string[]>([]);
  const [isNewBpr, setIsNewBpr] = useState<boolean>(false);

  // State untuk Filter Tabel Riwayat
  const [filterBpr, setFilterBpr] = useState<string>("ALL");
  const [filterTahun, setFilterTahun] = useState<string>("ALL");
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    bpr_name: "",
    tahun: 2026,
    bulan: 1,
    total_aset: "",
    total_kredit: "",
    dpk: "",
    kpmm: "",
    npl: "",
    kkl_gross: "",
    miapb: "",
    roa: "",
    bopo: "",
    nim: "",
    ldr: "",
    cash_ratio: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        const res = await fetch(`${baseUrl}/api/bpr`);
        const result = await res.json();
        if (result.success && result.data) {
          setAllRecords(result.data);
          const names: string[] = Array.from(
            new Set(result.data.map((item: BprExistingItem) => item.bpr_name)),
          );
          setExistingBprs(names);
          setFormData((prev) => ({
            ...prev,
            bpr_name: prev.bpr_name || (names.length > 0 ? names[0] : ""),
          }));

          const years = Array.from(
            new Set(
              result.data.map((item: BprExistingItem) => Number(item.tahun)),
            ),
          ) as number[];
          years.sort((a, b) => b - a);
          setAvailableYears(years);
        }
      } catch (err) {
        console.error("Gagal memuat daftar BPR:", err);
      }
    }

    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (file.name.endsWith(".json")) {
          const parsed = JSON.parse(content);
          setFormData((prev) => ({ ...prev, ...parsed }));
          alert("Data berkas JSON berhasil dimuat ke formulir!");
        } else {
          const lines = content.split("\n").filter((l) => l.trim() !== "");
          if (lines.length < 2) {
            alert("Format file CSV kosong atau tidak valid.");
            return;
          }

          const headerLine = lines[0];
          const delimiter = headerLine.includes(";")
            ? ";"
            : headerLine.includes("\t")
              ? "\t"
              : ",";
          const headers = headerLine
            .split(delimiter)
            .map((h) => h.trim().toLowerCase());

          const dataLine = lines[1];
          const values = dataLine.split(delimiter).map((v) => v.trim());

          // Menggunakan Record<string, string | number> alih-alih any
          const newValues: Record<string, string | number> = {};

          headers.forEach((header, index) => {
            const rawVal = values[index] || "";

            if (header.includes("bpr")) {
              newValues["bpr_name"] = rawVal;
            } else if (header.includes("periode")) {
              const parts = rawVal.split(/[- ]/);
              if (parts.length >= 2) {
                const bulanMap: Record<string, number> = {
                  jan: 1,
                  feb: 2,
                  mar: 3,
                  apr: 4,
                  may: 5,
                  jun: 6,
                  jul: 7,
                  aug: 8,
                  sep: 9,
                  oct: 10,
                  nov: 11,
                  dec: 12,
                };
                const mStr = parts[0].toLowerCase().slice(0, 3);
                if (bulanMap[mStr]) newValues["bulan"] = bulanMap[mStr];

                let yStr = parts[1];
                if (yStr.length === 2) yStr = "20" + yStr;
                const yr = Number(yStr);
                if (!isNaN(yr)) newValues["tahun"] = yr;
              }
            } else {
              const cleanNum = rawVal.replace(/\./g, "").replace(",", ".");
              const numVal = Number(cleanNum);

              if (header.includes("aset"))
                newValues["total_aset"] = isNaN(numVal) ? rawVal : cleanNum;
              else if (header.includes("kredit"))
                newValues["total_kredit"] = isNaN(numVal) ? rawVal : cleanNum;
              else if (header.includes("dpk"))
                newValues["dpk"] = isNaN(numVal) ? rawVal : cleanNum;
              else if (header.includes("kpmm") || header.includes("car"))
                newValues["kpmm"] = isNaN(numVal) ? rawVal : cleanNum;
              else if (header.includes("npl"))
                newValues["npl"] = isNaN(numVal) ? rawVal : cleanNum;
              else if (header.includes("kkl"))
                newValues["kkl_gross"] = isNaN(numVal) ? rawVal : cleanNum;
              else if (header.includes("miapb"))
                newValues["miapb"] = isNaN(numVal) ? rawVal : cleanNum;
              else if (header.includes("roa"))
                newValues["roa"] = isNaN(numVal) ? rawVal : cleanNum;
              else if (header.includes("bopo"))
                newValues["bopo"] = isNaN(numVal) ? rawVal : cleanNum;
              else if (header.includes("nim"))
                newValues["nim"] = isNaN(numVal) ? rawVal : cleanNum;
              else if (header.includes("ldr"))
                newValues["ldr"] = isNaN(numVal) ? rawVal : cleanNum;
              else if (header.includes("cash"))
                newValues["cash_ratio"] = isNaN(numVal) ? rawVal : cleanNum;
            }
          });

          setFormData((prev) => ({ ...prev, ...newValues }));
          alert(
            "File CSV berhasil dibaca dan otomatis menyesuaikan ke formulir!",
          );
        }
      } catch (err) {
        alert("Gagal memproses berkas laporan: " + err);
      }
    };
    reader.readAsText(file);
  };

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
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const res = await fetch(`${baseUrl}/api/bpr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setSuccessMessage(
          `Data indikator BPR (${formData.bpr_name}) periode Bulan ${formData.bulan} Tahun ${formData.tahun} berhasil disimpan!`,
        );
        setFormData((prev) => ({
          ...prev,
          total_aset: "",
          total_kredit: "",
          dpk: "",
          kpmm: "",
          npl: "",
          kkl_gross: "",
          miapb: "",
          roa: "",
          bopo: "",
          nim: "",
          ldr: "",
          cash_ratio: "",
        }));

        const refreshRes = await fetch(`${baseUrl}/api/bpr`);
        const refreshResult = await refreshRes.json();
        if (refreshResult.success && refreshResult.data) {
          setAllRecords(refreshResult.data);
        }
      } else {
        alert("Gagal menyimpan data: " + result.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
    id: number,
    name: string,
    bulan: number,
    tahun: number,
  ) => {
    if (
      confirm(
        `Apakah Anda yakin ingin menghapus data ${name} periode ${namaBulanLengkap[bulan]} ${tahun} secara permanen?`,
      )
    ) {
      try {
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";

        const res = await fetch(`${baseUrl}/api/bpr?id=${id}`, {
          method: "DELETE",
        });
        const result = await res.json();

        if (result.success) {
          const refreshRes = await fetch(`${baseUrl}/api/bpr`);
          const refreshResult = await refreshRes.json();
          if (refreshResult.success && refreshResult.data) {
            setAllRecords(refreshResult.data);
          }
        } else {
          alert(
            "Gagal menghapus data di server: " +
              (result.error || "Kesalahan tidak dikenal"),
          );
        }
      } catch (err) {
        console.error("Kesalahan jaringan saat menghapus:", err);
        alert("Terjadi kesalahan jaringan saat mencoba menghapus data.");
      }
    }
  };

  const filteredRecords = allRecords.filter((item) => {
    const matchBpr = filterBpr === "ALL" || item.bpr_name === filterBpr;
    const matchTahun =
      filterTahun === "ALL" || Number(item.tahun) === Number(filterTahun);
    return matchBpr && matchTahun;
  });

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto w-full">
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

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6"
          >
            {/* KOTAK INFORMASI PANDUAN FORMAT CSV */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Panduan Format CSV untuk Upload
              </h3>
              <p className="text-xs text-slate-500">
                Sistem mendukung format file CSV lama maupun baru secara
                otomatis.
              </p>
              <div className="bg-slate-900 text-emerald-400 font-mono text-[10px] p-3 rounded-lg overflow-x-auto whitespace-nowrap">
                BPR;Periode;Total Aset (Rp);Total Kredit (Rp);DPK (Rp);NPL Gross
                (%);...
              </div>
            </div>

            <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-xl space-y-2">
              <label className="block text-xs font-bold text-blue-900 flex items-center space-x-1.5">
                <Upload size={14} className="text-blue-600" />
                <span>Import Berkas Laporan (CSV / JSON Otomatis)</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <input
                  type="file"
                  accept=".csv, .json, text/plain"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 italic">
                  *Unggah berkas untuk mengisi formulir indikator secara
                  otomatis.
                </span>
              </div>
            </div>

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

            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">
                Indikator Rasio Keuangan Utama (%)
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
                    KKL Gross (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="kkl_gross"
                    value={formData.kkl_gross}
                    onChange={handleChange}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    MIAPB (%)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="miapb"
                    value={formData.miapb}
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

          {/* Tabel Manajemen / Penghapusan Data dengan Filter */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Manajemen & Riwayat Data Tersimpan
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gunakan filter di bawah untuk menyaring data riwayat sebelum
                  menghapus.
                </p>
              </div>

              {/* Area Filter */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                  <Filter size={13} className="text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-500">
                    BPR:
                  </span>
                  <select
                    value={filterBpr}
                    onChange={(e) => setFilterBpr(e.target.value)}
                    className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">Semua BPR</option>
                    {existingBprs.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                  <Calendar size={13} className="text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-500">
                    Tahun:
                  </span>
                  <select
                    value={filterTahun}
                    onChange={(e) => setFilterTahun(e.target.value)}
                    className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">Semua Tahun</option>
                    {availableYears.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200/80">
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">
                      Nama BPR
                    </th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">
                      Tahun
                    </th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">
                      Bulan
                    </th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">
                      Status
                    </th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-center w-28">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-slate-400"
                      >
                        Tidak ada data laporan yang cocok dengan filter yang
                        dipilih.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {item.bpr_name}
                        </td>
                        <td className="py-3.5 px-4">{item.tahun}</td>
                        <td className="py-3.5 px-4">
                          {namaBulanLengkap[Number(item.bulan)] || item.bulan}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                item.id,
                                item.bpr_name,
                                Number(item.bulan),
                                Number(item.tahun),
                              )
                            }
                            className="inline-flex items-center space-x-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl font-bold transition-all text-xs border border-red-200 cursor-pointer"
                            title="Hapus Data Ini"
                          >
                            <Trash2 size={13} />
                            <span>Hapus</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
