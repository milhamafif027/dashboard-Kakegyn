"use client";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  BookOpen,
  FileText,
  Shield,
  Layers,
  Calculator,
  CheckCircle2,
} from "lucide-react";

export default function DokumenPedomanPage() {
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden select-none">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        <main className="p-6 space-y-6 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <BookOpen size={28} />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Tab Dokumen Eksekutif
              </div>
              <h2 className="text-xl font-extrabold text-slate-800">
                Pedoman Analisis Tren Keuangan BPR
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Referensi landasan regulasi, metode kalkulasi, dan ruang lingkup
                pengawasan.
              </p>
            </div>
          </div>

          {/* Konten Dokumen */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-8 text-xs text-slate-700 leading-relaxed">
            {/* 1. Pendahuluan */}
            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                <FileText size={16} className="text-blue-600" />
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

            {/* 2. Komponen Penilaian & Indikator */}
            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Layers size={16} className="text-blue-600" />
                <span>
                  2. Komponen Penilaian & Indikator Keuangan (8 Indikator Utama)
                </span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>KPMM:</strong> Perkembangan kondisi permodalan BPR.
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>NPL:</strong> Perkembangan kualitas kredit bermasalah.
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>ROA:</strong> Kemampuan BPR menghasilkan laba
                  (rentabilitas).
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>BOPO:</strong> Tingkat efisiensi operasional BPR.
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>LDR:</strong> Penyaluran kredit terhadap sumber dana
                  (DPK).
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>Cash Ratio:</strong> Kondisi likuiditas kas.
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>PPAP / Rasio Pencadangan:</strong> Kecukupan
                  pencadangan aset produktif.
                </li>
                <li className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong>KAP:</strong> Perkembangan Kualitas Aset Produktif.
                </li>
              </ul>
            </section>

            {/* 3. Rumus & Kalkulasi */}
            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Calculator size={16} className="text-blue-600" />
                <span>3. Rumus dan Kalkulasi</span>
              </h3>
              <p>
                Menyimpan data pembentuk rasio (kredit, laba, aset, modal, DPK)
                serta hasil perhitungan rasio dan perubahan antarperiode (dalam{" "}
                <em>percentage point</em>), contoh: NPL periode lalu 3,5% dan
                berjalan 4,2% (perubahan +0.7 pp)[cite: 1].
              </p>
            </section>

            {/* 4. Kategorisasi Hasil Evaluasi */}
            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                <CheckCircle2 size={16} className="text-blue-600" />
                <span>4. Kategorisasi Hasil Evaluasi</span>
              </h3>
              <p>
                Kategorisasi arah tren meliputi <strong>Meningkat (↑)</strong>,{" "}
                <strong>Menurun (↓)</strong>, <strong>Stabil (→)</strong>, dan{" "}
                <strong>Perlu Perhatian (▲)</strong>[cite: 1]. Kategori perlu
                perhatian bukan berarti BPR bermasalah, melainkan memerlukan
                pendalaman pengawas lebih lanjut berdasarkan konsistensi dan
                besaran perubahan[cite: 1].
              </p>
            </section>

            {/* 5. Ketentuan Analisis Tren */}
            <section className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Shield size={16} className="text-blue-600" />
                <span>
                  5. Ketentuan Analisis Tren Keuangan (Dasar Regulasi OJK)
                </span>
              </h3>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li>
                  <strong>POJK 23 Tahun 2024:</strong> Pelaporan melalui sistem
                  pelaporan OJK dan transparansi kondisi keuangan BPR/BPRS[cite:
                  1].
                </li>
                <li>
                  <strong>POJK 28 Tahun 2023:</strong> Penetapan status dan
                  tindak lanjut pengawasan BPR/BPRS[cite: 1].
                </li>
                <li>
                  <strong>POJK 1 Tahun 2024:</strong> Kualitas aset BPR dan
                  pencadangan[cite: 1].
                </li>
                <li>
                  <strong>POJK 3 Tahun 2022 & SEOJK 11/SEOJK.03/2022:</strong>{" "}
                  Penilaian tingkat kesehatan BPR/BPRS[cite: 1].
                </li>
                <li>
                  <strong>POJK 7 Tahun 2026:</strong> Ketentuan terbaru terkait
                  KPMM dan pemenuhan modal inti minimum[cite: 1].
                </li>
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
