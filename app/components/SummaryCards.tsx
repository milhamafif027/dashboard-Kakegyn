"use client";
import { useState, useEffect } from "react";
import { Activity, AlertTriangle, Search } from "lucide-react";

interface ReviewItem {
  id: string;
  rank: number;
  name: string;
  status: "PERLU PERHATIAN" | "ANALISIS LEBIH LANJUT" | "BAIK";
  rawStatus: string;
  mainIndication: string;
}

export default function ReviewPriority() {
  const [bprList, setBprList] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviewData() {
      try {
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        const res = await fetch(`${baseUrl}/api/bpr?tahun=2025`);
        const result = await res.json();
        const data = result.data;

        if (result.error) {
          console.error("Gagal memuat data prioritas review:", result.error);
        } else if (data) {
          const mapped: ReviewItem[] = data.map(
            (row: Record<string, unknown>) => {
              const name = row.bpr_name as string;
              const originalStatus = (row.status as string) || "STABLE";

              // Pemetaan terjemahan status sesuai permintaan
              let mappedStatus:
                | "PERLU PERHATIAN"
                | "ANALISIS LEBIH LANJUT"
                | "BAIK" = "BAIK";
              if (originalStatus === "HIGH ATTENTION") {
                mappedStatus = "PERLU PERHATIAN";
              } else if (originalStatus === "WATCH") {
                mappedStatus = "ANALISIS LEBIH LANJUT";
              } else {
                mappedStatus = "BAIK";
              }

              let indication = "Kinerja keuangan stabil dan sehat";
              if (name === "BPR Angga")
                indication = "NPL meningkat, ROA turun, BOPO naik";
              else if (name === "BPR Desimal")
                indication = "Pertumbuhan kredit perlu diimbangi pencadangan";
              else if (name === "BPR Cendana")
                indication = "Fluktuasi pada rasio efisiensi operasional";
              else if (name === "BPR Bromo")
                indication = "Likuiditas stabil dan permodalan kuat";
              else if (name === "BPR Expres")
                indication = "Kinerja keuangan ekspansif dan sehat";

              let rank = 3;
              if (originalStatus === "HIGH ATTENTION") rank = 1;
              else if (originalStatus === "WATCH") rank = 2;

              return {
                id: name,
                rank,
                name,
                status: mappedStatus,
                rawStatus: originalStatus,
                mainIndication: indication,
              };
            },
          );

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
  }, []);

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 select-none">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
            PRIORITAS REVIEW BPR
          </h2>
          <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2.5 py-1 rounded-xl uppercase">
            {loading ? "Memuat..." : "Local Database"}
          </span>
        </div>

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
                    Menyinkronkan data prioritas dari server lokal...
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
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          bpr.rawStatus === "HIGH ATTENTION"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : bpr.rawStatus === "WATCH"
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

      {/* Keterangan Status Legend yang Disesuaikan */}
      <div className="mt-2 pt-4 border-t border-slate-100 text-[11px] space-y-1.5">
        <div className="font-extrabold text-slate-700 uppercase tracking-wider mb-2">
          Keterangan Status
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
          <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wide self-start">
            Perlu Perhatian
          </span>
          <span className="text-slate-500 font-medium">
            Terdapat $\ge 5$ indikator memburuk secara signifikan
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
          <span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wide self-start">
            Analisis Lebih Lanjut
          </span>
          <span className="text-slate-500 font-medium">
            Terdapat $3 - 4$ indikator yang perlu dipantau
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
          <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wide self-start">
            Baik
          </span>
          <span className="text-slate-500 font-medium">
            Mayoritas indikator membaik atau stabil
          </span>
        </div>
      </div>
    </div>
  );
}
  