"use client";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import KpiGrid from "./components/KpiGrid";
import SummaryTable from "./components/SummaryTable";
import ReviewPriority from "./components/ReviewPriority";
import { bprSummaryList } from "./data/mockData";
import { Activity, AlertTriangle, Search } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const [selectedBprId, setSelectedBprId] = useState("bpr-angga");
  const activeBpr =
    bprSummaryList.find((b) => b.id === selectedBprId) || bprSummaryList[0];

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        <main className="p-6 space-y-6">
          {/* Header Ringkas / Overview Atas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">
                Jumlah BPR Diawasi
              </div>
              <div className="text-xl font-extrabold text-slate-800 mt-1">
                5 Entitas
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
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
                    <Activity size={16} className="text-blue-600" />
                    <span>EVALUASI TREN & PENDALAMAN PENGAWAS</span>
                  </h3>
                  <select
                    value={selectedBprId}
                    onChange={(e) => setSelectedBprId(e.target.value)}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none"
                  >
                    {bprSummaryList.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-amber-800 flex items-center space-x-1.5">
                    <AlertTriangle size={14} className="text-amber-600" />
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
                <div className="text-sm font-black text-slate-800 flex items-center space-x-2">
                  <Search size={16} className="text-blue-600" />
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
