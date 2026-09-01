"use client";
import { useState } from "react";
import { Building2, Calendar } from "lucide-react";

interface SummaryTableProps {
  startYear?: number;
  endYear?: number;
  data?: Record<string, unknown>[];
}

interface BprRowData {
  bpr_name: string;
  tahun: number;
  bulan: number;
  total_aset: number;
  total_kredit: number;
  dpk: number;
  npl: number;
  kkl_gross: number;
  miapb: number;
  roa: number;
  bopo: number;
  nim: number;
  ldr: number;
  cash_ratio: number;
  car: number;
  [key: string]: unknown;
}

const namaBulan = [
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

export default function SummaryTable({
  startYear = 2021,
  endYear = 2025,
  data = [],
}: SummaryTableProps) {
  const typedData = data as BprRowData[];

  // Ekstrak daftar tahun unik dari database MySQL secara dinamis
  const dynamicYears: number[] = Array.from(
    new Set(
      typedData
        .map((row) => Number(row.tahun))
        .filter((y) => !isNaN(y) && y > 0),
    ),
  ).sort((a, b) => a - b);

  // Jika data kosong, gunakan rentang cadangan dari props
  const availableYears: number[] =
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
    availableYears.length > 0
      ? availableYears[availableYears.length - 1]
      : endYear;

  // State untuk filter tahun dan bulan aktif pada tabel ringkasan
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);
  const [selectedBulan, setSelectedBulan] = useState<number>(1); // Default Januari atau sesuai kebutuhan

  const activeYear = availableYears.includes(selectedYear)
    ? selectedYear
    : defaultYear;

  // Filter data berdasarkan tahun dan bulan yang dipilih
  const filteredData = typedData.filter(
    (item) =>
      Number(item.tahun) === activeYear && Number(item.bulan) === selectedBulan,
  );

  // Daftar 12 Indikator Resmi sesuai pedoman OJK
  const indicators = [
    { key: "total_aset", label: "Total Aset (Jt Rp)", isCurrency: true },
    { key: "total_kredit", label: "Total Kredit (Jt Rp)", isCurrency: true },
    { key: "dpk", label: "DPK (Jt Rp)", isCurrency: true },
    { key: "npl", label: "NPL Gross (%)", isCurrency: false },
    { key: "kkl_gross", label: "KKL Gross (%)", isCurrency: false },
    { key: "miapb", label: "MIAPB (%)", isCurrency: false },
    { key: "roa", label: "ROA (%)", isCurrency: false },
    { key: "bopo", label: "BOPO (%)", isCurrency: false },
    { key: "nim", label: "NIM (%)", isCurrency: false },
    { key: "ldr", label: "LDR (%)", isCurrency: false },
    { key: "cash_ratio", label: "Cash Ratio (%)", isCurrency: false },
    { key: "car", label: "CAR/KPMM (%)", isCurrency: false },
  ];

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 select-none w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
            <Building2 size={16} className="text-blue-600 shrink-0" />
            <span>
              RINGKASAN 12 INDIKATOR KEUANGAN BPR ({namaBulan[selectedBulan]}{" "}
              {activeYear})
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Matriks komparatif portofolio lembaga perkreditan rakyat berdasarkan
            12 indikator resmi OJK per periode bulanan.
          </p>
        </div>

        {/* Filter Bulan dan Tahun untuk Tabel */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pilihan Bulan */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-[11px] font-bold text-slate-500">Bulan:</span>
            <select
              value={selectedBulan}
              onChange={(e) => setSelectedBulan(Number(e.target.value))}
              className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none cursor-pointer"
            >
              {namaBulan.slice(1).map((m, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Pilihan Tahun (Dinamis Berdasarkan Database) */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Calendar size={14} className="text-slate-400 shrink-0" />
            <span className="text-[11px] font-bold text-slate-500">Tahun:</span>
            <select
              value={activeYear}
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

      {filteredData.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400 font-medium bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          Belum ada data indikator keuangan tersedia untuk periode{" "}
          {namaBulan[selectedBulan]} {activeYear}.
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-xs whitespace-nowrap text-left border-spacing-0">
            <thead>
              <tr className="bg-slate-900 text-white text-center">
                <th className="py-3 px-3 bg-slate-900 border-r border-slate-800 w-12">
                  No
                </th>
                <th className="py-3 px-4 bg-slate-900 border-r border-slate-800 text-left min-w-[160px]">
                  Nama BPR
                </th>
                {indicators.map((ind) => (
                  <th
                    key={ind.key}
                    className="py-3 px-3 border-r border-slate-800 bg-slate-900 font-semibold"
                  >
                    {ind.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredData.map((row, index) => {
                return (
                  <tr
                    key={row.bpr_name}
                    className="hover:bg-slate-50 text-center"
                  >
                    <td className="py-3 px-3 border-r border-slate-200 font-bold text-slate-500">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 border-r border-slate-200 text-left font-extrabold text-slate-900">
                      {row.bpr_name}
                    </td>

                    {indicators.map((ind) => {
                      const val = Number(row[ind.key]) || 0;

                      let customStyle = "border-r border-slate-100";
                      if (ind.key === "npl" && val > 5) {
                        customStyle += " text-red-600 bg-red-50/50 font-bold";
                      } else if (ind.key === "bopo" && val > 95) {
                        customStyle += " text-red-600 bg-red-50/50 font-bold";
                      }

                      return (
                        <td
                          key={ind.key}
                          className={`py-3 px-3 ${customStyle}`}
                        >
                          {ind.isCurrency
                            ? val.toLocaleString("id-ID")
                            : val.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
