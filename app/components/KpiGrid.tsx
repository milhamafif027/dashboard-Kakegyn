"use client";
import { ArrowDownRight, ArrowUpRight, ArrowRight } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

// Data ringkasan 11 indikator portofolio BPR (BPR Angga, Bromo, Cendana, Desimal, Expres)
const kpiData = [
  {
    title: "Total Aset",
    value: "Rp 208 M",
    status: "Meningkat",
    type: "increase",
    color: "#16a34a",
    sparkline: [{ v: 170 }, { v: 178 }, { v: 189 }, { v: 198 }, { v: 208 }],
  },
  {
    title: "Total Kredit",
    value: "Rp 140 M",
    status: "Meningkat",
    type: "increase",
    color: "#16a34a",
    sparkline: [{ v: 110 }, { v: 116 }, { v: 125 }, { v: 133 }, { v: 140 }],
  },
  {
    title: "DPK",
    value: "Rp 154 M",
    status: "Meningkat",
    type: "increase",
    color: "#16a34a",
    sparkline: [{ v: 120 }, { v: 127 }, { v: 137 }, { v: 145 }, { v: 154 }],
  },
  {
    title: "KPMM",
    value: "25,75%",
    status: "Stabil",
    type: "stable",
    color: "#2563eb",
    sparkline: [
      { v: 24.5 },
      { v: 24.3 },
      { v: 24.1 },
      { v: 23.9 },
      { v: 25.75 },
    ],
  },
  {
    title: "NPL Gross",
    value: "4,20%",
    status: "Menurun",
    type: "decrease",
    color: "#dc2626",
    sparkline: [{ v: 4.5 }, { v: 4.7 }, { v: 4.8 }, { v: 4.9 }, { v: 4.2 }],
  },
  {
    title: "Cadangan/PPKA",
    value: "88,70%",
    status: "Meningkat",
    type: "increase",
    color: "#16a34a",
    sparkline: [
      { v: 83.8 },
      { v: 85.0 },
      { v: 86.3 },
      { v: 87.8 },
      { v: 88.7 },
    ],
  },
  {
    title: "ROA",
    value: "1,60%",
    status: "Stabil",
    type: "stable",
    color: "#2563eb",
    sparkline: [{ v: 1.7 }, { v: 1.6 }, { v: 1.5 }, { v: 1.4 }, { v: 1.6 }],
  },
  {
    title: "BOPO",
    value: "86,00%",
    status: "Menurun",
    type: "decrease",
    color: "#dc2626", // Menurun pada BOPO artinya efisiensi membaik
    sparkline: [
      { v: 86.0 },
      { v: 86.8 },
      { v: 87.2 },
      { v: 87.5 },
      { v: 86.0 },
    ],
  },
  {
    title: "NIM",
    value: "5,74%",
    status: "Meningkat",
    type: "increase",
    color: "#16a34a",
    sparkline: [{ v: 5.1 }, { v: 5.3 }, { v: 5.4 }, { v: 5.5 }, { v: 5.74 }],
  },
  {
    title: "LDR",
    value: "98,30%",
    status: "Stabil",
    type: "stable",
    color: "#2563eb",
    sparkline: [
      { v: 96.0 },
      { v: 97.2 },
      { v: 97.8 },
      { v: 98.0 },
      { v: 98.3 },
    ],
  },
  {
    title: "Cash Ratio",
    value: "102,58%",
    status: "Meningkat",
    type: "increase",
    color: "#16a34a",
    sparkline: [
      { v: 83.5 },
      { v: 89.2 },
      { v: 93.0 },
      { v: 98.1 },
      { v: 102.58 },
    ],
  },
];

export default function KpiGrid() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 select-none">
      <div>
        <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          11 Indikator Keuangan Portofolio BPR (Rata-Rata Portofolio)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Parameter kesehatan makro dan volume usaha BPR Angga, Bromo, Cendana,
          Desimal, dan Expres.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
              className="bg-slate-50/70 border border-slate-200/80 p-3 rounded-xl flex flex-col justify-between hover:bg-white hover:shadow-md hover:border-blue-200 transition-all group"
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
              <div className="h-9 w-full my-1">
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
    </div>
  );
}
