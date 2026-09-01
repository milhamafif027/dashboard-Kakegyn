"use client";
import { Calendar, ShieldCheck, Menu } from "lucide-react";

interface HeaderProps {
  onOpenSidebar?: () => void;
  periodeLabel?: string; // Opsional: teks periode dinamis jika ingin dikirim dari halaman utama
}

export default function Header({ onOpenSidebar, periodeLabel }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sticky top-0 z-30 shadow-2xs">
      {/* Judul Utama & Tombol Menu Mobile */}
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center space-x-2.5">
          {/* Tombol Hamburger khusus mobile */}
          <button
            onClick={onOpenSidebar}
            className="md:hidden text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            aria-label="Buka Menu"
          >
            <Menu size={20} />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
                OJK • Pengawasan BPR
              </span>
            </div>
            <h1 className="text-sm sm:text-lg font-extrabold text-slate-800 tracking-tight mt-0.5">
              Tren dan Analisis Keuangan BPR 
            </h1>
          </div>
        </div>
      </div>

      {/* Bagian Kanan: Periode & Profil */}
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
        {/* Periode Badge Dinamis */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs text-slate-700">
          <Calendar size={14} className="text-blue-600 shrink-0" />
          <span className="text-slate-400 font-medium">Sistem:</span>
          <span className="font-bold text-slate-800">
            {periodeLabel || "Live Database OJK"}
          </span>
        </div>

        {/* Profil Pengawas Minimalis */}
        <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 shrink-0">
            <ShieldCheck size={16} />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-[10px] text-slate-400 font-bold uppercase leading-none">
              Analis
            </div>
            <div className="text-xs font-extrabold text-slate-800 mt-0.5">
              Pengawas BPR
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
