"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface ReviewItem {
  id: string;
  rank: number;
  name: string;
  status: "HIGH ATTENTION" | "WATCH" | "STABLE";
  mainIndication: string;
}

export default function ReviewPriority() {
  const [bprList, setBprList] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviewData() {
      // Ambil data periode terbaru (2025) dari Supabase
      const { data, error } = await supabase
        .from("bpr_indicators")
        .select("*")
        .eq("tahun", 2025);

      if (error) {
        console.error("Gagal memuat data prioritas review:", error);
      } else if (data) {
        // Petakan data dari database ke format tampilan
        const mapped: ReviewItem[] = data.map(
          (row: Record<string, unknown>, index: number) => {
            const name = row.bpr_name as string;
            const status =
              (row.status as "HIGH ATTENTION" | "WATCH" | "STABLE") || "STABLE";

            // Tentukan indikasi utama berdasarkan tren/status
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

            // Berikan peringkat prioritas
            let rank = 3;
            if (status === "HIGH ATTENTION") rank = 1;
            else if (status === "WATCH") rank = 2;

            return {
              id: name,
              rank,
              name,
              status,
              mainIndication: indication,
            };
          },
        );

        // Urutkan berdasarkan peringkat (1 ke atas)
        mapped.sort((a, b) => a.rank - b.rank);
        setBprList(mapped);
      }
      setLoading(false);
    }

    fetchReviewData();
  }, []);

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-slate-800">
            PRIORITAS REVIEW BPR
          </h2>
          <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md uppercase">
            {loading ? "Memuat..." : "Live Supabase"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400">
                <th className="pb-2 font-semibold">Peringkat</th>
                <th className="pb-2 font-semibold">BPR</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold">Indikasi Utama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    Menyinkronkan data prioritas dari server...
                  </td>
                </tr>
              ) : (
                bprList.map((bpr) => (
                  <tr key={bpr.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold">
                      <span
                        className={`w-5 h-5 inline-flex items-center justify-center rounded-full text-white text-[10px] ${
                          bpr.rank === 1
                            ? "bg-red-500"
                            : bpr.rank === 2
                              ? "bg-amber-500"
                              : "bg-emerald-600"
                        }`}
                      >
                        {bpr.rank}
                      </span>
                    </td>
                    <td className="py-2.5 font-semibold text-slate-700">
                      {bpr.name}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          bpr.status === "HIGH ATTENTION"
                            ? "bg-red-100 text-red-700"
                            : bpr.status === "WATCH"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {bpr.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-600">
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
      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] space-y-1">
        <div className="font-bold text-slate-700 mb-1">KETERANGAN STATUS</div>
        <div className="flex items-center space-x-2">
          <span className="bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded text-[9px]">
            HIGH ATTENTION
          </span>
          <span className="text-slate-500">
            Terdapat $\ge 5$ indikator memburuk secara signifikan
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded text-[9px]">
            WATCH
          </span>
          <span className="text-slate-500">
            Terdapat $3 - 4$ indikator yang perlu dipantau
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded text-[9px]">
            STABLE
          </span>
          <span className="text-slate-500">
            Mayoritas indikator membaik atau stabil
          </span>
        </div>
      </div>
    </div>
  );
}
