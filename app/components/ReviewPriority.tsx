"use client";
import { useState, useEffect } from "react";
import { ArrowUpDown, Calendar } from "lucide-react";

interface ReviewItem {
  id: string;
  rank: number;
  name: string;
  status: "HIGH ATTENTION" | "WATCH" | "STABLE" | "WARNING";
  mainIndication: string;
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

  // State untuk filter tahun dan bulan laporan
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedBulan, setSelectedBulan] = useState<number>(12); // Default Desember
  const availableYears = [2021, 2022, 2023, 2024, 2025];

  useEffect(() => {
    async function fetchReviewData() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/bpr?tahun=${selectedYear}&bulan=${selectedBulan}`,
        );
        const result = await res.json();
        const data = result.data;

        if (result.error) {
          console.error("Gagal memuat data prioritas review:", result.error);
        } else if (data) {
          // Pastikan hanya mengambil 1 baris per BPR (unik berdasarkan nama)
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
              const status = (row.status as ReviewItem["status"]) || "STABLE";
              const npl = Number(row.npl) || 0;
              const roa = Number(row.roa) || 0;
              const bopo = Number(row.bopo) || 0;

              // Tentukan indikasi utama yang lebih dinamis berdasarkan data asli
              let indication = "Kinerja keuangan stabil dan sehat";
              if (npl > 4.5 || bopo > 88) {
                indication = `NPL ${npl.toFixed(2)}%, BOPO ${bopo.toFixed(2)}% (Perlu Atensi)`;
              } else if (roa > 2.5) {
                indication = `Rentabilitas kuat dengan ROA ${roa.toFixed(2)}%`;
              } else {
                indication = "Pertumbuhan volume usaha dan likuiditas terjaga";
              }

              // Tentukan peringkat prioritas review pengawasan
              let rank = 3;
              if (
                status === "HIGH ATTENTION" ||
                status === "WARNING" ||
                npl > 5
              )
                rank = 1;
              else if (status === "WATCH" || npl > 3.5) rank = 2;

              return {
                id: name,
                rank,
                name,
                status,
                mainIndication: indication,
                npl,
                bopo,
                roa,
              };
            },
          );

          // Urutkan berdasarkan peringkat (1 = prioritas utama pengawasan)
          mapped.sort((a, b) => a.rank - b.rank);
          setBprList(mapped);
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

        {/* Tabel Prioritas Review */}
        <div className="overflow-x-auto rounded-xl border border-slate-100 pb-1">
          <table className="w-full text-left text-xs border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-slate-500">
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px] w-20">
                  Peringkat
                </th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">
                  BPR
                </th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">
                  Status
                </th>
                <th className="py-3 px-3 font-bold uppercase tracking-wider text-[11px]">
                  Indikasi Utama
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Menyinkronkan data prioritas bulanan...
                  </td>
                </tr>
              ) : bprList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Tidak ada data pada periode ini.
                  </td>
                </tr>
              ) : (
                bprList.map((bpr) => (
                  <tr
                    key={bpr.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3 px-3 font-bold">
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
                    <td className="py-3 px-3 font-bold text-slate-800 whitespace-nowrap">
                      {bpr.name}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          bpr.status === "HIGH ATTENTION" ||
                          bpr.status === "WARNING"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : bpr.status === "WATCH"
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {bpr.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {bpr.mainIndication}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Keterangan Status Legend */}
      <div className="mt-2 pt-4 border-t border-slate-100 text-[11px] space-y-1.5">
        <div className="font-extrabold text-slate-700 uppercase tracking-wider mb-2">
          Keterangan Status Pengawasan
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
          <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wide self-start">
            HIGH ATTENTION
          </span>
          <span className="text-slate-500 font-medium">
            Parameter risiko kredit (NPL) atau efisiensi (BOPO) memerlukan
            tindakan korektif segera
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
          <span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wide self-start">
            WATCH
          </span>
          <span className="text-slate-500 font-medium">
            Terdapat fluktuasi indikator keuangan yang perlu dipantau secara
            berkala
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
          <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wide self-start">
            STABLE
          </span>
          <span className="text-slate-500 font-medium">
            Kinerja keuangan berada dalam batas normal dan sehat
          </span>
        </div>
      </div>
    </div>
  );
}
