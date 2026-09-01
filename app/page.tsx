"use client";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import KpiGrid from "./components/KpiGrid";
import SummaryTable from "./components/SummaryTable";
import TrendCharts from "./components/TrendCharts";
import ReviewPriority from "./components/ReviewPriority";
import EvaluationCard from "./components/EvaluationCard";
import { Database } from "lucide-react";

interface BprSummaryItem {
  id: string;
  name: string;
  evaluationNote: string;
  deepDiveArea: string;
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bprList, setBprList] = useState<BprSummaryItem[]>([]);
  const [rawApiData, setRawApiData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State rentang tahun dinamis dari database (fallback ke tahun berjalan)
  const [minYear, setMinYear] = useState<number>(2026);
  const [maxYear, setMaxYear] = useState<number>(2026);

  // Ambil SELURUH data historis multi-tahun & bulanan dari API MySQL
  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/bpr`);
        const result = await res.json();
        const data = result.data;

        if (!isMounted) return;

        if (result.error) {
          console.error("Gagal memuat data dasbor:", result.error);
        } else if (data && data.length > 0) {
          setRawApiData(data);

          // Ekstrak daftar tahun unik secara dinamis
          const yearsSet = new Set<number>();
          data.forEach((item: Record<string, unknown>) => {
            const y = Number(item.tahun);
            if (!isNaN(y) && y > 0) {
              yearsSet.add(y);
            }
          });

          if (yearsSet.size > 0) {
            const yearsArr = Array.from(yearsSet).sort((a, b) => a - b);
            setMinYear(yearsArr[0]);
            setMaxYear(yearsArr[yearsArr.length - 1]);
          }

          const uniqueBprNames: string[] = Array.from(
            new Set(
              data.map((item: Record<string, unknown>) =>
                String(item.bpr_name || ""),
              ),
            ),
          );

          const formattedList: BprSummaryItem[] = uniqueBprNames.map(
            (bprName: string, index: number) => ({
              id: `bpr-${index}`,
              name: bprName,
              evaluationNote: "",
              deepDiveArea: "",
            }),
          );

          setBprList(formattedList);
        } else {
          setBprList([]);
          setRawApiData([]);
        }
      } catch (err) {
        console.error("Kesalahan jaringan saat mengambil data dasbor:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Hitung jumlah entitas BPR dan total record bulanan secara dinamis dari database
  const totalBprCount = bprList.length;
  const totalRecordsCount = rawApiData.length;

  return (
    <div className="min-h-screen md:h-screen flex bg-slate-100 relative overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-y-auto w-full">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto w-full flex-1">
          {/* Header Ringkasan Atas */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3 text-slate-800">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Database size={20} />
              </div>
              <div>
                <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                  Modul Pengawasan Makro BPR
                </h3>
                <div className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">
                  Dashboard Analisis Keuangan Terpadu ({minYear} — {maxYear})
                </div>
              </div>
            </div>

            <div className="text-[11px] font-bold bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl w-full sm:w-auto text-center shrink-0">
              Database Lokal MySQL Terhubung
            </div>
          </div>

          {/* Grid Ringkas Atas (Dinamis Berbasis Database) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Jumlah BPR Terdaftar
              </div>
              <div className="text-base sm:text-xl font-extrabold text-slate-800 mt-1">
                {loading ? "Memuat..." : `${totalBprCount} Entitas`}
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Total Data Periode Masuk
              </div>
              <div className="text-base sm:text-xl font-extrabold text-slate-800 mt-1">
                {loading ? "Memuat..." : `${totalRecordsCount} Rekaman Laporan`}
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                Status Koneksi Database
              </div>
              <div className="text-base sm:text-xl font-extrabold text-emerald-600 mt-1">
                {loading ? "Menghubungkan..." : "Sinkronisasi Aktif"}
              </div>
            </div>
          </div>

          <KpiGrid startYear={minYear} endYear={maxYear} data={rawApiData} />
          <SummaryTable
            startYear={minYear}
            endYear={maxYear}
            data={rawApiData}
          />
          <TrendCharts
            bprList={bprList}
            startYear={minYear}
            endYear={maxYear}
            data={rawApiData}
          />

          {/* Grid Evaluasi & Prioritas Review */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <ReviewPriority />

            {/* Komponen Evaluasi Terpisah yang Dinamis Berbasis Data */}
            <EvaluationCard bprList={bprList} rawApiData={rawApiData} />
          </div>
        </main>
      </div>
    </div>
  );
}
