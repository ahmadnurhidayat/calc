// Financial Calculator Component
import { useState, useEffect } from 'react';
import {
    calculateBudget,
    models,
    formatCurrency,
    currencies,
    type FinancialModel,
    type FinancialResult,
    type Currency
} from '~/utils/financialCalc';
import '~/styles/calculator.css';

export default function FinancialCalculator() {
    const [salary, setSalary] = useState<string>('');
    const [model, setModel] = useState<FinancialModel>('50/30/20');
    const [period, setPeriod] = useState<'Monthly' | 'Annual'>('Monthly');
    const [currency, setCurrency] = useState<Currency>('USD');
    const [result, setResult] = useState<FinancialResult | null>(null);

    const handleCalculate = () => {
        const salaryNum = parseFloat(salary.replace(/,/g, ''));
        if (!isNaN(salaryNum) && salaryNum > 0) {
            setResult(calculateBudget(salaryNum, model, period));
        } else {
            setResult(null);
        }
    };

    const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSalary(e.target.value);
    };

    const handleReset = () => {
        setSalary('');
        setModel('50/30/20');
        setPeriod('Monthly');
        setCurrency('USD');
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

    return (
        <div className="calculator-wrapper">
            <div className="calculator-container glass-card-intense" style={{ maxWidth: '660px' }}>
                <div className="calculator">
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            letterSpacing: '-0.28px',
                            margin: 0
                        }}>
                            Budget Planner
                        </h2>

                        {models[model].sourceUrl && (
                            <a
                                href={models[model].sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Learn more about this rule"
                                className="sub-nav-cta"
                                style={{
                                    textDecoration: 'none',
                                    fontSize: '11px',
                                    padding: '4px 10px',
                                    background: 'var(--color-bg-elevated)',
                                    color: 'var(--color-primary)',
                                    border: '1px solid var(--color-border)'
                                }}
                            >
                                Learn More ↗
                            </a>
                        )}
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
                        lineHeight: 1.5
                    }}>
                        <strong>{models[model].name}:</strong> {models[model].info}
                    </div>

                    {/* Currency Option Chips */}
                    <div className="ip-input-group">
                        <label className="ip-input-label">Currency</label>
                        <div className="configurator-grid-chips">
                            {(Object.keys(currencies) as Currency[]).map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setCurrency(c)}
                                    className={`configurator-option-chip ${currency === c ? 'selected' : ''}`}
                                >
                                    {c} ({currencies[c].symbol})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Salary Input */}
                    <div className="ip-input-group">
                        <label className="ip-input-label">Total {period} Salary</label>
                        <div className="premium-pill-input-container">
                            <span className="premium-pill-input-prefix">
                                {currencies[currency].symbol}
                            </span>
                            <input
                                type="number"
                                className="premium-pill-input"
                                value={salary}
                                onChange={handleSalaryChange}
                                placeholder="5,000"
                            />
                        </div>
                    </div>

                    {/* Period Option Chips */}
                    <div className="ip-input-group">
                        <label className="ip-input-label">Period</label>
                        <div className="configurator-grid-chips" style={{ gridTemplateColumns: '1fr 1fr' }}>
                            {(['Monthly', 'Annual'] as const).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPeriod(p)}
                                    className={`configurator-option-chip ${period === p ? 'selected' : ''}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Budget Model Option Cards (MacBuy Spec style) */}
                    <div className="ip-input-group">
                        <label className="ip-input-label">Select Budget Allocation Model</label>
                        <div className="configurator-grid-cards">
                            {(Object.keys(models) as FinancialModel[]).filter(m => m !== 'Custom').map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setModel(m)}
                                    className={`configurator-option-card ${model === m ? 'selected' : ''}`}
                                >
                                    <span className="configurator-option-card-title">{models[m].name}</span>
                                    <span className="configurator-option-card-desc">{models[m].description}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Calculate & Reset CTAs */}
                    <div className="button-grid ip" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 'var(--spacing-lg)' }}>
                        <button
                            className="sub-nav-cta"
                            onClick={handleCalculate}
                            style={{ padding: '12px 24px', fontSize: '1rem' }}
                        >
                            Calculate Budget
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
                            Reset Fields
                        </button>
                    </div>

                    {/* Results displayed in clean cards */}
                    {result && (
                        <div className="store-utility-card" style={{ marginTop: 'var(--spacing-xl)', animation: 'slideIn 0.5s ease-out' }}>
                            <h3 style={{
                                marginBottom: 'var(--spacing-lg)',
                                color: 'var(--color-primary)',
                                fontSize: '1.25rem',
                                fontFamily: 'var(--font-display)',
                                fontWeight: 600,
                                borderBottom: '2px solid var(--color-border)',
                                paddingBottom: 'var(--spacing-sm)'
                            }}>
                                Allocation Breakdown
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-md)' }}>
                                {result.allocations.map((alloc) => (
                                    <div
                                        key={alloc.category}
                                        className="premium-row-item"
                                        style={{
                                            ['--accent-color' as any]: alloc.color,
                                            flexDirection: 'column',
                                            alignItems: 'stretch',
                                            gap: '6px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                                            <span style={{ color: 'var(--color-text-primary)' }}>{alloc.category}</span>
                                            <span style={{ color: alloc.color }}>{alloc.percentage}%</span>
                                        </div>
                                        <div style={{
                                            fontSize: '1.75rem',
                                            fontFamily: 'var(--font-mono)',
                                            fontWeight: 600,
                                            color: 'var(--color-text-primary)',
                                            letterSpacing: '-0.5px'
                                        }}>
                                            {formatCurrency(alloc.amount, currency)}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                                            {alloc.description}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                marginTop: 'var(--spacing-lg)',
                                paddingTop: 'var(--spacing-md)',
                                borderTop: '1px solid var(--color-border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Total Calculated Salary:</span>
                                <span style={{ fontWeight: 700, fontSize: '1.35rem', fontFamily: 'var(--font-mono)' }}>
                                    {formatCurrency(result.totalSalary, currency)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
