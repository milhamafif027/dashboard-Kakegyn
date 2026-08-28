"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { chartTrendData } from "../data/mockData";

export default function TrendChart() {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-slate-800">
            TREND INDIKATOR KEUANGAN
          </h2>
          <div className="text-[11px] text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded">
            Pilih Indikator:{" "}
            <span className="font-semibold text-slate-700">
              Semua Indikator
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartTrendData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              <Line
                type="monotone"
                dataKey="kpmm"
                name="KPMM (%)"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="npl"
                name="NPL Gross (%)"
                stroke="#dc2626"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="roa"
                name="ROA (%)"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="bopo"
                name="BOPO (%)"
                stroke="#9333ea"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 text-center mt-2 italic">
        * Klik indikator pada tabel 8 indikator untuk melihat grafik tren
      </div>
    </div>
  );
}
