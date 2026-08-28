"use client";
import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";

interface SummaryTableProps {
  startYear: number;
  endYear: number;
}

interface BprRowData {
  bpr_name: string;
  tahun: number;
  kpmm: number;
  npl: number;
  ppka: number;
  roa: number;
  bopo: number;
  nim: number;
  ldr: number;
  cash_ratio: number;
  total_aset: number;
  total_kredit: number;
  dpk: number;
}

export default function SummaryTable({
  startYear,
  endYear,
}: SummaryTableProps) {
  const [data, setData] = useState<BprRowData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const years: number[] = [];
  for (let y = startYear; y <= endYear; y++) {
    years.push(y);
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/bpr`);
        const result = await res.json();
        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (err) {
        console.error("Gagal memuat ringkasan data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const groupedData: Record<string, Record<number, BprRowData>> = {};
  data.forEach((item) => {
    if (!groupedData[item.bpr_name]) {
      groupedData[item.bpr_name] = {};
    }
    groupedData[item.bpr_name][item.tahun] = item;
  });

  const bprNames = Object.keys(groupedData);

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 select-none w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
            <Building2 size={16} className="text-blue-600 shrink-0" />
            <span>
              RINGKASAN INDIKATOR KEUANGAN PER BPR ({startYear} - {endYear})
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Matriks komparatif multi-tahun portofolio lembaga perkreditan rakyat
            berdasarkan rentang waktu terpilih.
          </p>
        </div>
        <div className="text-[11px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-xl self-start sm:self-auto">
          PERIODE: {years.length} TAHUN
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400 font-medium">
          Memuat matriks data ringkasan...
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
                  BPR
                </th>
                <th
                  colSpan={years.length}
                  className="py-3 px-2 border-r border-slate-800"
                >
                  KPMM (%)
                </th>
                <th
                  colSpan={years.length}
                  className="py-3 px-2 border-r border-slate-800"
                >
                  NPL Gross (%)
                </th>
                <th
                  colSpan={years.length}
                  className="py-3 px-2 border-r border-slate-800"
                >
                  Cadangan/PPKA (%)
                </th>
                <th
                  colSpan={years.length}
                  className="py-3 px-2 border-r border-slate-800"
                >
                  ROA (%)
                </th>
                <th colSpan={years.length} className="py-3 px-2">
                  BOPO (%)
                </th>
              </tr>

              <tr className="bg-slate-800 text-slate-200 text-center text-[11px]">
                <th className="bg-slate-800 border-r border-slate-700"></th>
                <th className="bg-slate-800 border-r border-slate-700"></th>

                {years.map((yr) => (
                  <th
                    key={`kpmm-${yr}`}
                    className="py-2 px-2.5 font-semibold border-r border-slate-700"
                  >
                    {yr}
                  </th>
                ))}
                {years.map((yr) => (
                  <th
                    key={`npl-${yr}`}
                    className="py-2 px-2.5 font-semibold border-r border-slate-700"
                  >
                    {yr}
                  </th>
                ))}
                {years.map((yr) => (
                  <th
                    key={`ppka-${yr}`}
                    className="py-2 px-2.5 font-semibold border-r border-slate-700"
                  >
                    {yr}
                  </th>
                ))}
                {years.map((yr) => (
                  <th
                    key={`roa-${yr}`}
                    className="py-2 px-2.5 font-semibold border-r border-slate-700"
                  >
                    {yr}
                  </th>
                ))}
                {years.map((yr) => (
                  <th key={`bopo-${yr}`} className="py-2 px-2.5 font-semibold">
                    {yr}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {bprNames.map((name, index) => {
                const bprYearsData = groupedData[name];

                return (
                  <tr key={name} className="hover:bg-slate-50 text-center">
                    <td className="py-3 px-3 bg-white border-r border-slate-200 font-bold text-slate-500">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 bg-white border-r border-slate-200 text-left font-extrabold text-slate-900">
                      {name}
                    </td>

                    {years.map((yr) => {
                      const val = bprYearsData[yr]?.kpmm;
                      return (
                        <td
                          key={`kpmm-val-${yr}`}
                          className="py-3 px-2.5 border-r border-slate-100"
                        >
                          {val !== undefined ? val.toFixed(2) : "-"}
                        </td>
                      );
                    })}

                    {years.map((yr) => {
                      const val = bprYearsData[yr]?.npl;
                      return (
                        <td
                          key={`npl-val-${yr}`}
                          className={`py-3 px-2.5 border-r border-slate-100 font-bold ${val > 5 ? "text-red-600 bg-red-50/50" : ""}`}
                        >
                          {val !== undefined ? val.toFixed(2) : "-"}
                        </td>
                      );
                    })}

                    {years.map((yr) => {
                      const val = bprYearsData[yr]?.ppka;
                      return (
                        <td
                          key={`ppka-val-${yr}`}
                          className="py-3 px-2.5 border-r border-slate-100"
                        >
                          {val !== undefined ? val.toFixed(2) : "-"}
                        </td>
                      );
                    })}

                    {years.map((yr) => {
                      const val = bprYearsData[yr]?.roa;
                      return (
                        <td
                          key={`roa-val-${yr}`}
                          className="py-3 px-2.5 border-r border-slate-100"
                        >
                          {val !== undefined ? val.toFixed(2) : "-"}
                        </td>
                      );
                    })}

                    {years.map((yr) => {
                      const val = bprYearsData[yr]?.bopo;
                      return (
                        <td
                          key={`bopo-val-${yr}`}
                          className={`py-3 px-2.5 ${val > 90 ? "text-red-600 bg-red-50/50" : ""}`}
                        >
                          {val !== undefined ? val.toFixed(2) : "-"}
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
