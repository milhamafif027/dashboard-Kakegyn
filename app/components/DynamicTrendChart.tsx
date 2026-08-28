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
import { Play, Pause, RefreshCw } from "lucide-react";

// Data awal simulasi waktu nyata
const initialData = [
  { time: "10:00", kpmm: 21.4, npl: 8.6, roa: 0.9 },
  { time: "10:01", kpmm: 21.5, npl: 8.5, roa: 1.0 },
  { time: "10:02", kpmm: 21.3, npl: 8.7, roa: 0.9 },
  { time: "10:03", kpmm: 21.6, npl: 8.4, roa: 1.1 },
  { time: "10:04", kpmm: 21.4, npl: 8.6, roa: 0.9 },
];

export default function DynamicTrendChart() {
  const [data, setData] = useState(initialData);
  const [isLive, setIsLive] = useState(true);

  // Efek untuk membuat chart "bergerak" / update secara dinamis setiap 2 detik
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setData((prevData) => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        // Buat data acak baru untuk simulasi pergerakan indikator keuangan
        const newPoint = {
          time: timeString,
          kpmm: +(21 + Math.random() * 0.8).toFixed(2),
          npl: +(8.2 + Math.random() * 0.6).toFixed(2),
          roa: +(0.8 + Math.random() * 0.4).toFixed(2),
        };

        // Ambil data terakhir agar chart terus bergeser ke depan (rolling window)
        const updatedData = [...prevData.slice(1), newPoint];
        return updatedData;
      });
    }, 2000); // Update setiap 2 detik

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200/85 shadow-xs space-y-4 select-none">
      {/* Header & Tombol Kontrol Animasi */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
            <span>SIMULASI LIVE STREAMING INDIKATOR KEUANGAN</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Grafik bergerak otomatis memperbarui data secara real-time setiap 2
            detik.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition cursor-pointer shadow-sm ${
              isLive
                ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
            }`}
          >
            {isLive ? (
              <>
                <Pause size={14} /> <span>Jeda (Pause)</span>
              </>
            ) : (
              <>
                <Play size={14} /> <span>Mulai (Live)</span>
              </>
            )}
          </button>

          <button
            onClick={() => setData(initialData)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition border border-slate-200/80 cursor-pointer shadow-2xs"
          >
            <RefreshCw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Area Grafik Recharts */}
      <div className="h-72 md:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              domain={[0, 25]}
              tickLine={false}
            />
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
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />

            {/* Garis dengan animasi bawaan Recharts (isAnimationActive) */}
            <Line
              type="monotone"
              dataKey="kpmm"
              name="KPMM (%)"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              isAnimationActive={true}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="npl"
              name="NPL Gross (%)"
              stroke="#dc2626"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              isAnimationActive={true}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="roa"
              name="ROA (%)"
              stroke="#16a34a"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              isAnimationActive={true}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
