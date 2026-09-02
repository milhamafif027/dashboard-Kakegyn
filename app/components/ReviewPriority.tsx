"use client";
import { useState, useEffect } from "react";
import { ArrowUpDown, Calendar } from "lucide-react";

interface ReviewItem {
  id: string;
  rank: number;
  name: string;
  statusText: "PERLU PERHATIAN" | "ANALISIS LEBIH LANJUT" | "BAIK";
  rawStatus: string;
  npl: number;
  bopo: number;
  roa: number;
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

export default function ReviewPriority() {
  const [bprList, setBprList] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Default disesuaikan ke 2026 dan bulan 7 (Juli) atau bulan awal data
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedBulan, setSelectedBulan] = useState<number>(7);
  const [availableYears, setAvailableYears] = useState<number[]>([2026]);

  // Ambil daftar tahun unik dari API/database saat pertama kali dimuat
  useEffect(() => {
    async function fetchAvailableYears() {
      try {
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        const res = await fetch(`${baseUrl}/api/bpr`);
        const result = await res.json();
        if (result.success && result.data) {
          const yearsSet = new Set<number>();
          result.data.forEach((item: Record<string, unknown>) => {
            const y = Number(item.tahun);
            if (!isNaN(y) && y > 0) {
              yearsSet.add(y);
            }
          });
          if (yearsSet.size > 0) {
            const yearsArr = Array.from(yearsSet).sort((a, b) => b - a);
            setAvailableYears(yearsArr);
            setSelectedYear(yearsArr[0]); // Pilih tahun terbaru secara default
          }
        }
      } catch (err) {
        console.error("Gagal memuat tahun filter:", err);
      }
    }
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    async function fetchReviewData() {
      setLoading(true);
      try {
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        const res = await fetch(
          `${baseUrl}/api/bpr?tahun=${selectedYear}&bulan=${selectedBulan}`,
        );
        const result = await res.json();
        const data = result.data;

        if (result.error) {
          console.error("Gagal memuat data prioritas review:", result.error);
        } else if (data) {
          const uniqueBprRows = data.filter(
            (
              item: Record<string, unknown>,
              index: number,
              self: Record<string, unknown>[],
            ) => index === self.findIndex((t) => t.bpr_name === item.bpr_name),
          );

          const mapped: ReviewItem[] = uniqueBprRows.map(
            (row: Record<string, unknown>) => {
              const name = row.bpr_name as string;
              const originalStatus = (row.status as string) || "STABLE";
              const npl = Number(row.npl) || 0;
              const roa = Number(row.roa) || 0;
              const bopo = Number(row.bopo) || 0;

              let mappedStatus:
                | "PERLU PERHATIAN"
                | "ANALISIS LEBIH LANJUT"
                | "BAIK" = "BAIK";

              if (
                originalStatus === "HIGH ATTENTION" ||
                originalStatus === "WARNING" ||
                npl > 5
              ) {
                mappedStatus = "PERLU PERHATIAN";
              } else if (originalStatus === "WATCH" || npl > 3.5) {
                mappedStatus = "ANALISIS LEBIH LANJUT";
              } else {
                mappedStatus = "BAIK";
              }

              let rank = 3;
              if (mappedStatus === "PERLU PERHATIAN") rank = 1;
              else if (mappedStatus === "ANALISIS LEBIH LANJUT") rank = 2;

              return {
                id: name,
                rank,
                name,
                statusText: mappedStatus,
                rawStatus: originalStatus,
                npl,
                bopo,
                roa,
              };
            },
          );

          mapped.sort((a, b) => a.rank - b.rank);
          setBprList(mapped);
        } else {
          setBprList([]);
        }
      } catch (err) {
        console.error("Kesalahan jaringan saat mengambil data prioritas:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReviewData();
  }, [selectedYear, selectedBulan]);

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 select-none">
      <div>
        {/* Header & Filter Bulan + Tahun */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
              <ArrowUpDown size={16} className="text-blue-600" />
              <span>PRIORITAS REVIEW & PENGAWASAN BPR</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Periode Laporan: {namaBulanLengkap[selectedBulan]} {selectedYear}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Filter Bulan */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <span className="text-[10px] font-bold text-slate-500">
                Bulan:
              </span>
              <select
                value={selectedBulan}
                onChange={(e) => setSelectedBulan(Number(e.target.value))}
                className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer"
              >
                {namaBulanLengkap.slice(1).map((m, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Tahun */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <Calendar size={14} className="text-slate-400 shrink-0" />
              <span className="text-[10px] font-bold text-slate-500">
                Tahun:
              </span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer"
              >
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabel Prioritas Review (Tanpa Kolom Indikasi Utama) */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 pb-1">
          <table className="w-full text-left text-xs border-collapse min-w-[400px]">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-slate-500">
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] w-24">
                  Peringkat
                </th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">
                  BPR
                </th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">
                  Status Pengawasan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400">
                    Menyinkronkan data prioritas bulanan...
                  </td>
                </tr>
              ) : bprList.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400">
                    Tidak ada data pada periode ini.
                  </td>
                </tr>
              ) : (
                bprList.map((bpr) => (
                  <tr
                    key={bpr.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3.5 px-3 font-bold">
                      <span
                        className={`w-6 h-6 inline-flex items-center justify-center rounded-full text-white text-xs ${
                          bpr.rank === 1
                            ? "bg-red-500 shadow-sm shadow-red-500/20"
                            : bpr.rank === 2
                              ? "bg-amber-500 shadow-sm shadow-amber-500/20"
                              : "bg-emerald-600 shadow-sm shadow-emerald-600/20"
                        }`}
                      >
                        {bpr.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-800 whitespace-nowrap">
                      {bpr.name}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide ${
                          bpr.statusText === "PERLU PERHATIAN"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : bpr.statusText === "ANALISIS LEBIH LANJUT"
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {bpr.statusText}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
