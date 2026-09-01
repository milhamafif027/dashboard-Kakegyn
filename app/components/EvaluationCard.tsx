"use client";
import { useState } from "react";
import { Activity, AlertTriangle, Search } from "lucide-react";

interface BprSummaryItem {
  id: string;
  name: string;
}

interface EvaluationCardProps {
  bprList: BprSummaryItem[];
  rawApiData: Record<string, unknown>[];
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

export default function EvaluationCard({
  bprList = [],
  rawApiData = [],
}: EvaluationCardProps) {
  const [selectedBprId, setSelectedBprId] = useState<string>(
    bprList[0]?.id || "",
  );

  // Sinkronisasi default jika bprList baru termuat
  const activeBpr = bprList.find((b) => b.id === selectedBprId) ||
    bprList[0] || { name: "" };
  const activeBprName = activeBpr.name;

  // Logika Analisis Otomatis Berbasis Data Bulanan BPR Terpilih
  const getDynamicEvaluation = () => {
    if (!activeBprName || rawApiData.length === 0) {
      return {
        note: "Memuat analisis data evaluasi...",
        deepDive: "Menunggu sinkronisasi data...",
      };
    }

    // Filter dan urutkan data historis BPR berdasarkan tahun & bulan
    const bprRows = rawApiData
      .filter((row) => String(row.bpr_name) === activeBprName)
      .sort((a, b) => {
        if (Number(a.tahun) !== Number(b.tahun)) {
          return Number(a.tahun) - Number(b.tahun);
        }
        return Number(a.bulan || 1) - Number(b.bulan || 1);
      });

    if (bprRows.length < 2) {
      return {
        note: `Entitas ${activeBprName} memiliki data historis terbatas. Parameter operasional terpantau stabil dalam batas kewajaran.`,
        deepDive: "Validasi kelengkapan pelaporan bulanan secara berkala.",
      };
    }

    // Ambil data bulan terakhir dan bulan sebelumnya untuk perbandingan
    const latest = bprRows[bprRows.length - 1];
    const previous = bprRows[bprRows.length - 2];

    const thnLatest = Number(latest.tahun);
    const blnLatest = Number(latest.bulan || 1);
    const bulanNama = namaBulanLengkap[blnLatest] || `Bulan ${blnLatest}`;

    const nplLatest = Number(latest.npl || 0);
    const nplPrev = Number(previous.npl || 0);
    const deltaNpl = Number((nplLatest - nplPrev).toFixed(2));

    const roaLatest = Number(latest.roa || 0);
    const roaPrev = Number(previous.roa || 0);
    const deltaRoa = Number((roaLatest - roaPrev).toFixed(2));

    const bopoLatest = Number(latest.bopo || 0);
    const bopoPrev = Number(previous.bopo || 0);
    const deltaBopo = Number((bopoLatest - bopoPrev).toFixed(2));

    let noteText = "";
    let deepDiveText = "";

    // Susun narasi berbasis angka real
    if (deltaNpl > 0) {
      noteText += `Pada periode ${bulanNama} ${thnLatest}, terdeteksi kenaikan rasio NPL Gross sebesar +${deltaNpl}% (menjadi ${nplLatest}%) dibanding bulan sebelumnya akibat potensi penurunan kelancaran pembayaran debitur. `;
    } else if (deltaNpl < 0) {
      noteText += `Pada periode ${bulanNama} ${thnLatest}, kualitas aset membaik dengan penurunan rasio NPL Gross sebesar ${deltaNpl}% (menjadi ${nplLatest}%). `;
    } else {
      noteText += `Pada periode ${bulanNama} ${thnLatest}, rasio NPL Gross stabil di level ${nplLatest}%. `;
    }

    if (deltaRoa < 0) {
      noteText += `Profitabilitas mengalami tekanan dengan penurunan ROA sebesar ${deltaRoa}% ke posisi ${roaLatest}%, `;
    } else {
      noteText += `Kinerja rentabilitas terpantau stabil dengan ROA di level ${roaLatest}%, `;
    }

    if (deltaBopo > 0) {
      noteText += `serta terjadi pembengkakan efisiensi BOPO sebesar +${deltaBopo}% (menjadi ${bopoLatest}%).`;
    } else {
      noteText += `serta rasio efisiensi BOPO terkendali di angka ${bopoLatest}%.`;
    }

    // Tentukan area pendalaman
    if (deltaNpl > 0 || deltaBopo > 0) {
      deepDiveText =
        "Efisiensi Biaya Operasional & Kualitas Kolektibilitas Kredit";
    } else if (deltaRoa < 0) {
      deepDiveText =
        "Optimalisasi Pendapatan Bunga Bersih & Pengendalian Biaya";
    } else {
      deepDiveText = "Konsistensi Pertumbuhan Portofolio Sehat";
    }

    return {
      note: noteText,
      deepDive: deepDiveText,
    };
  };

  const evaluationResult = getDynamicEvaluation();

  return (
    <div className="bg-white p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs md:text-sm font-extrabold text-slate-800 tracking-tight flex items-center space-x-2">
            <Activity size={16} className="text-blue-600 shrink-0" />
            <span>EVALUASI TREN & PENDALAMAN PENGAWAS</span>
          </h3>
          <select
            value={selectedBprId}
            onChange={(e) => setSelectedBprId(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none w-full sm:w-auto cursor-pointer"
          >
            {bprList &&
              bprList.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
          </select>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 p-3.5 sm:p-4 rounded-xl space-y-1.5">
          <div className="text-xs font-bold text-amber-800 flex items-center space-x-1.5">
            <AlertTriangle size={14} className="text-amber-600 shrink-0" />
            <span>Catatan Evaluasi Tren ({activeBprName}):</span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            {evaluationResult.note}
          </p>
        </div>
      </div>

      <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200/80 space-y-1">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Area yang Perlu Didalami Pengawas
        </div>
        <div className="text-xs sm:text-sm font-black text-slate-800 flex items-start sm:items-center space-x-2">
          <Search size={16} className="text-blue-600 shrink-0 mt-0.5 sm:mt-0" />
          <span>{evaluationResult.deepDive}</span>
        </div>
      </div>
    </div>
  );
}
