// Salary Calculator Component
import { useState, useMemo } from 'react';
import {
    calculateSalary,
    formatRupiah,
    PROVINCES,
    PTKP,
    PTKP_STATUSES,
    type PTKPStatus,
    type SalaryResult,
} from '~/utils/salaryCalc';
import '~/styles/calculator.css';

export default function SalaryCalculator() {
    const [grossSalary, setGrossSalary] = useState<string>('');
    const [status, setStatus] = useState<PTKPStatus>('TK/0');
    const [provinceIdx, setProvinceIdx] = useState<number>(0);
    const [cityIdx, setCityIdx] = useState<number>(0);
    const [result, setResult] = useState<SalaryResult | null>(null);

    const cities = useMemo(() => PROVINCES[provinceIdx]?.cities ?? [], [provinceIdx]);

    const handleProvinceChange = (idx: number) => {
        setProvinceIdx(idx);
        setCityIdx(0);
    };

    const handleCalculate = () => {
        const num = parseFloat(grossSalary.replace(/\D/g, ''));
        if (!isNaN(num) && num > 0) {
            setResult(calculateSalary(num, status, provinceIdx, cityIdx));
        } else {
            setResult(null);
        }
    };

    const handleSalaryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');
        if (raw === '') {
            setGrossSalary('');
            return;
        }
        const formatted = new Intl.NumberFormat('id-ID').format(parseInt(raw));
        setGrossSalary(formatted);
    };

    // Score bar visual
    const scoreBar = (score: number) => {
        return (
            <div style={{
                display: 'flex',
                gap: '4px',
                marginTop: 'var(--spacing-sm)',
            }}>
                {[1, 2, 3, 4, 5].map((s) => (
                    <div
                        key={s}
                        style={{
                            flex: 1,
                            height: '8px',
                            borderRadius: '4px',
                            background: s <= score
                                ? (score >= 4 ? '#10B981' : score >= 3 ? '#F59E0B' : '#EF4444')
                                : 'var(--color-bg-elevated)',
                            transition: 'all 0.3s ease',
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="calculator-wrapper">
            <div className="calculator-container glass-card-intense" style={{ maxWidth: '660px' }}>
                <div className="calculator">
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 'var(--spacing-lg)',
                    }}>
                        <h2 style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '1.5rem',
                            color: 'var(--color-primary-dark)',
                            margin: 0,
                        }}>
                            Salary Calculator
                        </h2>
                        <span style={{
                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                            background: 'var(--color-bg-elevated)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--color-text-secondary)',
                        }}>
                            🇮🇩 PPh 21
                        </span>
                    </div>

                    {/* Info */}
                    <div style={{
                        background: 'rgba(37, 99, 235, 0.05)',
                        border: '1px solid var(--color-primary-light)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--spacing-md)',
                        marginBottom: 'var(--spacing-lg)',
                        fontSize: '0.85rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.6,
                    }}>
                        Hitung gaji bersih setelah dipotong PPh 21 & BPJS, lalu bandingkan dengan Kebutuhan Hidup Layak (KHL) di daerahmu.
                    </div>

                    {/* Province */}
                    <div className="ip-input-group">
                        <label className="ip-input-label">Provinsi</label>
                        <select
                            className="ip-input"
                            value={provinceIdx}
                            onChange={(e) => handleProvinceChange(Number(e.target.value))}
                            style={{
                                cursor: 'pointer',
                                appearance: 'none',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 12px center',
                                paddingRight: '36px',
                            }}
                        >
                            {PROVINCES.map((p, i) => (
                                <option key={p.name} value={i}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* City */}
                    <div className="ip-input-group">
                        <label className="ip-input-label">Kabupaten / Kota</label>
                        <select
                            className="ip-input"
                            value={cityIdx}
                            onChange={(e) => setCityIdx(Number(e.target.value))}
                            style={{
                                cursor: 'pointer',
                                appearance: 'none',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 12px center',
                                paddingRight: '36px',
                            }}
                        >
                            {cities.map((c, i) => (
                                <option key={c.name} value={i}>
                                    {c.name} — KHL {formatRupiah(c.khl)}/bln
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status (PTKP) */}
                    <div className="ip-input-group">
                        <label className="ip-input-label">Status PTKP</label>
                        <select
                            className="ip-input"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as PTKPStatus)}
                            style={{
                                cursor: 'pointer',
                                appearance: 'none',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 12px center',
                                paddingRight: '36px',
                            }}
                        >
                            {PTKP_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                    {s} — {PTKP[s].label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Gross Salary */}
                    <div className="ip-input-group">
                        <label className="ip-input-label">Gaji Bulanan (Gross)</label>
                        <div className="ip-input-container">
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 var(--spacing-md)',
                                background: 'var(--color-bg-elevated)',
                                border: '1px solid var(--color-border)',
                                borderRight: 'none',
                                borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
                                color: 'var(--color-text-secondary)',
                                fontFamily: 'var(--font-mono)',
                                fontWeight: 600,
                            }}>Rp</span>
                            <input
                                type="text"
                                className="ip-input"
                                style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
                                value={grossSalary}
                                onChange={handleSalaryInput}
                                placeholder="10.000.000"
                                inputMode="numeric"
                            />
                        </div>
                    </div>

                    {/* Calculate */}
                    <div className="button-grid ip">
                        <button
                            className="calc-button equals"
                            onClick={handleCalculate}
                            style={{ fontSize: '1.125rem', fontWeight: '600' }}
                        >
                            Hitung Gaji Bersih
                        </button>
                    </div>

                    {/* Results */}
                    {result && (
                        <div className="ip-results" style={{ marginTop: 'var(--spacing-xl)', animation: 'slideIn 0.5s ease-out' }}>
                            {/* Net Salary Hero */}
                            <div style={{
                                textAlign: 'center',
                                padding: 'var(--spacing-xl)',
                                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.06), rgba(16, 185, 129, 0.06))',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: 'var(--spacing-lg)',
                                border: '1px solid var(--color-border)',
                            }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                                    Gaji Bersih / Bulan
                                </div>
                                <div style={{
                                    fontSize: '2.25rem',
                                    fontWeight: 700,
                                    fontFamily: 'var(--font-mono)',
                                    color: 'var(--color-primary-dark)',
                                    letterSpacing: '-0.02em',
                                }}>
                                    {formatRupiah(result.netSalary)}
                                </div>
                                <div style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--color-text-muted)',
                                    marginTop: 'var(--spacing-xs)',
                                }}>
                                    dari {formatRupiah(result.grossSalary)} bruto
                                </div>
                            </div>

                            {/* Deduction Breakdown */}
                            <h3 style={{
                                marginBottom: 'var(--spacing-md)',
                                color: 'var(--color-primary-dark)',
                                fontSize: '1.1rem',
                                fontFamily: 'var(--font-sans)',
                                borderBottom: '2px solid var(--color-border)',
                                paddingBottom: 'var(--spacing-sm)',
                            }}>
                                Rincian Potongan
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {[
                                    { label: 'PPh 21 (Pajak Penghasilan)', value: result.deductions.pph21, color: 'var(--color-error)', icon: '🏛️' },
                                    { label: 'BPJS Kesehatan (1%)', value: result.deductions.bpjsKesehatan, color: 'var(--color-warning)', icon: '🏥' },
                                    { label: 'BPJS JHT (2%)', value: result.deductions.bpjsJHT, color: 'var(--color-primary-light)', icon: '🏦' },
                                    { label: 'BPJS JP (1%)', value: result.deductions.bpjsJP, color: 'var(--color-primary)', icon: '👴' },
                                ].map((item) => (
                                    <div key={item.label} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 'var(--spacing-md)',
                                        background: 'var(--color-bg-main)',
                                        borderRadius: 'var(--radius-md)',
                                        borderLeft: `4px solid ${item.color}`,
                                    }}>
                                        <span style={{
                                            fontSize: '0.9rem',
                                            color: 'var(--color-text-primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-sm)',
                                        }}>
                                            <span>{item.icon}</span> {item.label}
                                        </span>
                                        <span style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontWeight: 600,
                                            color: item.color,
                                            fontSize: '0.95rem',
                                        }}>
                                            -{formatRupiah(item.value)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Total Deductions */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 'var(--spacing-md)',
                                padding: 'var(--spacing-md)',
                                background: 'rgba(239, 68, 68, 0.05)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px dashed var(--color-border)',
                            }}>
                                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Total Potongan</span>
                                <span style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    color: 'var(--color-error)',
                                }}>
                                    -{formatRupiah(result.deductions.totalDeductions)}
                                </span>
                            </div>

                            {/* KHL Score */}
                            <div style={{
                                marginTop: 'var(--spacing-xl)',
                                padding: 'var(--spacing-lg)',
                                background: 'var(--color-bg-main)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--color-border)',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 'var(--spacing-sm)',
                                }}>
                                    <h3 style={{
                                        margin: 0,
                                        color: 'var(--color-primary-dark)',
                                        fontSize: '1rem',
                                        fontFamily: 'var(--font-sans)',
                                    }}>
                                        Skor Kelayakan Hidup
                                    </h3>
                                    <span style={{
                                        padding: 'var(--spacing-xs) var(--spacing-md)',
                                        background: result.khlScore.color,
                                        color: '#fff',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.02em',
                                        boxShadow: `0 2px 8px ${result.khlScore.color}40`,
                                    }}>
                                        {result.khlScore.label}
                                    </span>
                                </div>

                                {scoreBar(result.khlScore.score)}

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 'var(--spacing-md)',
                                    marginTop: 'var(--spacing-lg)',
                                }}>
                                    <div style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'var(--color-bg-card)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)',
                                    }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                                            KHL {result.location.split(',')[0]}
                                        </div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '1rem' }}>
                                            {formatRupiah(result.khlScore.khl)}<span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>/bln</span>
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'var(--color-bg-card)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)',
                                    }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                                            Rasio Gaji/KHL
                                        </div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '1rem', color: result.khlScore.color }}>
                                            {result.khlScore.ratio.toFixed(2)}x
                                        </div>
                                    </div>
                                </div>

                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-sm)', lineHeight: 1.4 }}>
                                    📊 Lokasi: {result.location} • Status: {result.status}
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <div style={{
                                marginTop: 'var(--spacing-lg)',
                                padding: 'var(--spacing-md)',
                                background: 'rgba(245, 158, 11, 0.05)',
                                border: '1px solid rgba(245, 158, 11, 0.2)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.7rem',
                                color: 'var(--color-text-muted)',
                                lineHeight: 1.5,
                            }}>
                                ⚠️ <strong>Disclaimer:</strong> Kalkulator ini hanyalah estimasi berdasarkan UU HPP No. 7/2021
                                dan data KHL dari BPS Susenas 2021 dengan penyesuaian inflasi. Hasil tidak dapat dijadikan
                                acuan pembayaran resmi. Konsultasikan dengan ahli pajak untuk perhitungan yang akurat.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
