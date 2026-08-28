"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  FileText,
  Download,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface BprItem {
  bpr_name: string;
  tahun: number;
  total_aset: number;
  total_kredit: number;
  dpk: number;
  kpmm: number;
  npl: number;
  ppka: number;
  roa: number;
  bopo: number;
  nim: number;
  ldr: number;
  cash_ratio: number;
  dominant_trend: string;
}

export default function LaporanPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bprNames, setBprNames] = useState<string[]>([]);
  const [selectedBpr, setSelectedBpr] = useState<string>("");
  const [reportData, setReportData] = useState<BprItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [letterNumber] = useState<number>(() =>
    Math.floor(100 + Math.random() * 900),
  );

  // Ambil daftar BPR dari API
  useEffect(() => {
    async function fetchBprList() {
      try {
        const res = await fetch("/api/bpr");
        const result = await res.json();
        if (result.success && result.data) {
          const names: string[] = Array.from(
            new Set(result.data.map((item: BprItem) => item.bpr_name)),
          );
          setBprNames(names);
          if (names.length > 0) setSelectedBpr(names[0]);
        }
      } catch (err) {
        console.error("Gagal memuat daftar BPR:", err);
      }
    }
    fetchBprList();
  }, []);

  // Ambil data laporan spesifik BPR
  useEffect(() => {
    async function fetchBprReport() {
      if (!selectedBpr) return;
      setLoading(true);
      try {
        const res = await fetch(
          `/api/bpr?bpr_name=${encodeURIComponent(selectedBpr)}`,
        );
        const result = await res.json();
        if (result.success && result.data) {
          const sorted = result.data.sort(
            (a: BprItem, b: BprItem) => Number(a.tahun) - Number(b.tahun),
          );
          setReportData(sorted);
        }
      } catch (err) {
        console.error("Gagal memuat data laporan BPR:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBprReport();
  }, [selectedBpr]);

  const latestData = reportData[reportData.length - 1] || {};
  const prevData = reportData[reportData.length - 2] || latestData;

  const getTrendIndicator = (
    current: number,
    previous: number,
    inverse: boolean = false,
  ) => {
    if (current > previous) {
      return inverse ? (
        <span className="inline-flex items-center text-red-600 font-bold">
          <ArrowUpRight size={14} /> Meningkat
        </span>
      ) : (
        <span className="inline-flex items-center text-emerald-600 font-bold">
          <ArrowUpRight size={14} /> Meningkat
        </span>
      );
    } else if (current < previous) {
      return inverse ? (
        <span className="inline-flex items-center text-emerald-600 font-bold">
          <ArrowDownRight size={14} /> Menurun
        </span>
      ) : (
        <span className="inline-flex items-center text-red-600 font-bold">
          <ArrowDownRight size={14} /> Menurun
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-blue-600 font-bold">
        <ArrowRight size={14} /> Stabil
      </span>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto w-full">
          {/* Kontrol Navigasi (Sembunyi otomatis saat dicetak berkat kelas print:hidden) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">
                  Dokumen Surat Laporan Pengawasan
                </h2>
                <p className="text-xs text-slate-500">
                  Format surat resmi kedinasan lembaga penilai.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full sm:w-auto">
                <Building2 size={16} className="text-slate-400" />
                <select
                  value={selectedBpr}
                  onChange={(e) => setSelectedBpr(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer w-full"
                >
                  {bprNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20 cursor-pointer shrink-0"
              >
                <Download size={14} />
                <span>Cetak / Unduh Surat</span>
              </button>
            </div>
          </div>

          {/* KERTAS SURAT RESMI */}
          <div
            id="printable-report"
            className="bg-white p-8 sm:p-14 rounded-2xl border border-slate-200/90 shadow-sm space-y-6 text-xs text-slate-900 leading-relaxed font-serif"
          >
            {/* KOP SURAT */}
            <div className="border-b-4 border-double border-slate-900 pb-4 text-center space-y-1">
              <div className="text-xs font-bold tracking-widest text-slate-700 uppercase">
                OTORITAS JASA KEUANGAN REPUBLIK INDONESIA
              </div>
              <div className="text-sm font-black tracking-wider text-slate-900 uppercase">
                DEPARTEMEN PENGAWASAN LEMBAGA JASA KEUANGAN MIKRO
              </div>
              <div className="text-[11px] text-slate-600 font-sans">
                Jl. Lapangan Banteng Timur No. 2-4, Jakarta Pusat 10710
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-xs text-slate-400 font-sans">
                Menyusun dokumen surat resmi...
              </div>
            ) : (
              <div className="space-y-6 font-sans">
                {/* NOMOR & PERIHAL SURAT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                  <div className="space-y-1">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="font-bold w-20">Nomor</td>
                          <td className="w-4">:</td>
                          <td>B-{letterNumber}/KO.03/2026</td>
                        </tr>
                        <tr>
                          <td className="font-bold">Sifat</td>
                          <td>:</td>
                          <td>Penting / Rahasia</td>
                        </tr>
                        <tr>
                          <td className="font-bold">Lampiran</td>
                          <td>:</td>
                          <td>1 (Satu) Berkas Analisis</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="sm:text-right space-y-1">
                    <div>Jakarta, {currentDate}</div>
                    <div className="font-bold pt-2">Kepada Yth.</div>
                    <div>Direksi {selectedBpr || "BPR Terlapor"}</div>
                    <div>di Tempat</div>
                  </div>
                </div>

                {/* PERIHAL */}
                <div className="py-2 font-bold text-slate-900 uppercase tracking-wide border-y border-slate-200">
                  Perihal: Laporan Hasil Evaluasi Kesehatan & Tren Kinerja
                  Keuangan Entitas
                </div>

                {/* ISI SURAT */}
                <div className="space-y-4 text-justify font-sans text-slate-700">
                  <p>
                    Dengan hormat, sehubungan dengan pelaksanaan tugas
                    pengawasan perbankan serta evaluasi berkala terhadap tingkat
                    kesehatan bank perekonomian rakyat berdasarkan sistem
                    pelaporan Otoritas Jasa Keuangan, bersama ini disampaikan
                    Laporan Hasil Analisis Kinerja Keuangan untuk entitas{" "}
                    <strong>{selectedBpr}</strong>.
                  </p>

                  {/* Ringkasan Parameter */}
                  <div className="space-y-2 pt-1">
                    <div className="font-bold text-slate-900">
                      1. Ringkasan Parameter Utama (
                      {latestData.tahun || "Tahun Berjalan"})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-0.5">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">
                          Total Aset
                        </div>
                        <div className="text-xs font-black text-slate-900">
                          Rp{" "}
                          {(latestData.total_aset || 0).toLocaleString("id-ID")}{" "}
                          Jt
                        </div>
                        <div className="text-[10px]">
                          {getTrendIndicator(
                            latestData.total_aset || 0,
                            prevData.total_aset || 0,
                          )}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-0.5">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">
                          Total Kredit
                        </div>
                        <div className="text-xs font-black text-slate-900">
                          Rp{" "}
                          {(latestData.total_kredit || 0).toLocaleString(
                            "id-ID",
                          )}{" "}
                          Jt
                        </div>
                        <div className="text-[10px]">
                          {getTrendIndicator(
                            latestData.total_kredit || 0,
                            prevData.total_kredit || 0,
                          )}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-0.5">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">
                          Dana Pihak Ketiga
                        </div>
                        <div className="text-xs font-black text-slate-900">
                          Rp {(latestData.dpk || 0).toLocaleString("id-ID")} Jt
                        </div>
                        <div className="text-[10px]">
                          {getTrendIndicator(
                            latestData.dpk || 0,
                            prevData.dpk || 0,
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grafik Visualisasi Surat */}
                  <div className="space-y-2 pt-2">
                    <div className="font-bold text-slate-900">
                      2. Grafik Visualisasi Pergerakan Tren Historis
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                        <div className="text-[11px] font-bold text-slate-700">
                          Volume Usaha (Aset, Kredit, DPK)
                        </div>
                        <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={reportData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#cbd5e1"
                              />
                              <XAxis dataKey="tahun" fontSize={9} />
                              <YAxis fontSize={9} />
                              <Tooltip />
                              <Legend wrapperStyle={{ fontSize: "9px" }} />
                              <Line
                                type="monotone"
                                dataKey="total_aset"
                                name="Aset"
                                stroke="#2563eb"
                                strokeWidth={2}
                              />
                              <Line
                                type="monotone"
                                dataKey="total_kredit"
                                name="Kredit"
                                stroke="#16a34a"
                                strokeWidth={2}
                              />
                              <Line
                                type="monotone"
                                dataKey="dpk"
                                name="DPK"
                                stroke="#9333ea"
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                        <div className="text-[11px] font-bold text-slate-700">
                          Rasio Utama (KPMM, NPL, ROA, BOPO)
                        </div>
                        <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={reportData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#cbd5e1"
                              />
                              <XAxis dataKey="tahun" fontSize={9} />
                              <YAxis fontSize={9} />
                              <Tooltip />
                              <Legend wrapperStyle={{ fontSize: "9px" }} />
                              <Line
                                type="monotone"
                                dataKey="kpmm"
                                name="KPMM"
                                stroke="#2563eb"
                                strokeWidth={2}
                              />
                              <Line
                                type="monotone"
                                dataKey="npl"
                                name="NPL"
                                stroke="#dc2626"
                                strokeWidth={2}
                              />
                              <Line
                                type="monotone"
                                dataKey="roa"
                                name="ROA"
                                stroke="#16a34a"
                                strokeWidth={2}
                              />
                              <Line
                                type="monotone"
                                dataKey="bopo"
                                name="BOPO"
                                stroke="#f59e0b"
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabel Data Historis */}
                  <div className="space-y-2 pt-2">
                    <div className="font-bold text-slate-900">
                      3. Matriks Data Historis Multi-Tahun
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-center text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-white">
                            <th className="py-2 px-2.5 text-left">Tahun</th>
                            <th className="py-2 px-2">KPMM (%)</th>
                            <th className="py-2 px-2">NPL (%)</th>
                            <th className="py-2 px-2">ROA (%)</th>
                            <th className="py-2 px-2">BOPO (%)</th>
                            <th className="py-2 px-2">NIM (%)</th>
                            <th className="py-2 px-2">LDR (%)</th>
                            <th className="py-2 px-2.5">Trend</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {reportData.map((row) => (
                            <tr key={row.tahun} className="hover:bg-slate-50">
                              <td className="py-2 px-2.5 text-left font-bold text-slate-900">
                                {row.tahun}
                              </td>
                              <td className="py-2 px-2">
                                {row.kpmm?.toFixed(2)}
                              </td>
                              <td
                                className={`py-2 px-2 font-bold ${row.npl > 5 ? "text-red-600" : "text-slate-800"}`}
                              >
                                {row.npl?.toFixed(2)}
                              </td>
                              <td className="py-2 px-2">
                                {row.roa?.toFixed(2)}
                              </td>
                              <td
                                className={`py-2 px-2 font-bold ${row.bopo > 90 ? "text-red-600" : "text-slate-800"}`}
                              >
                                {row.bopo?.toFixed(2)}
                              </td>
                              <td className="py-2 px-2">
                                {row.nim?.toFixed(2)}
                              </td>
                              <td className="py-2 px-2">
                                {row.ldr?.toFixed(2)}
                              </td>
                              <td className="py-2 px-2.5 uppercase font-bold text-[10px]">
                                {row.dominant_trend || "Stabil"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Penutup */}
                  <p className="pt-2">
                    Demikian laporan pengawasan ini disampaikan untuk menjadi
                    perhatian dan dipergunakan sebagaimana mestinya dalam rangka
                    menjaga kesehatan serta stabilitas kinerja lembaga keuangan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CSS Khusus agar saat tombol cetak ditekan, hanya dokumen surat yang tampil dan bersih dari sidebar */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report,
          #printable-report * {
            visibility: visible;
          }
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
