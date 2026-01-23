// IP Calculator Component
import { useState } from 'react';
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

    return (
        <div className="calculator-wrapper">
            <div className="calculator-container glass-card-intense" style={{ maxWidth: '600px' }}>
                <div className="calculator">
                    <div className="ip-input-group">
                        <label className="ip-input-label">IP Address / CIDR</label>
                        <div className="ip-input-container">
                            <input
                                type="text"
                                className="ip-input"
                                value={ipAddress}
                                onChange={(e) => setIPAddress(e.target.value)}
                                placeholder="192.168.1.0"
                            />
                            <span style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: '1.5rem',
                                fontFamily: 'var(--font-mono)'
                            }}>/</span>
                            <input
                                type="number"
                                className="ip-input"
                                value={cidr}
                                onChange={(e) => setCidr(e.target.value)}
                                placeholder="24"
                                min="0"
                                max="32"
                                style={{ maxWidth: '100px' }}
                            />
                        </div>
                    </div>

                    <div className="button-grid ip">
                        <button
                            className="calc-button operator"
                            onClick={handleCalculate}
                            style={{ fontSize: '1.125rem', fontWeight: '600' }}
                        >
                            Calculate
                        </button>
                        <button
                            className="calc-button function"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                    </div>

                    {error && (
                        <div style={{
                            marginTop: 'var(--spacing-lg)',
                            padding: 'var(--spacing-md)',
                            background: 'rgba(239, 68, 68, 0.2)',
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
                        <div className="ip-results">
                            <h3 style={{
                                marginBottom: 'var(--spacing-md)',
                                color: 'var(--color-primary-light)',
                                fontSize: '1.125rem',
                                fontFamily: 'var(--font-mono)',
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

                            <div className="ip-result-row">
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
