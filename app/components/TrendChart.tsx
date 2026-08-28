"use client";
import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { supabase } from "../lib/supabase";

interface TrendChartRecord {
  year: number;
  kpmm: number;
  npl: number;
  roa: number;
  bopo: number;
}

export default function TrendChart() {
  const [chartData, setChartData] = useState<TrendChartRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTrendChartData() {
      setLoading(true);
      const { data, error } = await supabase
        .from("bpr_indicators")
        .select("tahun, kpmm, npl, roa, bopo")
        .order("tahun", { ascending: true });

      if (error) {
        console.error("Gagal memuat data grafik tren:", error);
      } else if (data) {
        // Kelompokkan dan hitung rata-rata per tahun
        const yearMap: Record<
          number,
          {
            count: number;
            kpmm: number;
            npl: number;
            roa: number;
            bopo: number;
          }
        > = {};

        data.forEach((row) => {
          const yr = row.tahun;
          if (!yearMap[yr]) {
            yearMap[yr] = { count: 0, kpmm: 0, npl: 0, roa: 0, bopo: 0 };
          }
          yearMap[yr].count += 1;
          yearMap[yr].kpmm += Number(row.kpmm) || 0;
          yearMap[yr].npl += Number(row.npl) || 0;
          yearMap[yr].roa += Number(row.roa) || 0;
          yearMap[yr].bopo += Number(row.bopo) || 0;
        });

        const formatted: TrendChartRecord[] = Object.keys(yearMap).map(
          (yrStr) => {
            const yr = Number(yrStr);
            const item = yearMap[yr];
            return {
              year: yr,
              kpmm: +(item.kpmm / item.count).toFixed(2),
              npl: +(item.npl / item.count).toFixed(2),
              roa: +(item.roa / item.count).toFixed(2),
              bopo: +(item.bopo / item.count).toFixed(2),
            };
          },
        );

        setChartData(formatted);
      }
      setLoading(false);
    }

    fetchTrendChartData();
  }, []);

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 select-none">
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
            TREND INDIKATOR KEUANGAN (LIVE SUPABASE)
          </h2>
          <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl font-medium">
            Status:{" "}
            <span className="font-bold text-slate-700">
              {loading ? "Memuat..." : "Semua Indikator Utama"}
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="year"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
              />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Line
                type="monotone"
                dataKey="kpmm"
                name="KPMM (%)"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="npl"
                name="NPL Gross (%)"
                stroke="#dc2626"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="roa"
                name="ROA (%)"
                stroke="#16a34a"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="bopo"
                name="BOPO (%)"
                stroke="#9333ea"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 text-center italic font-medium">
        * Grafik diperbarui secara otomatis berdasarkan data historis basis data
        Supabase
      </div>
    </div>
  );
}
