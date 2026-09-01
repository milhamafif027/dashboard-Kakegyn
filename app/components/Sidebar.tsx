"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart2,
  FileText,
  Database,
  ShieldCheck,
  ChevronRight,
  FileSpreadsheet,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Menu navigasi utama
  const menuItems = [
    { name: "Dashboard Utama", href: "/", icon: LayoutDashboard },
    {
      name: "Input & Validasi Data",
      href: "/input-data",
      icon: FileSpreadsheet,
    },
    { name: "Perbandingan BPR", href: "/perbandingan", icon: BarChart2 },
    { name: "Detail BPR", href: "/detail-bpr", icon: Database },
    { name: "Laporan Pengawasan", href: "/laporan", icon: FileText },
  ];

  return (
    <>
      {/* Backdrop transparan khusus mobile saat sidebar terbuka */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Konten Sidebar dengan Posisi Fixed di Mobile & Relative di Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 md:relative z-50 w-68 h-screen bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800 shadow-2xl select-none transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Header Identitas OJK & Tombol Close Mobile */}
          <div className="p-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600"></div>
            <div className="flex items-center space-x-3.5">
              <div className="bg-red-600/15 border border-red-500/30 p-2.5 rounded-xl text-red-500 flex items-center justify-center shadow-inner">
                <ShieldCheck size={22} className="text-red-500" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-white text-base tracking-wider">
                    OJK
                  </span>
                  <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Core
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium tracking-tight mt-0.5">
                  Pengawasan BPR
                </p>
              </div>
            </div>

            {/* Tombol silang khusus mobile */}
            <button
              onClick={onClose}
              className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              aria-label="Tutup Menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu Navigasi Utama */}
          <div className="py-5 px-3.5 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Modul Pengawasan
            </div>

            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-bold"
                      : "hover:bg-slate-800/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-500/30 text-white"
                          : "bg-slate-800/80 text-slate-400 group-hover:text-slate-200"
                      }`}
                    >
                      <IconComponent size={16} />
                    </div>
                    <span>{item.name}</span>
                  </div>

                  <ChevronRight
                    size={14}
                    className={`transition-transform duration-200 ${
                      isActive
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer / Status Sistem */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-300 font-medium">Core System</span>
            </div>
            <span className="text-slate-500 font-mono text-[10px]">v2.4</span>
          </div>
        </div>
      </aside>
    </>
  );
}
