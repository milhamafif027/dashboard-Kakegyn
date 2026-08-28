"use client";
import { useState, useEffect } from "react";
import { ArrowDownRight, ArrowUpRight, ArrowRight } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

interface KpiGridProps {
  startYear?: number;
  endYear?: number;
}

interface KpiItem {
  title: string;
  value: string;
  status: string;
  type: "increase" | "decrease" | "stable";
  color: string;
  sparkline: { v: number }[];
}

export default function KpiGrid({
  startYear = 2021,
  endYear = 2025,
}: KpiGridProps) {
  const [kpiData, setKpiData] = useState<KpiItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Buat daftar tahun dinamis berdasarkan rentang startYear hingga endYear
  const yearsList: number[] = [];
  const s = Math.min(startYear, endYear);
  const e = Math.max(startYear, endYear);
  for (let y = s; y <= e; y++) {
    yearsList.push(y);
  }

  useEffect(() => {
    async function fetchKpiMetrics() {
      setLoading(true);
      try {
        // Ambil seluruh data historis dari API lokal MySQL
        const res = await fetch("/api/bpr");
        const result = await res.json();
        const data = result.data;

        if (result.error) {
          console.error(
            "Gagal memuat metrik KPI dari database lokal:",
            result.error,
          );
        } else if (data && data.length > 0) {
          // Ambil data tahun terakhir dari rentang yang dipilih (endYear) untuk nilai saat ini
          const latestYearData = data.filter(
            (row: Record<string, unknown>) => Number(row.tahun) === e,
          );

          // Hitung total atau rata-rata portofolio untuk tahun akhir (endYear)
          const totalAset = latestYearData.reduce(
            (acc: number, curr: Record<string, unknown>) =>
              acc + (Number(curr.total_aset) || 0),
            0,
          );
          const totalKredit = latestYearData.reduce(
            (acc: number, curr: Record<string, unknown>) =>
              acc + (Number(curr.total_kredit) || 0),
            0,
          );
          const totalDpk = latestYearData.reduce(
            (acc: number, curr: Record<string, unknown>) =>
              acc + (Number(curr.dpk) || 0),
            0,
          );

          const avgKpmm =
            latestYearData.length > 0
              ? latestYearData.reduce(
                  (acc: number, curr: Record<string, unknown>) =>
                    acc + (Number(curr.kpmm) || 0),
                  0,
                ) / latestYearData.length
              : 0;
          const avgNpl =
            latestYearData.length > 0
              ? latestYearData.reduce(
                  (acc: number, curr: Record<string, unknown>) =>
                    acc + (Number(curr.npl) || 0),
                  0,
                ) / latestYearData.length
              : 0;
          const avgPpka =
            latestYearData.length > 0
              ? latestYearData.reduce(
                  (acc: number, curr: Record<string, unknown>) =>
                    acc + (Number(curr.ppka) || 0),
                  0,
                ) / latestYearData.length
              : 0;
          const avgRoa =
            latestYearData.length > 0
              ? latestYearData.reduce(
                  (acc: number, curr: Record<string, unknown>) =>
                    acc + (Number(curr.roa) || 0),
                  0,
                ) / latestYearData.length
              : 0;
          const avgBopo =
            latestYearData.length > 0
              ? latestYearData.reduce(
                  (acc: number, curr: Record<string, unknown>) =>
                    acc + (Number(curr.bopo) || 0),
                  0,
                ) / latestYearData.length
              : 0;
          const avgNim =
            latestYearData.length > 0
              ? latestYearData.reduce(
                  (acc: number, curr: Record<string, unknown>) =>
                    acc + (Number(curr.nim) || 0),
                  0,
                ) / latestYearData.length
              : 0;
          const avgLdr =
            latestYearData.length > 0
              ? latestYearData.reduce(
                  (acc: number, curr: Record<string, unknown>) =>
                    acc + (Number(curr.ldr) || 0),
                  0,
                ) / latestYearData.length
              : 0;
          const avgCashRatio =
            latestYearData.length > 0
              ? latestYearData.reduce(
                  (acc: number, curr: Record<string, unknown>) =>
                    acc + (Number(curr.cash_ratio) || 0),
                  0,
                ) / latestYearData.length
              : 0;

          // Helper untuk sparkline mengikuti rentang tahun dinamis (yearsList)
          const getYearlyAvg = (key: string, isTotal: boolean = false) => {
            return yearsList.map((yr) => {
              const yrRows = data.filter(
                (row: Record<string, unknown>) => Number(row.tahun) === yr,
              );
              if (yrRows.length === 0) return { v: 0 };
              const sum = yrRows.reduce(
                (acc: number, curr: Record<string, unknown>) =>
                  acc + (Number(curr[key]) || 0),
                0,
              );
              const val = isTotal ? sum : sum / yrRows.length;
              return { v: +val.toFixed(2) };
            });
          };

          const liveKpiList: KpiItem[] = [
            {
              title: "Total Aset",
              value: `Rp ${totalAset.toLocaleString("id-ID")} Jt`,
              status: "Meningkat",
              type: "increase",
              color: "#16a34a",
              sparkline: getYearlyAvg("total_aset", true),
            },
            {
              title: "Total Kredit",
              value: `Rp ${totalKredit.toLocaleString("id-ID")} Jt`,
              status: "Meningkat",
              type: "increase",
              color: "#16a34a",
              sparkline: getYearlyAvg("total_kredit", true),
            },
            {
              title: "DPK",
              value: `Rp ${totalDpk.toLocaleString("id-ID")} Jt`,
              status: "Meningkat",
              type: "increase",
              color: "#16a34a",
              sparkline: getYearlyAvg("dpk", true),
            },
            {
              title: "KPMM",
              value: `${avgKpmm.toFixed(2)}%`,
              status: "Stabil",
              type: "stable",
              color: "#2563eb",
              sparkline: getYearlyAvg("kpmm"),
            },
            {
              title: "NPL Gross",
              value: `${avgNpl.toFixed(2)}%`,
              status: avgNpl > 5 ? "Meningkat" : "Menurun",
              type: avgNpl > 5 ? "increase" : "decrease",
              color: "#dc2626",
              sparkline: getYearlyAvg("npl"),
            },
            {
              title: "Cadangan/PPKA",
              value: `${avgPpka.toFixed(2)}%`,
              status: "Meningkat",
              type: "increase",
              color: "#16a34a",
              sparkline: getYearlyAvg("ppka"),
            },
            {
              title: "ROA",
              value: `${avgRoa.toFixed(2)}%`,
              status: "Stabil",
              type: "stable",
              color: "#2563eb",
              sparkline: getYearlyAvg("roa"),
            },
            {
              title: "BOPO",
              value: `${avgBopo.toFixed(2)}%`,
              status: avgBopo > 90 ? "Meningkat" : "Menurun",
              type: avgBopo > 90 ? "increase" : "decrease",
              color: "#dc2626",
              sparkline: getYearlyAvg("bopo"),
            },
            {
              title: "NIM",
              value: `${avgNim.toFixed(2)}%`,
              status: "Meningkat",
              type: "increase",
              color: "#16a34a",
              sparkline: getYearlyAvg("nim"),
            },
            {
              title: "LDR",
              value: `${avgLdr.toFixed(2)}%`,
              status: "Stabil",
              type: "stable",
              color: "#2563eb",
              sparkline: getYearlyAvg("ldr"),
            },
            {
              title: "Cash Ratio",
              value: `${avgCashRatio.toFixed(2)}%`,
              status: "Meningkat",
              type: "increase",
              color: "#16a34a",
              sparkline: getYearlyAvg("cash_ratio"),
            },
          ];

          setKpiData(liveKpiList);
        }
      } catch (err) {
        console.error("Kesalahan jaringan saat mengambil metrik KPI:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchKpiMetrics();
  }, [s, e]);

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 select-none">
      <div>
        <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          11 Indikator Keuangan Portofolio BPR (Periode {s} — {e})
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Parameter kesehatan makro dan volume usaha hasil agregasi data
          langsung dari basis data lokal MySQL.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400 font-medium">
          Menghitung parameter indikator dari server lokal...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {kpiData.map((item, idx) => {
            const isDecrease = item.type === "decrease";
            const isStable = item.type === "stable";

            let badgeStyle =
              "bg-emerald-100 text-emerald-700 border border-emerald-200";
            if (isDecrease) {
              badgeStyle = "bg-red-100 text-red-700 border border-red-200";
            } else if (isStable) {
              badgeStyle = "bg-blue-100 text-blue-700 border border-blue-200";
            }

            const IconComponent = isDecrease
              ? ArrowDownRight
              : isStable
                ? ArrowRight
                : ArrowUpRight;

            return (
              <div
                key={idx}
                className="bg-slate-50/70 border border-slate-200/80 p-3.5 rounded-xl flex flex-col justify-between hover:bg-white hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                    {item.title}
                  </div>
                  <div className="text-sm lg:text-base font-black text-slate-800 mt-0.5 tracking-tight">
                    {item.value}
                  </div>
                </div>

                {/* Mini Sparkline Chart */}
                <div className="h-9 w-full my-1.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={item.sparkline}>
                      <Line
                        type="monotone"
                        dataKey="v"
                        stroke={item.color}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center space-x-0.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${badgeStyle}`}
                  >
                    <IconComponent size={10} className="stroke-[3]" />
                    <span className="truncate">{item.status}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
