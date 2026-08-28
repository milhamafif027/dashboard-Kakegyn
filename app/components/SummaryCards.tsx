"use client";
import {
  Building2,
  AlertTriangle,
  Eye,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total BPR */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            Total Dimonitor
          </span>
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition">
            <Building2 size={18} />
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-3">
          <div className="text-3xl font-extrabold text-slate-800">5</div>
          <span className="text-xs font-semibold text-slate-500">
            Entitas BPR
          </span>
        </div>
      </div>

      {/* High Attention */}
      <div className="bg-white border border-red-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-red-600 tracking-wider uppercase">
            High Attention
          </span>
          <div className="p-2 rounded-xl bg-red-50 text-red-600 group-hover:scale-110 transition">
            <AlertTriangle size={18} />
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-3">
          <div className="text-3xl font-extrabold text-red-600">1</div>
          <span className="text-xs font-semibold text-red-600/80">
            Perlu Tindakan
          </span>
        </div>
      </div>

      {/* Watch */}
      <div className="bg-white border border-amber-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-amber-600 tracking-wider uppercase">
            Watch List
          </span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition">
            <Eye size={18} />
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-3">
          <div className="text-3xl font-extrabold text-amber-600">1</div>
          <span className="text-xs font-semibold text-amber-600/80">
            Pemantauan Ketat
          </span>
        </div>
      </div>

      {/* Stable */}
      <div className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-emerald-600 tracking-wider uppercase">
            Stable
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition">
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-3">
          <div className="text-3xl font-extrabold text-emerald-600">3</div>
          <span className="text-xs font-semibold text-emerald-600/80">
            Kondisi Sehat
          </span>
        </div>
      </div>

      {/* Informasi Sistem OJK */}
      <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-5 rounded-2xl shadow-md flex flex-col justify-between">
        <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs">
          <ShieldAlert size={16} />
          <span>Fokus Pengawasan</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed mt-2">
          Evaluasi tren permodalan & kualitas aset BPR terintegrasi OJK Core.
        </p>
      </div>
    </div>
  );
}
