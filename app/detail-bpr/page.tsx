"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";
import {
  Database,
  Building2,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";

interface BprDetailRecord {
  bpr_name: string;
  tahun: number;
  total_aset: number;
  total_kredit: number;
  dpk: number;
  kpmm: number;
  npl: number;
  ppka: number;
  roa: number;
  bopo: number;
  nim: number;
  ldr: number;
  cash_ratio: number;
  status: string;
  dominant_trend: string;
}

export default function DetailBPRPage() {
  const [bprList, setBprList] = useState<string[]>([]);
  const [selectedBpr, setSelectedBpr] = useState<string>("BPR Angga");
  const [bprRecords, setBprRecords] = useState<BprDetailRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Ambil daftar nama BPR unik dari Supabase
  useEffect(() => {
    async function fetchBprNames() {
      const { data, error } = await supabase
        .from("bpr_indicators")
        .select("bpr_name");

      if (error) {
        console.error("Gagal memuat nama BPR:", error);
      } else if (data) {
        const uniqueNames = Array.from(
          new Set(data.map((item) => item.bpr_name)),
        );
        setBprList(uniqueNames);
        if (uniqueNames.length > 0 && !uniqueNames.includes(selectedBpr)) {
          setSelectedBpr(uniqueNames[0]);
        }
      }
    }
    fetchBprNames();
  }, []);

  // 2. Ambil data historis (2021-2025) untuk BPR yang sedang dipilih
  useEffect(() => {
    async function fetchBprDetails() {
      setLoading(true);
      const { data, error } = await supabase
        .from("bpr_indicators")
        .select("*")
        .eq("bpr_name", selectedBpr)
        .order("tahun", { ascending: true });

      if (error) {
        console.error("Gagal memuat detail BPR:", error);
      } else if (data) {
        setBprRecords(data as BprDetailRecord[]);
      }
      setLoading(false);
    }

    if (selectedBpr) {
      fetchBprDetails();
    }
  }, [selectedBpr]);

  // Cari data tahun awal (2021) dan akhir (2025)
  const record2021 = bprRecords.find((r) => r.tahun === 2021) || bprRecords[0];
  const record2025 =
    bprRecords.find((r) => r.tahun === 2025) ||
    bprRecords[bprRecords.length - 1];

  const currentStatus = record2025?.status || "STABLE";
  const currentTrend = record2025?.dominant_trend || "Stabil";

  // Hitung peringkat sederhana berdasarkan nama/status
  const rankMap: Record<string, number> = {
    "BPR Angga": 1,
    "BPR Desimal": 2,
    "BPR Cendana": 3,
    "BPR Bromo": 4,
    "BPR Expres": 5,
  };
  const currentRank = rankMap[selectedBpr] || 1;

  // Indikasi utama dinamis
  let mainIndication = "Kinerja keuangan stabil dan sehat secara portofolio";
  if (selectedBpr === "BPR Angga")
    mainIndication = "NPL meningkat, ROA turun, BOPO naik";
  else if (selectedBpr === "BPR Desimal")
    mainIndication = "Pertumbuhan kredit perlu diimbangi pencadangan";
  else if (selectedBpr === "BPR Cendana")
    mainIndication = "Fluktuasi pada rasio efisiensi operasional";

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />

        <main className="p-6 space-y-6">
          {/* Header & Pilihan BPR Modern */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
                <Database size={14} />
                <span>Modul Informasi Lembaga (Live Supabase)</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Detail Profil & Kinerja Keuangan BPR
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi mendalam rekam jejak historis dan status kesehatan
                entitas terpilih.
              </p>
            </div>

            {/* Tombol Pilih BPR Interaktif */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 mr-1">
                Pilih BPR:
              </span>
              {bprList.map((bprName) => {
                const isActive = bprName === selectedBpr;
                return (
                  <button
                    key={bprName}
                    onClick={() => setSelectedBpr(bprName)}
                    className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all border ${
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

          {/* Kartu Ringkasan Profil BPR Terpilih */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kartu 1: Lembaga Terpilih */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Lembaga Terpilih
                </div>
                <div className="text-xl font-extrabold text-slate-800 mt-2 flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Building2 size={20} />
                  </div>
                  <span>{selectedBpr}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                <span>Peringkat Pengawasan:</span>
                <span className="font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
                  #{currentRank} dari 5
                </span>
              </div>
            </div>

            {/* Kartu 2: Status Pengawasan */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Status Pengawasan
                </div>
                <div className="mt-2.5">
                  <span
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-extrabold tracking-wide ${
                      currentStatus === "HIGH ATTENTION"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : currentStatus === "WATCH"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {currentStatus === "HIGH ATTENTION" ? (
                      <AlertTriangle size={14} />
                    ) : (
                      <CheckCircle size={14} />
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

            {/* Kartu 3: Kecenderungan Tren */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Kecenderungan Tren (2021-2025)
                </div>
                <div className="mt-2.5">
                  <span
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-extrabold tracking-wide ${
                      currentTrend === "Memburuk"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : currentTrend === "Membaik"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}
                  >
                    <ShieldAlert size={14} />
                    <span>Dominan {currentTrend}</span>
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                Evaluasi historis multi-tahun portofolio.
              </div>
            </div>
          </div>

          {/* Tabel Detail Indikator Keuangan Historis */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Rincian Historis 11 Indikator Keuangan — {selectedBpr}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Perbandingan performa awal periode (2021) dan akhir periode
                  (2025).
                </p>
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-xl">
                {loading ? "Memuat Data..." : "Database Terverifikasi"}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200/80">
                    <th className="py-3.5 px-4 text-left border-r border-slate-200/60 font-bold uppercase tracking-wider text-[11px]">
                      Indikator Keuangan
                    </th>
                    <th className="py-3.5 px-4 border-r border-slate-200/60 font-bold">
                      Nilai 2021
                    </th>
                    <th className="py-3.5 px-4 border-r border-slate-200/60 font-bold">
                      Nilai 2025
                    </th>
                    <th className="py-3.5 px-4 font-bold">Arah Tren</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {[
                    { label: "Total Aset (Rp juta)", key: "total_aset" },
                    { label: "Total Kredit (Rp juta)", key: "total_kredit" },
                    { label: "DPK (Rp juta)", key: "dpk" },
                    { label: "KPMM (%)", key: "kpmm" },
                    { label: "NPL Gross (%)", key: "npl", alert: true },
                    { label: "Cadangan / PPKA (%)", key: "ppka" },
                    { label: "ROA (%)", key: "roa" },
                    { label: "BOPO (%)", key: "bopo", alert: true },
                    { label: "NIM (%)", key: "nim" },
                    { label: "LDR (%)", key: "ldr" },
                    { label: "Cash Ratio (%)", key: "cash_ratio" },
                  ].map((row, idx) => {
                    // Ambil nilai dengan aman menggunakan Record<string, any>
                    const rec21 = record2021 as unknown as Record<
                      string,
                      string | number
                    >;
                    const rec25 = record2025 as unknown as Record<
                      string,
                      string | number
                    >;

                    const val2021 = rec21 ? rec21[row.key] : "-";
                    const val2025 = rec25 ? rec25[row.key] : "-";

                    return (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="py-3 px-4 text-left font-semibold text-slate-600 border-r border-slate-100">
                          {row.label}
                        </td>
                        <td className="py-3 px-4 border-r border-slate-100 text-slate-600 font-semibold">
                          {typeof val2021 === "number"
                            ? val2021.toLocaleString("id-ID")
                            : String(val2021)}
                        </td>
                        <td
                          className={`py-3 px-4 border-r border-slate-100 font-bold ${
                            row.alert &&
                            typeof val2025 === "number" &&
                            val2025 > (row.key === "npl" ? 5 : 90)
                              ? "text-red-600 bg-red-50/40"
                              : "text-slate-800"
                          }`}
                        >
                          {typeof val2025 === "number"
                            ? val2025.toLocaleString("id-ID")
                            : String(val2025)}
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          <span className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-600">
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
