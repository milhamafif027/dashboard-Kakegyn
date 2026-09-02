"use client";
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

interface KpiGridProps {
  startYear?: number;
  endYear?: number;
  data: Record<string, unknown>[];
}

interface KpiItem {
  title: string;
  value: string;
  status: string;
  type: "increase" | "decrease" | "stable";
  color: string;
  sparkline: { v: number; label: string }[];
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

export default function KpiGrid({
  startYear = 2021,
  endYear = 2026,
  data = [],
}: KpiGridProps) {
  // Ekstrak daftar tahun unik dari data MySQL secara dinamis
  const dynamicYears: number[] = Array.from(
    new Set(
      data.map((row) => Number(row.tahun)).filter((y) => !isNaN(y) && y > 0),
    ),
  ).sort((a, b) => a - b);

  const yearsList: number[] =
    dynamicYears.length > 0
      ? dynamicYears
      : (() => {
          const list = [];
          const s = Math.min(startYear, endYear);
          const e = Math.max(startYear, endYear);
          for (let y = s; y <= e; y++) list.push(y);
          return list;
        })();

  const defaultYear =
    yearsList.length > 0 ? yearsList[yearsList.length - 1] : endYear;

  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
  const [selectedBulan, setSelectedBulan] = useState<number>(12); // Default Desember atau bulan terakhir

  const activeYear = yearsList.includes(selectedYear)
    ? selectedYear
    : defaultYear;

  // Filter data berdasarkan tahun aktif dan bulan aktif
  const filteredPeriodData = data.filter((row: Record<string, unknown>) => {
    const matchYear = Number(row.tahun) === activeYear;
    const matchBulan =
      selectedBulan === 0 ? true : Number(row.bulan) === selectedBulan;
    return matchYear && matchBulan;
  });

  // Hitung total atau rata-rata portofolio
  const totalAset = filteredPeriodData.reduce(
    (acc: number, curr: Record<string, unknown>) =>
      acc + (Number(curr.total_aset) || 0),
    0,
  );
  const totalKredit = filteredPeriodData.reduce(
    (acc: number, curr: Record<string, unknown>) =>
      acc + (Number(curr.total_kredit) || 0),
    0,
  );
  const totalDpk = filteredPeriodData.reduce(
    (acc: number, curr: Record<string, unknown>) =>
      acc + (Number(curr.dpk) || 0),
    0,
  );

  const getAvg = (key: string) =>
    filteredPeriodData.length > 0
      ? filteredPeriodData.reduce(
          (acc: number, curr: Record<string, unknown>) =>
            acc + (Number(curr[key]) || 0),
          0,
        ) / filteredPeriodData.length
      : 0;

  const avgNpl = getAvg("npl");
  const avgKklGross = getAvg("kkl_gross");
  const avgMiapb = getAvg("miapb");
  const avgRoa = getAvg("roa");
  const avgBopo = getAvg("bopo");
  const avgNim = getAvg("nim");
  const avgLdr = getAvg("ldr");
  const avgCashRatio = getAvg("cash_ratio");
  const avgCar = getAvg("kpmm") || getAvg("car");

  // Helper untuk membuat sparkline tren bulanan secara kronologis pada tahun aktif
  const getMonthlyTrend = (key: string, isTotal: boolean = false) => {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    return months
      .map((m) => {
        const monthRows = data.filter((row: Record<string, unknown>) => {
          return Number(row.tahun) === activeYear && Number(row.bulan) === m;
        });
        if (monthRows.length === 0) return { v: 0, label: namaBulanLengkap[m] };
        const sum = monthRows.reduce(
          (acc: number, curr: Record<string, unknown>) =>
            acc + (Number(curr[key]) || 0),
          0,
        );
        const val = isTotal ? sum : sum / monthRows.length;
        return { v: +val.toFixed(2), label: namaBulanLengkap[m] };
      })
      .filter((item) => item.v > 0); // Hanya ambil bulan yang memiliki data
  };

  const kpiData: KpiItem[] = [
    {
      title: "1. Total Aset",
      value: `Rp ${totalAset.toLocaleString("id-ID")} Jt`,
      status: "Naik Stabil (Baik)",
      type: "stable",
      color: "#16a34a",
      sparkline: getMonthlyTrend("total_aset", true),
    },
    {
      title: "2. Total Kredit",
      value: `Rp ${totalKredit.toLocaleString("id-ID")} Jt`,
      status: "Tumbuh Sehat",
      type: "increase",
      color: "#16a34a",
      sparkline: getMonthlyTrend("total_kredit", true),
    },
    {
      title: "3. DPK",
      value: `Rp ${totalDpk.toLocaleString("id-ID")} Jt`,
      status: "Naik Stabil (Baik)",
      type: "stable",
      color: "#16a34a",
      sparkline: getMonthlyTrend("dpk", true),
    },
    {
      title: "4. NPL Gross",
      value: `${avgNpl.toFixed(2)}%`,
      status: avgNpl > 5 ? "Tinggi / Perlu Dicermati" : "Rendah / Sehat",
      type: avgNpl > 5 ? "decrease" : "increase",
      color: "#dc2626",
      sparkline: getMonthlyTrend("npl"),
    },
    {
      title: "5. KKL Gross",
      value: `${avgKklGross.toFixed(2)}%`,
      status: avgKklGross > 3 ? "Sinyal Awal Memburuk" : "Terkendali",
      type: avgKklGross > 3 ? "decrease" : "stable",
      color: "#2563eb",
      sparkline: getMonthlyTrend("kkl_gross"),
    },
    {
      title: "6. MIAPB",
      value: `${avgMiapb.toFixed(2)}%`,
      status: avgMiapb < 100 ? "Daya Penyangga Melemah" : "Kuat / Memadai",
      type: avgMiapb < 100 ? "decrease" : "increase",
      color: "#2563eb",
      sparkline: getMonthlyTrend("miapb"),
    },
    {
      title: "7. ROA",
      value: `${avgRoa.toFixed(2)}%`,
      status: avgRoa < 0.5 ? "Turun / Tertekan" : "Baik & Stabil",
      type: avgRoa < 0.5 ? "decrease" : "increase",
      color: "#2563eb",
      sparkline: getMonthlyTrend("roa"),
    },
    {
      title: "8. BOPO",
      value: `${avgBopo.toFixed(2)}%`,
      status: avgBopo > 95 ? "Biaya Berat / Tidak Efisien" : "Efisien & Baik",
      type: avgBopo > 95 ? "decrease" : "increase",
      color: "#dc2626",
      sparkline: getMonthlyTrend("bopo"),
    },
    {
      title: "9. NIM",
      value: `${avgNim.toFixed(2)}%`,
      status: avgNim < 4 ? "Margin Menyempit" : "Sehat & Stabil",
      type: avgNim < 4 ? "decrease" : "increase",
      color: "#16a34a",
      sparkline: getMonthlyTrend("nim"),
    },
    {
      title: "10. LDR",
      value: `${avgLdr.toFixed(2)}%`,
      status:
        avgLdr > 95
          ? "Naik Tajam / Perlu Dicermati"
          : "Seimbang & Proporsional",
      type: avgLdr > 95 ? "decrease" : "stable",
      color: "#2563eb",
      sparkline: getMonthlyTrend("ldr"),
    },
    {
      title: "11. Cash Ratio",
      value: `${avgCashRatio.toFixed(2)}%`,
      status:
        avgCashRatio < 5 ? "Bantalan Likuiditas Lemah" : "Bantalan Memadai",
      type: avgCashRatio < 5 ? "decrease" : "increase",
      color: "#16a34a",
      sparkline: getMonthlyTrend("cash_ratio"),
    },
    {
      title: "12. CAR/KPMM",
      value: `${avgCar.toFixed(2)}%`,
      status: avgCar < 12 ? "Risiko / Ruang Menyerap Kecil" : "Kuat & Stabil",
      type: avgCar < 12 ? "decrease" : "increase",
      color: "#16a34a",
      sparkline: getMonthlyTrend("kpmm"),
    },
  ];

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 select-none">
      {/* Header & Filter Bulan + Tahun */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
            12 Indikator Keuangan Portofolio BPR (
            {selectedBulan === 0
              ? "Akumulasi 1 Tahun"
              : namaBulanLengkap[selectedBulan]}{" "}
            {activeYear})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Parameter kesehatan makro dan volume usaha hasil agregasi data lokal
            MySQL[cite: 1].
          </p>
        </div>

        {/* Filter Dropdown Bulan & Tahun */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Bulan */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-[11px] font-bold text-slate-500">Bulan:</span>
            <select
              value={selectedBulan}
              onChange={(e) => setSelectedBulan(Number(e.target.value))}
              className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value={0}>Semua (1 Tahun)</option>
              {namaBulanLengkap.slice(1).map((m, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Tahun */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Calendar size={14} className="text-slate-400 shrink-0" />
            <span className="text-[11px] font-bold text-slate-500">Tahun:</span>
            <select
              value={activeYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer"
            >
              {yearsList.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {data.length === 0 ? (
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
