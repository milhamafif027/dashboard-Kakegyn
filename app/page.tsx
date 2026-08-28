"use client";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import KpiGrid from "./components/KpiGrid";
import SummaryTable from "./components/SummaryTable";
import ReviewPriority from "./components/ReviewPriority";
import { supabase } from "./lib/supabase";
import { Activity, AlertTriangle, Search } from "lucide-react";

interface BprSummaryItem {
  id: string;
  name: string;
  evaluationNote: string;
  deepDiveArea: string;
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bprList, setBprList] = useState<BprSummaryItem[]>([]);
  const [selectedBprId, setSelectedBprId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Ambil data dari Supabase untuk tahun 2025
  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      const { data, error } = await supabase
        .from("bpr_indicators")
        .select("bpr_name, status")
        .eq("tahun", 2025);

      if (error) {
        console.error("Gagal memuat data dasbor:", error);
      } else if (data && data.length > 0) {
        const formattedList: BprSummaryItem[] = data.map((item, index) => ({
          id: `bpr-${index}`,
          name: item.bpr_name,
          evaluationNote:
            item.bpr_name === "BPR Angga"
              ? "Terdeteksi kenaikan rasio NPL Gross melampaui batas toleransi normal yang diiringi penurunan profitabilitas ROA serta pembengkakan BOPO."
              : item.bpr_name === "BPR Desimal"
                ? "Pertumbuhan kredit yang agresif memerlukan penguatan cadangan kerugian penurunan nilai (PPKA) secara bertahap."
                : "Kinerja operasional dan parameter likuiditas terpantau dalam kondisi stabil, sehat, dan sesuai ambang batas ketentuan OJK.",
          deepDiveArea:
            item.bpr_name === "BPR Angga"
              ? "Efisiensi Biaya Operasional & Kualitas Kolektibilitas Kredit"
              : item.bpr_name === "BPR Desimal"
                ? "Kecukupan Pencadangan & Laju Pertumbuhan Kredit"
                : "Konsistensi Pertumbuhan Portofolio Sehat",
        }));

        setBprList(formattedList);
        setSelectedBprId(formattedList[0].id);
      }
      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  const activeBpr = bprList.find((b) => b.id === selectedBprId) ||
    bprList[0] || {
      name: "Memuat...",
      evaluationNote: "Memuat data evaluasi...",
      deepDiveArea: "Memuat area pendalaman...",
    };

  return (
    <div className="min-h-screen md:h-screen flex bg-slate-100 relative overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-y-auto">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full flex-1">
          {/* Header Ringkas / Overview Atas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">
                Jumlah BPR Diawasi
              </div>
              <div className="text-xl font-extrabold text-slate-800 mt-1">
                {loading ? "..." : `${bprList.length} Entitas`}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">
                Periode Evaluasi
              </div>
              <div className="text-xl font-extrabold text-slate-800 mt-1">
                2021 — 2025
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">
                Jumlah Indikator
              </div>
              <div className="text-xl font-extrabold text-slate-800 mt-1">
                11 Indikator Utama
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] font-bold text-red-500 uppercase">
                BPR Perlu Perhatian
              </div>
              <div className="text-xl font-extrabold text-red-600 mt-1">
                2 Entitas
              </div>
            </div>
          </div>

          {/* Grid KPI Portofolio dengan Mini Grafik */}
          <KpiGrid />

          {/* Tabel Rekapitulasi 11 Indikator Multi-Tahun */}
          <SummaryTable />

          {/* Grid Evaluasi & Prioritas Review */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReviewPriority />

            {/* Evaluasi Tren & Area Pendalaman Pengawas */}
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-xs md:text-sm font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
                    <Activity size={16} className="text-blue-600 shrink-0" />
                    <span>EVALUASI TREN & PENDALAMAN PENGAWAS</span>
                  </h3>
                  <select
                    value={selectedBprId}
                    onChange={(e) => setSelectedBprId(e.target.value)}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none w-full sm:w-auto cursor-pointer"
                  >
                    {bprList.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-amber-800 flex items-center space-x-1.5">
                    <AlertTriangle
                      size={14}
                      className="text-amber-600 shrink-0"
                    />
                    <span>Catatan Evaluasi Tren ({activeBpr.name}):</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    {activeBpr.evaluationNote}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Area yang Perlu Didalami Pengawas
                </div>
                <div className="text-sm font-black text-slate-800 flex items-start sm:items-center space-x-2">
                  <Search
                    size={16}
                    className="text-blue-600 shrink-0 mt-0.5 sm:mt-0"
                  />
                  <span>{activeBpr.deepDiveArea}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
