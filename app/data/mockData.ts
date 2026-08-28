export interface BPRData {
  id: string;
  name: string;
  rank: number;
  status: "HIGH ATTENTION" | "WATCH" | "STABLE";
  mainIndication: string;
  dominantTrend: "Memburuk" | "Membaik" | "Stabil";
  evaluationNote: string;
  deepDiveArea: string;
  kpmm: { [year: number]: number; trend: string };
  npl: { [year: number]: number; trend: string };
  ppka: { [year: number]: number; trend: string };
  roa: { [year: number]: number; trend: string };
  bopo: { [year: number]: number; trend: string };
  nim: { [year: number]: number; trend: string };
  ldr: { [year: number]: number; trend: string };
  cashRatio: { [year: number]: number; trend: string };
  totalAset: { [year: number]: number };
  totalKredit: { [year: number]: number };
  dpk: { [year: number]: number };
}

export const bprSummaryList: BPRData[] = [
  {
    id: "bpr-angga",
    name: "BPR Angga",
    rank: 1,
    status: "HIGH ATTENTION",
    mainIndication: "NPL meningkat, ROA turun, BOPO naik",
    dominantTrend: "Memburuk",
    evaluationNote:
      "NPL meningkat selama tiga periode terakhir, disertai penurunan ROA dan peningkatan BOPO. Kondisi tersebut menjadi area yang perlu dianalisis lebih lanjut.",
    deepDiveArea: "Kualitas Kredit & Efisiensi Operasional",
    kpmm: { 2021: 23.0, 2025: 24.15, trend: "Meningkat" },
    npl: { 2021: 3.25, 2025: 3.11, trend: "Menurun" },
    ppka: { 2021: 78.45, 2025: 82.47, trend: "Meningkat" },
    roa: { 2021: 1.53, 2025: 1.75, trend: "Meningkat" },
    bopo: { 2021: 82.28, 2025: 79.24, trend: "Menurun" },
    nim: { 2021: 5.62, 2025: 5.82, trend: "Meningkat" },
    ldr: { 2021: 90.71, 2025: 91.5, trend: "Stabil" },
    cashRatio: { 2021: 22.53, 2025: 22.9, trend: "Stabil" },
    totalAset: { 2021: 180753, 2025: 226263 },
    totalKredit: { 2021: 119034, 2025: 152360 },
    dpk: { 2021: 130881, 2025: 165511 },
  },
  {
    id: "bpr-bromo",
    name: "BPR Bromo",
    rank: 3,
    status: "STABLE",
    mainIndication: "Likuiditas stabil dan permodalan kuat",
    dominantTrend: "Membaik",
    evaluationNote:
      "Kinerja permodalan dan rentabilitas menunjukkan tren perbaikan yang konsisten dalam 3 periode terakhir.",
    deepDiveArea: "Permodalan & Rentabilitas",
    kpmm: { 2021: 22.1, 2025: 27.8, trend: "Meningkat" },
    npl: { 2021: 5.2, 2025: 3.5, trend: "Menurun" },
    ppka: { 2021: 78.9, 2025: 94.0, trend: "Meningkat" },
    roa: { 2021: 1.6, 2025: 2.0, trend: "Meningkat" },
    bopo: { 2021: 90.0, 2025: 82.0, trend: "Menurun" },
    nim: { 2021: 4.8, 2025: 6.3, trend: "Meningkat" },
    ldr: { 2021: 92.5, 2025: 102.0, trend: "Meningkat" },
    cashRatio: { 2021: 68.2, 2025: 110.0, trend: "Meningkat" },
    totalAset: { 2021: 170000, 2025: 210000 },
    totalKredit: { 2021: 110000, 2025: 140000 },
    dpk: { 2021: 120000, 2025: 150000 },
  },
  {
    id: "bpr-cendana",
    name: "BPR Cendana",
    rank: 2,
    status: "WATCH",
    mainIndication: "Fluktuasi pada rasio efisiensi operasional",
    dominantTrend: "Stabil",
    evaluationNote:
      "Perlu pemantauan khusus terhadap pergerakan biaya operasional terhadap pendapatan operasional.",
    deepDiveArea: "Efisiensi & LDR",
    kpmm: { 2021: 26.5, 2025: 25.6, trend: "Menurun" },
    npl: { 2021: 4.2, 2025: 4.5, trend: "Meningkat" },
    ppka: { 2021: 88.0, 2025: 88.0, trend: "Stabil" },
    roa: { 2021: 1.8, 2025: 1.7, trend: "Menurun" },
    bopo: { 2021: 86.2, 2025: 86.0, trend: "Stabil" },
    nim: { 2021: 5.6, 2025: 5.6, trend: "Stabil" },
    ldr: { 2021: 104.0, 2025: 98.0, trend: "Menurun" },
    cashRatio: { 2021: 95.5, 2025: 102.0, trend: "Meningkat" },
    totalAset: { 2021: 165000, 2025: 195000 },
    totalKredit: { 2021: 105000, 2025: 130000 },
    dpk: { 2021: 115000, 2025: 140000 },
  },
  {
    id: "bpr-desimal",
    name: "BPR Desimal",
    rank: 4,
    status: "WATCH",
    mainIndication: "Pertumbuhan kredit perlu diimbangi pencadangan",
    dominantTrend: "Memburuk",
    evaluationNote:
      "Peningkatan volume kredit diiringi kenaikan rasio kredit bermasalah secara bertahap.",
    deepDiveArea: "Kualitas Aset & Pencadangan",
    kpmm: { 2021: 30.0, 2025: 26.8, trend: "Menurun" },
    npl: { 2021: 2.5, 2025: 4.2, trend: "Meningkat" },
    ppka: { 2021: 96.0, 2025: 87.0, trend: "Menurun" },
    roa: { 2021: 2.1, 2025: 1.8, trend: "Menurun" },
    bopo: { 2021: 83.5, 2025: 86.0, trend: "Meningkat" },
    nim: { 2021: 6.2, 2025: 6.4, trend: "Meningkat" },
    ldr: { 2021: 110.0, 2025: 97.0, trend: "Menurun" },
    cashRatio: { 2021: 82.0, 2025: 120.0, trend: "Meningkat" },
    totalAset: { 2021: 190000, 2025: 235000 },
    totalKredit: { 2021: 125000, 2025: 160000 },
    dpk: { 2021: 135000, 2025: 170000 },
  },
  {
    id: "bpr-expres",
    name: "BPR Expres",
    rank: 5,
    status: "STABLE",
    mainIndication: "Kinerja keuangan ekspansif dan sehat",
    dominantTrend: "Membaik",
    evaluationNote:
      "Seluruh indikator utama berada dalam ambang batas ketentuan sehat OJK dengan tren positif.",
    deepDiveArea: "Ekspansi & Profitabilitas",
    kpmm: { 2021: 22.0, 2025: 25.0, trend: "Meningkat" },
    npl: { 2021: 7.0, 2025: 5.1, trend: "Menurun" },
    ppka: { 2021: 75.0, 2025: 90.0, trend: "Meningkat" },
    roa: { 2021: 1.5, 2025: 1.5, trend: "Stabil" },
    bopo: { 2021: 89.1, 2025: 87.0, trend: "Menurun" },
    nim: { 2021: 4.9, 2025: 5.3, trend: "Meningkat" },
    ldr: { 2021: 97.2, 2025: 99.0, trend: "Meningkat" },
    cashRatio: { 2021: 75.0, 2025: 100.0, trend: "Meningkat" },
    totalAset: { 2021: 160000, 2025: 200000 },
    totalKredit: { 2021: 100000, 2025: 135000 },
    dpk: { 2021: 110000, 2025: 145000 },
  },
];

export const chartTrendData = [
  { year: "2021", kpmm: 24.5, npl: 4.5, roa: 1.7, bopo: 86.0, ppka: 83.8 },
  { year: "2022", kpmm: 24.3, npl: 4.7, roa: 1.6, bopo: 86.8, ppka: 85.0 },
  { year: "2023", kpmm: 24.1, npl: 4.8, roa: 1.5, bopo: 87.2, ppka: 86.3 },
  { year: "2024", kpmm: 23.9, npl: 4.9, roa: 1.4, bopo: 87.5, ppka: 87.8 },
  { year: "2025", kpmm: 24.1, npl: 4.2, roa: 1.6, bopo: 86.0, ppka: 88.7 },
];
