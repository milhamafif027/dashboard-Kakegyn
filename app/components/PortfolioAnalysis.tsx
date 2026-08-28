"use client";
import {
  AlertCircle,
  CreditCard,
  TrendingDown,
  ShieldAlert,
  PieChart,
  Activity,
} from "lucide-react";

export default function PortfolioAnalysis() {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
      {/* Analisis Awal Portofolio */}
      <div>
        <div className="flex items-center space-x-2 text-red-600 font-bold text-xs mb-2">
          <AlertCircle size={16} />
          <span>ANALISIS AWAL PORTOFOLIO</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed bg-red-50/50 p-3 rounded-lg border border-red-100">
          Terdapat tren penurunan pada permodalan, rentabilitas, pencadangan,
          dan buffer likuiditas yang disertai peningkatan NPL dan BOPO. Kondisi
          ini menjadi indikasi yang perlu mendapat perhatian dan dilakukan
          review lebih lanjut oleh Pengawas.
        </p>
      </div>

      {/* Area yang Perlu Didalami */}
      <div>
        <h3 className="text-xs font-bold text-slate-800 mb-2">
          AREA YANG PERLU DIDALAMI
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded border border-slate-100">
            <div className="flex items-center space-x-2 text-slate-700 font-medium">
              <CreditCard size={14} className="text-red-500" />
              <span>Kualitas Kredit</span>
            </div>
            <span className="text-[11px] text-slate-500">
              NPL meningkat signifikan
            </span>
          </div>
          <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded border border-slate-100">
            <div className="flex items-center space-x-2 text-slate-700 font-medium">
              <TrendingDown size={14} className="text-amber-500" />
              <span>Rentabilitas</span>
            </div>
            <span className="text-[11px] text-slate-500">
              ROA dan NIM menurun
            </span>
          </div>
          <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded border border-slate-100">
            <div className="flex items-center space-x-2 text-slate-700 font-medium">
              <Activity size={14} className="text-red-500" />
              <span>Efisiensi</span>
            </div>
            <span className="text-[11px] text-slate-500">BOPO meningkat</span>
          </div>
          <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded border border-slate-100">
            <div className="flex items-center space-x-2 text-slate-700 font-medium">
              <ShieldAlert size={14} className="text-amber-500" />
              <span>Permodalan</span>
            </div>
            <span className="text-[11px] text-slate-500">KPMM menurun</span>
          </div>
          <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded border border-slate-100">
            <div className="flex items-center space-x-2 text-slate-700 font-medium">
              <PieChart size={14} className="text-blue-500" />
              <span>Likuiditas</span>
            </div>
            <span className="text-[11px] text-slate-500">
              Cash Ratio menurun
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
