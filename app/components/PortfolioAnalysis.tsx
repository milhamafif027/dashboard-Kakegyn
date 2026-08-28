"use client";
import {
  ArrowDownRight,
  CreditCard,
  TrendingDown,
  ShieldAlert,
  PieChart,
  Activity,
} from "lucide-react";

export default function PortfolioAnalysis() {
  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-5 select-none">
      {/* Analisis Awal Portofolio */}
      <div>
        <div className="flex items-center space-x-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-2">
          <ArrowDownRight size={16} className="stroke-[3]" />
          <span>ANALISIS AWAL PORTOFOLIO</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed bg-red-50/60 p-3.5 rounded-xl border border-red-100/80 font-medium">
          Terdapat tren penurunan pada permodalan, rentabilitas, pencadangan,
          dan buffer likuiditas yang disertai peningkatan NPL dan BOPO. Kondisi
          ini menjadi indikasi yang perlu mendapat perhatian dan dilakukan
          review lebih lanjut oleh Pengawas.
        </p>
      </div>

      {/* Area yang Perlu Didalami */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
          Area yang Perlu Didalami
        </h3>
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-2 text-slate-700 font-bold">
              <CreditCard size={14} className="text-red-500 shrink-0" />
              <span>Kualitas Kredit</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              NPL meningkat signifikan
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-2 text-slate-700 font-bold">
              <TrendingDown size={14} className="text-amber-500 shrink-0" />
              <span>Rentabilitas</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              ROA dan NIM menurun
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-2 text-slate-700 font-bold">
              <Activity size={14} className="text-red-500 shrink-0" />
              <span>Efisiensi</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              BOPO meningkat
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-2 text-slate-700 font-bold">
              <ShieldAlert size={14} className="text-amber-500 shrink-0" />
              <span>Permodalan</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              KPMM menurun
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-2 text-slate-700 font-bold">
              <PieChart size={14} className="text-blue-500 shrink-0" />
              <span>Likuiditas</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Cash Ratio menurun
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
