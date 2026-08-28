"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  BookOpen,
  FileText,
  Shield,
  Layers,
  Calculator,
  CheckCircle2,
  ExternalLink,
  Download,
  X,
} from "lucide-react";

interface RegulationItem {
  id: string;
  code: string;
  title: string;
  description: string;
  pdfUrl: string;
}

export default function DokumenPedomanPage() {
  const [selectedPdf, setSelectedPdf] = useState<RegulationItem | null>(null);

  const regulations: RegulationItem[] = [
    {
      id: "pojk-23-2024",
      code: "POJK 23 Tahun 2024",
      title: "Pelaporan Sistem & Transparansi Keuangan BPR/BPRS",
      description:
        "Pelaporan melalui sistem pelaporan OJK dan transparansi kondisi keuangan BPR/BPRS.",
      pdfUrl:
        "/pdf/POJK 23 Tahun 2024 Pelaporan Melalui Sistem Pelaporan Otoritas Jasa Keuangan dan Transparansi Kondisi Keuangan Bagi BPR dan BPRS.pdf",
    },
    {
      id: "pojk-28-2023",
      code: "POJK 28 Tahun 2023",
      title: "Penetapan Status & Tindak Lanjut Pengawasan",
      description: "Penetapan status dan tindak lanjut pengawasan BPR/BPRS.",
      pdfUrl:
        "/pdf/POJK 28 Tahun 2023 Penetapan Status dan Tindak Lanjut Pengawasan Bank Perekonomian Rakyat dan Bank Perekonomian Rakyat Syariah.pdf",
    },
    {
      id: "pojk-1-2024",
      code: "POJK 1 Tahun 2024",
      title: "Kualitas Aset BPR & Pencadangan",
      description: "Kualitas aset BPR dan pencadangan aset produktif.",
      pdfUrl:
        "/pdf/POJK 1 Tahun 2024 Kualitas Aset Bank Perekonomian Rakyat.pdf",
    },
    {
      id: "seojk-11-2022",
      code: "SEOJK 11/SEOJK.03/2022 & POJK 3/2022",
      title: "Penilaian Tingkat Kesehatan BPR/BPRS",
      description:
        "Ketentuan penilaian tingkat kesehatan bank perkreditan rakyat dan pembiayaan rakyat syariah.",
      pdfUrl:
        "/pdf/SEOJK+11-SEOJK.03-2022+Penilaian Tingkat Kesehatan Bank Perkreditan Rakyat Dan Bank Pembiayaan Rakyat Syariah+2022 (1).pdf",
    },
    {
      id: "seojk-1-2019",
      code: "SEOJK 1/SEOJK.03/2019",
      title: "Penerapan Manajemen Risiko Bagi BPR",
      description:
        "Pedoman penerapan manajemen risiko secara efektif bagi bank perkreditan rakyat.",
      pdfUrl:
        "/pdf/SEOJK+1-SEOJK.03-2019+Penerapan Manajemen Risiko Bagi Bank Perkreditan Rakyat+2019 (1).pdf",
    },
    {
      id: "pojk-7-2026",
      code: "POJK 7 Tahun 2026",
      title: "Ketentuan KPMM & Modal Inti Minimum",
      description:
        "Ketentuan terbaru terkait KPMM dan pemenuhan modal inti minimum.",
      pdfUrl:
        "/pdf/POJK Nomor 7 Tahun 2026 Kewajiban Penyediaan Modal Minimum dan Pemenuhan Modal Inti Minimum Bank Perekonomian Rakyat.pdf",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header />
        <main className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
              <BookOpen size={28} />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Tab Dokumen Eksekutif
              </div>
              <h2 className="text-lg md:text-xl font-extrabold text-slate-800">
                Pedoman Analisis Tren Keuangan BPR
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Referensi landasan regulasi, metode kalkulasi, dan ruang lingkup
                pengawasan.
              </p>
            </div>
          </div>

          {/* Konten Dokumen */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-8 text-xs text-slate-700 leading-relaxed">
            {/* 1. Pendahuluan */}
            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                <FileText size={16} className="text-blue-600 shrink-0" />
                <span>1. Pendahuluan</span>
              </h3>
              <p>
                Dashboard Evaluasi dan Rekapitulasi Tren Indikator Keuangan BPR
                dirancang untuk mengoptimalkan proses pengolahan laporan
                keuangan BPR menjadi informasi analitis awal pengawasan.
                Dashboard mempercepat perolehan informasi perkembangan kondisi
                keuangan tanpa menggantikan <em>professional judgment</em>{" "}
                pengawas.
              </p>
            </section>

            {/* 2. Komponen Penilaian & Indikator (11 Indikator Lengkap) */}
            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Layers size={16} className="text-blue-600 shrink-0" />
                <span>
                  2. Komponen Penilaian & Indikator Keuangan (11 Indikator
                  Utama)
                </span>
              </h3>
              <p className="text-slate-500 text-[11px]">
                Mencakup 3 parameter volume usaha serta 8 rasio utama kesehatan
                keuangan berstandar OJK:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>Total Aset:</strong> Volume skala usaha berdasarkan
                  akumulasi aset.
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>Total Kredit:</strong> Volume penyaluran
                  pembiayaan/kredit produktif dan konsumtif.
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>DPK:</strong> Volume penghimpunan Dana Pihak Ketiga
                  (Tabungan & Deposito).
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>KPMM:</strong> Perkembangan kondisi permodalan BPR
                  terhadap ATMR.
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>NPL Gross:</strong> Perkembangan rasio kredit
                  bermasalah.
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>Cadangan/PPKA:</strong> Kecukupan pencadangan aset
                  produktif.
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>ROA:</strong> Kemampuan BPR menghasilkan laba
                  (rentabilitas).
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>BOPO:</strong> Tingkat efisiensi operasional terhadap
                  pendapatan operasional.
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>NIM:</strong> Margin bunga bersih pengelolaan
                  portofolio.
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>LDR:</strong> Rasio penyaluran kredit terhadap DPK
                  (likuiditas).
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100 sm:col-span-2 md:col-span-1">
                  <strong>Cash Ratio:</strong> Kondisi kecukupan kas terhadap
                  kewajiban lancar.
                </li>
              </ul>
            </section>

            {/* 3. Rumus & Kalkulasi */}
            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Calculator size={16} className="text-blue-600 shrink-0" />
                <span>3. Rumus dan Kalkulasi</span>
              </h3>
              <p>
                Menyimpan data pembentuk rasio (kredit, laba, aset, modal, DPK)
                serta hasil perhitungan rasio dan perubahan antarperiode (dalam{" "}
                <em>percentage point</em>), contoh: NPL periode lalu 3,5% dan
                berjalan 4,2% (perubahan +0.7 pp).
              </p>
            </section>

            {/* 4. Kategorisasi Hasil Evaluasi */}
            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                <span>4. Kategorisasi Hasil Evaluasi</span>
              </h3>
              <p>
                Kategorisasi arah tren meliputi <strong>Meningkat (↑)</strong>,{" "}
                <strong>Menurun (↓)</strong>, <strong>Stabil (→)</strong>, dan{" "}
                <strong>Perlu Perhatian (▲)</strong>. Kategori perlu perhatian
                bukan berarti BPR bermasalah, melainkan memerlukan pendalaman
                pengawas lebih lanjut berdasarkan konsistensi dan besaran
                perubahan.
              </p>
            </section>

            {/* 5. Ketentuan Analisis Tren (Interaktif PDF Viewer/Modal Trigger) */}
            <section className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Shield size={16} className="text-blue-600 shrink-0" />
                <span>
                  5. Ketentuan Analisis Tren Keuangan (Dasar Regulasi OJK)
                </span>
              </h3>
              <p className="text-slate-500 text-[11px]">
                Klik pada salah satu peraturan di bawah untuk melihat dokumen
                PDF secara langsung di pop-up:
              </p>

              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {regulations.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPdf(item)}
                    className="group bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 p-3.5 rounded-xl flex items-center justify-between transition-all cursor-pointer shadow-2xs hover:border-blue-300"
                  >
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-slate-800 text-xs group-hover:text-blue-600 transition-colors flex items-center space-x-2">
                        <span>{item.code}</span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-semibold">
                          Buka di Pop-Up
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {item.description}
                      </p>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors shrink-0">
                      <ExternalLink size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* MODAL PREVIEW / VIEWER PDF LANGSUNG */}
      {selectedPdf && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2 truncate pr-4">
                <FileText size={18} className="text-blue-400 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider truncate">
                  {selectedPdf.code}: {selectedPdf.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPdf(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Embed PDF langsung tampil di pop-up */}
            <div className="flex-1 bg-slate-100 p-2 sm:p-4 overflow-hidden flex flex-col">
              <iframe
                src={`${selectedPdf.pdfUrl}#toolbar=1`}
                title={selectedPdf.title}
                className="w-full h-full rounded-xl border border-slate-300 bg-white shadow-inner"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Dokumen regulasi resmi Otoritas Jasa Keuangan (OJK).
              </span>
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <a
                  href={selectedPdf.pdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <Download size={14} />
                  <span>Unduh File</span>
                </a>
                <button
                  onClick={() => setSelectedPdf(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
