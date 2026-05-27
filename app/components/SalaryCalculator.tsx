// Salary Calculator Component
import { useState, useMemo, useEffect } from 'react';
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

    const handleReset = () => {
        setGrossSalary('');
        setStatus('TK/0');
        setProvinceIdx(0);
        setCityIdx(0);
        setResult(null);
    };

    // Reset listener from global dual-nav
    useEffect(() => {
        const handleResetEvent = () => {
            handleReset();
        };
        window.addEventListener('calc-reset', handleResetEvent);
        return () => window.removeEventListener('calc-reset', handleResetEvent);
    }, []);

    // Jakarta cost scoring bar via clean capsule items
    const scoreBar = (score: number) => {
        return (
            <div className="hl-capsule-bar">
                {[1, 2, 3, 4, 5].map((s) => {
                    let activeClass = '';
                    if (s <= score) {
                        if (score >= 4) activeClass = 'active-high';
                        else if (score >= 3) activeClass = 'active-mid';
                        else activeClass = 'active-low';
                    }
                    return (
                        <div
                            key={s}
                            className={`hl-capsule-indicator ${activeClass}`}
                        />
                    );
                })}
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
                        alignItems: 'center',
                        marginBottom: 'var(--spacing-lg)',
                    }}>
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            letterSpacing: '-0.28px',
                            margin: 0,
                        }}>
                            Salary Calculator
                        </h2>
                        <span style={{
                            padding: '4px 10px',
                            background: 'var(--color-bg-elevated)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--color-text-secondary)',
                        }}>
                            🇮🇩 PPh 21 & BPJS
                        </span>
                    </div>

                    {/* Editorial intro box */}
                    <div style={{
                        background: 'rgba(0, 102, 204, 0.05)',
                        border: '1px solid rgba(0, 102, 204, 0.1)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--spacing-md)',
                        marginBottom: 'var(--spacing-lg)',
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.5,
                    }}>
                        Hitung gaji bersih setelah dipotong PPh 21 & BPJS, lalu bandingkan dengan Kebutuhan Hidup Layak (KHL) di daerahmu.
                    </div>

                    {/* Province Selector */}
                    <div className="ip-input-group">
                        <label className="ip-input-label">Provinsi</label>
                        <select
                            className="premium-select-pill"
                            value={provinceIdx}
                            onChange={(e) => handleProvinceChange(Number(e.target.value))}
                        >
                            {PROVINCES.map((p, i) => (
                                <option key={p.name} value={i}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* City Selector */}
                    <div className="ip-input-group">
                        <label className="ip-input-label">Kabupaten / Kota</label>
                        <select
                            className="premium-select-pill"
                            value={cityIdx}
                            onChange={(e) => setCityIdx(Number(e.target.value))}
                        >
                            {cities.map((c, i) => (
                                <option key={c.name} value={i}>
                                    {c.name} — KHL {formatRupiah(c.khl)}/bln
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Select */}
                    <div className="ip-input-group">
                        <label className="ip-input-label">Status PTKP</label>
                        <select
                            className="premium-select-pill"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as PTKPStatus)}
                        >
                            {PTKP_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                    {s} — {PTKP[s].label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Gross Salary Input */}
                    <div className="ip-input-group">
                        <label className="ip-input-label">Gaji Bulanan (Gross)</label>
                        <div className="premium-pill-input-container">
                            <span className="premium-pill-input-prefix">Rp</span>
                            <input
                                type="text"
                                className="premium-pill-input"
                                value={grossSalary}
                                onChange={handleSalaryInput}
                                placeholder="10.000.000"
                                inputMode="numeric"
                            />
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="button-grid ip" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 'var(--spacing-lg)' }}>
                        <button
                            className="sub-nav-cta"
                            onClick={handleCalculate}
                            style={{ padding: '12px 24px', fontSize: '1rem' }}
                        >
                            Hitung Gaji Bersih
                        </button>
                        <button
                            className="calc-button function"
                            onClick={handleReset}
                            style={{
                                minHeight: 'auto',
                                height: '44px',
                                borderRadius: 'var(--radius-pill)',
                                border: '1px solid var(--color-border)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            Reset
                        </button>
                    </div>

                    {/* Calculation Output */}
                    {result && (
                        <div className="store-utility-card" style={{ marginTop: 'var(--spacing-xl)', animation: 'slideIn 0.5s ease-out' }}>
                            {/* Net Salary Hero banner */}
                            <div style={{
                                textAlign: 'center',
                                padding: 'var(--spacing-xl) var(--spacing-lg)',
                                background: 'var(--color-bg-main)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: 'var(--spacing-lg)',
                            }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                                    Gaji Bersih / Bulan
                                </div>
                                <div style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 600,
                                    fontFamily: 'var(--font-mono)',
                                    color: 'var(--color-primary)',
                                    letterSpacing: '-1px',
                                }}>
                                    {formatRupiah(result.netSalary)}
                                </div>
                                <div style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--color-text-secondary)',
                                    marginTop: '6px',
                                }}>
                                    dari {formatRupiah(result.grossSalary)} bruto
                                </div>
                            </div>

                            {/* Deductions Breakdown */}
                            <h3 style={{
                                marginBottom: 'var(--spacing-md)',
                                color: 'var(--color-text-primary)',
                                fontSize: '1.1rem',
                                fontFamily: 'var(--font-display)',
                                fontWeight: 600,
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
                                    <div
                                        key={item.label}
                                        className="premium-row-item"
                                        style={{
                                            ['--accent-color' as any]: item.color,
                                        }}
                                    >
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

                            {/* Total Deductions row */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 'var(--spacing-md)',
                                padding: 'var(--spacing-md)',
                                background: 'rgba(239, 68, 68, 0.04)',
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

                            {/* KHL Kelayakan Score capsule layout */}
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
                                        color: 'var(--color-text-primary)',
                                        fontSize: '1rem',
                                        fontFamily: 'var(--font-display)',
                                        fontWeight: 600,
                                    }}>
                                        Skor Kelayakan Hidup
                                    </h3>
                                    <span style={{
                                        padding: '4px 12px',
                                        background: result.khlScore.color,
                                        color: '#ffffff',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.02em',
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
                                        background: 'var(--color-bg-surface)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)',
                                    }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                                            KHL {result.location.split(',')[0]}
                                        </div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.95rem' }}>
                                            {formatRupiah(result.khlScore.khl)}<span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', fontWeight: 400 }}>/bln</span>
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'var(--color-bg-surface)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)',
                                    }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                                            Rasio Gaji/KHL
                                        </div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.95rem', color: result.khlScore.color }}>
                                            {result.khlScore.ratio.toFixed(2)}x
                                        </div>
                                    </div>
                                </div>

                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)', lineHeight: 1.4, textAlign: 'center' }}>
                                    📍 Lokasi: {result.location} • Status PTKP: {result.status}
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <div style={{
                                marginTop: 'var(--spacing-lg)',
                                padding: 'var(--spacing-md)',
                                background: 'var(--color-bg-main)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.75rem',
                                color: 'var(--color-text-secondary)',
                                lineHeight: 1.5,
                            }}>
                                ⚠️ <strong>Disclaimer:</strong> Kalkulator ini hanyalah estimasi berdasarkan UU HPP No. 7/2021
                                dan data KHL Susenas BPS dengan penyesuaian inflasi. Hasil tidak dapat dijadikan
                                acuan pembayaran resmi. Konsultasikan dengan ahli pajak untuk perhitungan resmi.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
