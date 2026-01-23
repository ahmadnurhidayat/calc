// Financial Calculator Component
import { useState } from 'react';
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

    return (
        <div className="calculator-wrapper">
            <div className="calculator-container glass-card-intense" style={{ maxWidth: '600px' }}>
                <div className="calculator">
                    <h2 style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '1.5rem',
                        marginBottom: 'var(--spacing-lg)',
                        color: 'var(--color-primary-dark)'
                    }}>
                        Financial Budget Planner
                    </h2>

                    <div className="ip-input-group">
                        <label className="ip-input-label">Currency</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-sm)' }}>
                            {(Object.keys(currencies) as Currency[]).map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCurrency(c)}
                                    className={`calc-button ${currency === c ? 'operator' : ''}`}
                                    style={{ minHeight: '40px', fontSize: '0.9rem', padding: 'var(--spacing-sm)' }}
                                >
                                    {c} ({currencies[c].symbol})
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="ip-input-group">
                        <label className="ip-input-label">Total {period} Salary</label>
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
                                fontFamily: 'var(--font-mono)'
                            }}>{currencies[currency].symbol}</span>
                            <input
                                type="number"
                                className="ip-input"
                                style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
                                value={salary}
                                onChange={handleSalaryChange}
                                placeholder="5000"
                            />
                        </div>
                    </div>

                    <div className="ip-input-group">
                        <label className="ip-input-label">Period</label>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            {(['Monthly', 'Annual'] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`calc-button ${period === p ? 'operator' : ''}`}
                                    style={{ flex: 1, minHeight: '40px', fontSize: '0.9rem' }}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="ip-input-group">
                        <label className="ip-input-label">Budget Model</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                            {(Object.keys(models) as FinancialModel[]).filter(m => m !== 'Custom').map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setModel(m)}
                                    className={`calc-button ${model === m ? 'operator' : ''}`}
                                    style={{
                                        minHeight: 'auto',
                                        padding: 'var(--spacing-md)',
                                        textAlign: 'left',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <span style={{ fontWeight: 600 }}>{models[m].name}</span>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        color: model === m ? 'var(--color-primary-dark)' : 'var(--color-text-secondary)',
                                        opacity: 0.8,
                                        fontWeight: 400,
                                        marginTop: '4px'
                                    }}>{models[m].description}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="button-grid ip">
                        <button
                            className="calc-button equals"
                            onClick={handleCalculate}
                            style={{ fontSize: '1.125rem', fontWeight: '600' }}
                        >
                            Calculate Budget
                        </button>
                    </div>

                    {result && (
                        <div className="ip-results" style={{ marginTop: 'var(--spacing-xl)', animation: 'slideIn 0.5s ease-out' }}>
                            <h3 style={{
                                marginBottom: 'var(--spacing-lg)',
                                color: 'var(--color-primary-dark)',
                                fontSize: '1.25rem',
                                fontFamily: 'var(--font-sans)',
                                borderBottom: '2px solid var(--color-border)',
                                paddingBottom: 'var(--spacing-sm)'
                            }}>
                                Allocation Breakdown
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                {result.allocations.map((alloc) => (
                                    <div key={alloc.category} style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'var(--color-bg-main)',
                                        borderRadius: 'var(--radius-md)',
                                        borderLeft: `4px solid ${alloc.color}`
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{alloc.category}</span>
                                            <span style={{ fontWeight: 700, color: alloc.color }}>{alloc.percentage}%</span>
                                        </div>
                                        <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                                            {formatCurrency(alloc.amount, currency)}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                            {alloc.description}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                marginTop: 'var(--spacing-lg)',
                                paddingTop: 'var(--spacing-md)',
                                borderTop: '1px solid var(--color-border)',
                                textAlign: 'right'
                            }}>
                                <span style={{ color: 'var(--color-text-secondary)', marginRight: 'var(--spacing-sm)' }}>Total:</span>
                                <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>{formatCurrency(result.totalSalary, currency)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
