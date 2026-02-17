// Salary Calculator Logic — Indonesian Income Tax (PPh 21)
// Based on Indonesian tax regulations and KHL (Kebutuhan Hidup Layak) data

// ============================================================
// TYPES
// ============================================================

export type PTKPStatus =
  | 'TK/0' | 'TK/1' | 'TK/2' | 'TK/3'
  | 'K/0'  | 'K/1'  | 'K/2'  | 'K/3'
  | 'K/I/0'| 'K/I/1'| 'K/I/2'| 'K/I/3';

export interface City {
  name: string;
  khl: number; // monthly KHL in IDR
}

export interface Province {
  name: string;
  cities: City[];
}

export interface SalaryDeductions {
  pph21: number;
  bpjsKesehatan: number;
  bpjsJHT: number;
  bpjsJP: number;
  totalDeductions: number;
}

export type KHLLabel = 'Sangat Layak' | 'Layak' | 'Cukup' | 'Kurang' | 'Tidak Layak';

export interface KHLScore {
  label: KHLLabel;
  score: number;      // 1–5
  ratio: number;       // net salary / KHL
  khl: number;         // cost of living for selected city
  color: string;
}

export interface SalaryResult {
  grossSalary: number;
  deductions: SalaryDeductions;
  netSalary: number;
  khlScore: KHLScore;
  status: PTKPStatus;
  location: string;
}

// ============================================================
// PTKP — Penghasilan Tidak Kena Pajak (Non-Taxable Income)
// Per PMK 101/PMK.010/2016 (still active through 2025)
// Annual thresholds
// ============================================================

export const PTKP: Record<PTKPStatus, { annual: number; label: string }> = {
  'TK/0':  { annual: 54_000_000, label: 'Tidak Kawin, 0 tanggungan' },
  'TK/1':  { annual: 58_500_000, label: 'Tidak Kawin, 1 tanggungan' },
  'TK/2':  { annual: 63_000_000, label: 'Tidak Kawin, 2 tanggungan' },
  'TK/3':  { annual: 67_500_000, label: 'Tidak Kawin, 3 tanggungan' },
  'K/0':   { annual: 58_500_000, label: 'Kawin, 0 tanggungan' },
  'K/1':   { annual: 63_000_000, label: 'Kawin, 1 tanggungan' },
  'K/2':   { annual: 67_500_000, label: 'Kawin, 2 tanggungan' },
  'K/3':   { annual: 72_000_000, label: 'Kawin, 3 tanggungan' },
  'K/I/0': { annual: 112_500_000, label: 'Kawin + Istri digabung, 0 tanggungan' },
  'K/I/1': { annual: 117_000_000, label: 'Kawin + Istri digabung, 1 tanggungan' },
  'K/I/2': { annual: 121_500_000, label: 'Kawin + Istri digabung, 2 tanggungan' },
  'K/I/3': { annual: 126_000_000, label: 'Kawin + Istri digabung, 3 tanggungan' },
};

export const PTKP_STATUSES: PTKPStatus[] = Object.keys(PTKP) as PTKPStatus[];

// ============================================================
// PPh 21 Tax Brackets (Progressive)
// Per UU HPP No. 7/2021
// ============================================================

interface TaxBracket {
  upperLimit: number;
  rate: number;
}

const TAX_BRACKETS: TaxBracket[] = [
  { upperLimit: 60_000_000,      rate: 0.05 },
  { upperLimit: 250_000_000,     rate: 0.15 },
  { upperLimit: 500_000_000,     rate: 0.25 },
  { upperLimit: 5_000_000_000,   rate: 0.30 },
  { upperLimit: Infinity,        rate: 0.35 },
];

// ============================================================
// BPJS Constants (Employee contributions)
// ============================================================

const BPJS = {
  kesehatan: 0.01,    // 1% employee
  jht: 0.02,          // 2% employee (Jaminan Hari Tua)
  jp: 0.01,           // 1% employee (Jaminan Pensiun)
  jpMaxSalary: 10_042_300, // JP salary cap 2025
};

// ============================================================
// PROVINCE & CITY DATA with KHL (monthly, IDR)
// Estimated from BPS Susenas 2021 + adjusted for inflation
// (2022: 5.5%, 2023: 2.61%, 2024: 2.31%, 2025: 2.5%)
// Cumulative ≈ 13.5%
// ============================================================

export const PROVINCES: Province[] = [
  {
    name: 'DKI Jakarta',
    cities: [
      { name: 'Jakarta Pusat', khl: 5_400_000 },
      { name: 'Jakarta Utara', khl: 5_200_000 },
      { name: 'Jakarta Barat', khl: 5_100_000 },
      { name: 'Jakarta Selatan', khl: 5_500_000 },
      { name: 'Jakarta Timur', khl: 5_000_000 },
      { name: 'Kepulauan Seribu', khl: 4_800_000 },
    ],
  },
  {
    name: 'Jawa Barat',
    cities: [
      { name: 'Kota Bandung', khl: 4_200_000 },
      { name: 'Kota Bekasi', khl: 4_800_000 },
      { name: 'Kota Bogor', khl: 4_400_000 },
      { name: 'Kota Depok', khl: 4_600_000 },
      { name: 'Kab. Bandung', khl: 3_600_000 },
      { name: 'Kab. Bekasi', khl: 4_500_000 },
      { name: 'Kab. Bogor', khl: 3_800_000 },
      { name: 'Kab. Karawang', khl: 4_300_000 },
      { name: 'Kab. Cirebon', khl: 3_400_000 },
      { name: 'Kab. Subang', khl: 3_300_000 },
      { name: 'Kab. Sukabumi', khl: 3_200_000 },
      { name: 'Kab. Garut', khl: 3_100_000 },
    ],
  },
  {
    name: 'Jawa Tengah',
    cities: [
      { name: 'Kota Semarang', khl: 3_800_000 },
      { name: 'Kota Solo', khl: 3_400_000 },
      { name: 'Kab. Semarang', khl: 3_200_000 },
      { name: 'Kab. Kudus', khl: 3_300_000 },
      { name: 'Kab. Pekalongan', khl: 3_000_000 },
      { name: 'Kab. Cilacap', khl: 2_900_000 },
      { name: 'Kab. Banyumas', khl: 3_000_000 },
      { name: 'Kab. Magelang', khl: 2_800_000 },
    ],
  },
  {
    name: 'DI Yogyakarta',
    cities: [
      { name: 'Kota Yogyakarta', khl: 3_500_000 },
      { name: 'Kab. Sleman', khl: 3_300_000 },
      { name: 'Kab. Bantul', khl: 3_000_000 },
      { name: 'Kab. Gunung Kidul', khl: 2_700_000 },
      { name: 'Kab. Kulon Progo', khl: 2_800_000 },
    ],
  },
  {
    name: 'Jawa Timur',
    cities: [
      { name: 'Kota Surabaya', khl: 4_400_000 },
      { name: 'Kota Malang', khl: 3_600_000 },
      { name: 'Kab. Sidoarjo', khl: 4_000_000 },
      { name: 'Kab. Gresik', khl: 3_800_000 },
      { name: 'Kab. Pasuruan', khl: 3_500_000 },
      { name: 'Kab. Jember', khl: 3_000_000 },
      { name: 'Kab. Kediri', khl: 3_100_000 },
      { name: 'Kab. Mojokerto', khl: 3_600_000 },
    ],
  },
  {
    name: 'Banten',
    cities: [
      { name: 'Kota Tangerang', khl: 4_800_000 },
      { name: 'Kota Tangerang Selatan', khl: 5_000_000 },
      { name: 'Kota Serang', khl: 3_600_000 },
      { name: 'Kota Cilegon', khl: 4_000_000 },
      { name: 'Kab. Tangerang', khl: 4_500_000 },
      { name: 'Kab. Serang', khl: 3_200_000 },
    ],
  },
  {
    name: 'Bali',
    cities: [
      { name: 'Kota Denpasar', khl: 4_200_000 },
      { name: 'Kab. Badung', khl: 4_500_000 },
      { name: 'Kab. Gianyar', khl: 3_800_000 },
      { name: 'Kab. Tabanan', khl: 3_400_000 },
      { name: 'Kab. Buleleng', khl: 3_200_000 },
    ],
  },
  {
    name: 'Sumatera Utara',
    cities: [
      { name: 'Kota Medan', khl: 4_000_000 },
      { name: 'Kab. Deli Serdang', khl: 3_500_000 },
      { name: 'Kota Binjai', khl: 3_200_000 },
      { name: 'Kab. Langkat', khl: 3_000_000 },
      { name: 'Kab. Simalungun', khl: 2_900_000 },
    ],
  },
  {
    name: 'Sumatera Barat',
    cities: [
      { name: 'Kota Padang', khl: 3_800_000 },
      { name: 'Kota Bukittinggi', khl: 3_300_000 },
      { name: 'Kab. Agam', khl: 3_000_000 },
      { name: 'Kab. Pesisir Selatan', khl: 2_800_000 },
    ],
  },
  {
    name: 'Sumatera Selatan',
    cities: [
      { name: 'Kota Palembang', khl: 3_600_000 },
      { name: 'Kab. Musi Banyuasin', khl: 3_200_000 },
      { name: 'Kab. Ogan Ilir', khl: 2_900_000 },
      { name: 'Kab. Banyuasin', khl: 3_000_000 },
    ],
  },
  {
    name: 'Riau',
    cities: [
      { name: 'Kota Pekanbaru', khl: 4_000_000 },
      { name: 'Kab. Kampar', khl: 3_400_000 },
      { name: 'Kab. Siak', khl: 3_600_000 },
      { name: 'Kab. Bengkalis', khl: 3_500_000 },
    ],
  },
  {
    name: 'Kepulauan Riau',
    cities: [
      { name: 'Kota Batam', khl: 4_600_000 },
      { name: 'Kota Tanjung Pinang', khl: 4_000_000 },
      { name: 'Kab. Bintan', khl: 3_800_000 },
    ],
  },
  {
    name: 'Lampung',
    cities: [
      { name: 'Kota Bandar Lampung', khl: 3_400_000 },
      { name: 'Kab. Lampung Selatan', khl: 2_800_000 },
      { name: 'Kab. Lampung Tengah', khl: 2_700_000 },
    ],
  },
  {
    name: 'Jambi',
    cities: [
      { name: 'Kota Jambi', khl: 3_500_000 },
      { name: 'Kab. Muaro Jambi', khl: 3_000_000 },
      { name: 'Kab. Batanghari', khl: 2_900_000 },
    ],
  },
  {
    name: 'Bengkulu',
    cities: [
      { name: 'Kota Bengkulu', khl: 3_300_000 },
      { name: 'Kab. Rejang Lebong', khl: 2_800_000 },
    ],
  },
  {
    name: 'Bangka Belitung',
    cities: [
      { name: 'Kota Pangkal Pinang', khl: 3_800_000 },
      { name: 'Kab. Bangka', khl: 3_400_000 },
      { name: 'Kab. Belitung', khl: 3_500_000 },
    ],
  },
  {
    name: 'Aceh',
    cities: [
      { name: 'Kota Banda Aceh', khl: 3_800_000 },
      { name: 'Kab. Aceh Besar', khl: 3_200_000 },
      { name: 'Kota Lhokseumawe', khl: 3_400_000 },
    ],
  },
  {
    name: 'Kalimantan Barat',
    cities: [
      { name: 'Kota Pontianak', khl: 3_600_000 },
      { name: 'Kab. Kubu Raya', khl: 3_200_000 },
      { name: 'Kab. Ketapang', khl: 3_000_000 },
    ],
  },
  {
    name: 'Kalimantan Selatan',
    cities: [
      { name: 'Kota Banjarmasin', khl: 3_700_000 },
      { name: 'Kab. Banjar', khl: 3_200_000 },
      { name: 'Kab. Tanah Laut', khl: 3_400_000 },
    ],
  },
  {
    name: 'Kalimantan Tengah',
    cities: [
      { name: 'Kota Palangkaraya', khl: 3_800_000 },
      { name: 'Kab. Kotawaringin Timur', khl: 3_400_000 },
    ],
  },
  {
    name: 'Kalimantan Timur',
    cities: [
      { name: 'Kota Samarinda', khl: 4_200_000 },
      { name: 'Kota Balikpapan', khl: 4_400_000 },
      { name: 'Kab. Kutai Kartanegara', khl: 3_800_000 },
    ],
  },
  {
    name: 'Kalimantan Utara',
    cities: [
      { name: 'Kota Tarakan', khl: 4_200_000 },
      { name: 'Kab. Bulungan', khl: 3_800_000 },
    ],
  },
  {
    name: 'Sulawesi Selatan',
    cities: [
      { name: 'Kota Makassar', khl: 3_800_000 },
      { name: 'Kab. Gowa', khl: 3_200_000 },
      { name: 'Kab. Maros', khl: 3_000_000 },
      { name: 'Kab. Bone', khl: 2_800_000 },
    ],
  },
  {
    name: 'Sulawesi Utara',
    cities: [
      { name: 'Kota Manado', khl: 3_800_000 },
      { name: 'Kab. Minahasa', khl: 3_200_000 },
      { name: 'Kota Bitung', khl: 3_400_000 },
    ],
  },
  {
    name: 'Sulawesi Tengah',
    cities: [
      { name: 'Kota Palu', khl: 3_500_000 },
      { name: 'Kab. Donggala', khl: 3_000_000 },
    ],
  },
  {
    name: 'Sulawesi Tenggara',
    cities: [
      { name: 'Kota Kendari', khl: 3_600_000 },
      { name: 'Kab. Konawe', khl: 3_000_000 },
    ],
  },
  {
    name: 'Gorontalo',
    cities: [
      { name: 'Kota Gorontalo', khl: 3_300_000 },
      { name: 'Kab. Gorontalo', khl: 2_800_000 },
    ],
  },
  {
    name: 'Sulawesi Barat',
    cities: [
      { name: 'Kab. Mamuju', khl: 3_200_000 },
      { name: 'Kab. Polewali Mandar', khl: 2_800_000 },
    ],
  },
  {
    name: 'Nusa Tenggara Barat',
    cities: [
      { name: 'Kota Mataram', khl: 3_200_000 },
      { name: 'Kab. Lombok Barat', khl: 2_800_000 },
      { name: 'Kab. Sumbawa', khl: 2_900_000 },
    ],
  },
  {
    name: 'Nusa Tenggara Timur',
    cities: [
      { name: 'Kota Kupang', khl: 3_400_000 },
      { name: 'Kab. Sikka', khl: 2_600_000 },
      { name: 'Kab. Manggarai', khl: 2_700_000 },
    ],
  },
  {
    name: 'Maluku',
    cities: [
      { name: 'Kota Ambon', khl: 3_800_000 },
      { name: 'Kab. Maluku Tengah', khl: 3_200_000 },
    ],
  },
  {
    name: 'Maluku Utara',
    cities: [
      { name: 'Kota Ternate', khl: 3_600_000 },
      { name: 'Kab. Halmahera Utara', khl: 3_200_000 },
    ],
  },
  {
    name: 'Papua',
    cities: [
      { name: 'Kota Jayapura', khl: 4_800_000 },
      { name: 'Kab. Mimika', khl: 5_200_000 },
      { name: 'Kab. Jayapura', khl: 4_200_000 },
    ],
  },
  {
    name: 'Papua Barat',
    cities: [
      { name: 'Kota Sorong', khl: 4_600_000 },
      { name: 'Kab. Manokwari', khl: 4_200_000 },
    ],
  },
];

// ============================================================
// CALCULATION FUNCTIONS
// ============================================================

/**
 * Calculate annual PPh 21 tax using progressive brackets.
 * @param annualTaxableIncome taxable income (after PTKP)
 */
function calculatePPh21Annual(annualTaxableIncome: number): number {
  if (annualTaxableIncome <= 0) return 0;

  let tax = 0;
  let remaining = annualTaxableIncome;
  let prevLimit = 0;

  for (const bracket of TAX_BRACKETS) {
    const bracketWidth = bracket.upperLimit - prevLimit;
    const taxable = Math.min(remaining, bracketWidth);
    tax += taxable * bracket.rate;
    remaining -= taxable;
    prevLimit = bracket.upperLimit;
    if (remaining <= 0) break;
  }

  return tax;
}

/**
 * Calculate BPJS deductions (employee portion).
 */
function calculateBPJS(monthlySalary: number): {
  kesehatan: number;
  jht: number;
  jp: number;
} {
  const jpBase = Math.min(monthlySalary, BPJS.jpMaxSalary);
  return {
    kesehatan: Math.round(monthlySalary * BPJS.kesehatan),
    jht: Math.round(monthlySalary * BPJS.jht),
    jp: Math.round(jpBase * BPJS.jp),
  };
}

/**
 * Determine KHL score label and color.
 */
function getKHLScore(netSalary: number, khl: number): KHLScore {
  const ratio = khl > 0 ? netSalary / khl : 0;

  let label: KHLLabel;
  let score: number;
  let color: string;

  if (ratio >= 3) {
    label = 'Sangat Layak';
    score = 5;
    color = '#10B981'; // green
  } else if (ratio >= 2) {
    label = 'Layak';
    score = 4;
    color = '#34D399'; // light green
  } else if (ratio >= 1.2) {
    label = 'Cukup';
    score = 3;
    color = '#F59E0B'; // amber
  } else if (ratio >= 0.8) {
    label = 'Kurang';
    score = 2;
    color = '#F97316'; // orange
  } else {
    label = 'Tidak Layak';
    score = 1;
    color = '#EF4444'; // red
  }

  return { label, score, ratio, khl, color };
}

// ============================================================
// MAIN CALCULATION
// ============================================================

export function calculateSalary(
  grossMonthlySalary: number,
  status: PTKPStatus,
  provinceIndex: number,
  cityIndex: number,
): SalaryResult {
  // BPJS employee deductions
  const bpjs = calculateBPJS(grossMonthlySalary);

  // Biaya jabatan (5% of gross, max 500k/month)
  const biayaJabatan = Math.min(grossMonthlySalary * 0.05, 500_000);

  // Annual taxable income
  const annualGross = grossMonthlySalary * 12;
  const annualDeductible = (biayaJabatan + bpjs.jht + bpjs.jp) * 12;
  const annualNetto = annualGross - annualDeductible;
  const ptkpAnnual = PTKP[status].annual;
  const annualTaxableIncome = Math.max(annualNetto - ptkpAnnual, 0);

  // PPh 21
  const annualTax = calculatePPh21Annual(annualTaxableIncome);
  const monthlyTax = Math.round(annualTax / 12);

  // Total deductions
  const totalDeductions = monthlyTax + bpjs.kesehatan + bpjs.jht + bpjs.jp;
  const netSalary = grossMonthlySalary - totalDeductions;

  // KHL scoring
  const province = PROVINCES[provinceIndex] || PROVINCES[0];
  const city = province.cities[cityIndex] || province.cities[0];
  const khlScore = getKHLScore(netSalary, city.khl);

  return {
    grossSalary: grossMonthlySalary,
    deductions: {
      pph21: monthlyTax,
      bpjsKesehatan: bpjs.kesehatan,
      bpjsJHT: bpjs.jht,
      bpjsJP: bpjs.jp,
      totalDeductions,
    },
    netSalary,
    khlScore,
    status,
    location: `${city.name}, ${province.name}`,
  };
}

// ============================================================
// FORMATTING
// ============================================================

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
