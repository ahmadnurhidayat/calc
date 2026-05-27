// IP Calculator Component
import { useState, useEffect } from 'react';
import { calculateIPInfo, type IPCalculation } from '~/utils/ipCalc';
import '~/styles/calculator.css';

export default function IPCalculator() {
    const [ipAddress, setIPAddress] = useState('192.168.1.0');
    const [cidr, setCidr] = useState('24');
    const [result, setResult] = useState<IPCalculation | null>(null);
    const [error, setError] = useState('');

    const handleCalculate = () => {
        const cidrNum = parseInt(cidr, 10);
        const calculation = calculateIPInfo(ipAddress, cidrNum);

        if (calculation) {
            setResult(calculation);
            setError('');
        } else {
            setResult(null);
            setError('Invalid IP address or CIDR notation');
        }
    };

    const handleReset = () => {
        setIPAddress('192.168.1.0');
        setCidr('24');
        setResult(null);
        setError('');
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
            <div className="calculator-container glass-card-intense" style={{ maxWidth: '600px' }}>
                <div className="calculator">
                    <div className="ip-input-group">
                        <label className="ip-input-label">IP Address / CIDR</label>
                        <div className="premium-pill-input-container">
                            <input
                                type="text"
                                className="premium-pill-input"
                                value={ipAddress}
                                onChange={(e) => setIPAddress(e.target.value)}
                                placeholder="192.168.1.0"
                            />
                            <span style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: '1.5rem',
                                fontFamily: 'var(--font-mono)',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 8px'
                            }}>/</span>
                            <input
                                type="number"
                                className="premium-pill-input"
                                value={cidr}
                                onChange={(e) => setCidr(e.target.value)}
                                placeholder="24"
                                min="0"
                                max="32"
                                style={{ maxWidth: '80px', textAlign: 'center' }}
                            />
                        </div>
                    </div>

                    <div className="button-grid ip" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <button
                            className="sub-nav-cta"
                            onClick={handleCalculate}
                            style={{ padding: '12px 24px', fontSize: '1rem' }}
                        >
                            Calculate
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

                    {error && (
                        <div style={{
                            marginTop: 'var(--spacing-lg)',
                            padding: 'var(--spacing-md)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid var(--color-error)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-error)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.875rem',
                        }}>
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="store-utility-card" style={{ marginTop: 'var(--spacing-xl)', animation: 'slideIn 0.5s ease-out' }}>
                            <h3 style={{
                                marginBottom: 'var(--spacing-lg)',
                                color: 'var(--color-primary)',
                                fontSize: '1.125rem',
                                fontFamily: 'var(--font-display)',
                                fontWeight: 600,
                            }}>
                                Subnet Information
                            </h3>

                            <div className="ip-result-row">
                                <span className="ip-result-label">IP Address:</span>
                                <span className="ip-result-value">{result.ipAddress}/{result.cidr}</span>
                            </div>

                            <div className="ip-result-row">
                                <span className="ip-result-label">Network Address:</span>
                                <span className="ip-result-value">{result.networkAddress}</span>
                            </div>

                            <div className="ip-result-row">
                                <span className="ip-result-label">Broadcast Address:</span>
                                <span className="ip-result-value">{result.broadcastAddress}</span>
                            </div>

                            <div className="ip-result-row">
                                <span className="ip-result-label">Subnet Mask:</span>
                                <span className="ip-result-value">{result.subnetMask}</span>
                            </div>

                            <div className="ip-result-row">
                                <span className="ip-result-label">Wildcard Mask:</span>
                                <span className="ip-result-value">{result.wildcardMask}</span>
                            </div>

                            <div className="ip-result-row">
                                <span className="ip-result-label">First Usable IP:</span>
                                <span className="ip-result-value">{result.firstUsableIP}</span>
                            </div>

                            <div className="ip-result-row">
                                <span className="ip-result-label">Last Usable IP:</span>
                                <span className="ip-result-value">{result.lastUsableIP}</span>
                            </div>

                            <div className="ip-result-row">
                                <span className="ip-result-label">Total Hosts:</span>
                                <span className="ip-result-value">{result.totalHosts.toLocaleString()}</span>
                            </div>

                            <div className="ip-result-row">
                                <span className="ip-result-label">Usable Hosts:</span>
                                <span className="ip-result-value">{result.usableHosts.toLocaleString()}</span>
                            </div>

                            <div className="ip-result-row">
                                <span className="ip-result-label">IP Class:</span>
                                <span className="ip-result-value">{result.ipClass}</span>
                            </div>

                            <div className="ip-result-row">
                                <span className="ip-result-label">IP Type:</span>
                                <span className="ip-result-value">{result.ipType}</span>
                            </div>

                            <div className="ip-result-row" style={{ borderBottom: 'none' }}>
                                <span className="ip-result-label">Binary:</span>
                                <span className="ip-result-value" style={{ fontSize: '0.75rem' }}>{result.binary}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
