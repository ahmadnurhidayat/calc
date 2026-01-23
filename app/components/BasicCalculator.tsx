// Basic Calculator Component
import { useState, useEffect } from 'react';
import Display from '~/components/Display';
import Button from '~/components/Button';
import {
    initialState,
    handleNumber,
    handleOperation,
    handleEquals,
    handleClear,
    handleClearEntry,
    handlePercentage,
    handleSquareRoot,
    handleToggleSign,
    handleBackspace,
    type CalculatorState,
    type Operation,
} from '~/utils/basicCalc';
import '~/styles/calculator.css';

export default function BasicCalculator() {
    const [state, setState] = useState<CalculatorState>(initialState);

    // Keyboard support
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            e.preventDefault();

            if (e.key >= '0' && e.key <= '9') {
                setState((prev) => handleNumber(prev, e.key));
            } else if (e.key === '.') {
                setState((prev) => handleNumber(prev, '.'));
            } else if (e.key === '+') {
                setState((prev) => handleOperation(prev, '+'));
            } else if (e.key === '-') {
                setState((prev) => handleOperation(prev, '-'));
            } else if (e.key === '*') {
                setState((prev) => handleOperation(prev, '×'));
            } else if (e.key === '/') {
                setState((prev) => handleOperation(prev, '÷'));
            } else if (e.key === '%') {
                setState(handlePercentage);
            } else if (e.key === 'Enter' || e.key === '=') {
                setState(handleEquals);
            } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
                setState(handleClear());
            } else if (e.key === 'Backspace') {
                setState(handleBackspace);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    const onNumberClick = (num: string) => {
        setState((prev) => handleNumber(prev, num));
    };

    const onOperationClick = (op: Operation) => {
        setState((prev) => handleOperation(prev, op));
    };

    const onEqualsClick = () => {
        setState(handleEquals);
    };

    const onClearClick = () => {
        setState(handleClear());
    };

    const onClearEntryClick = () => {
        setState(handleClearEntry);
    };

    const onPercentageClick = () => {
        setState(handlePercentage);
    };

    const onSquareRootClick = () => {
        setState(handleSquareRoot);
    };

    const onToggleSignClick = () => {
        setState(handleToggleSign);
    };

    const getHistory = () => {
        if (state.previousValue && state.operation) {
            return `${state.previousValue} ${state.operation}`;
        }
        return '';
    };

    return (
        <div className="calculator-wrapper">
            <div className="calculator-container glass-card-intense">
                <div className="calculator">
                    <Display value={state.currentValue} history={getHistory()} />

                    <div className="button-grid basic">
                        <Button value="C" onClick={onClearClick} variant="clear" />
                        <Button value="CE" onClick={onClearEntryClick} variant="function" />
                        <Button value="%" onClick={onPercentageClick} variant="function" />
                        <Button value="÷" onClick={() => onOperationClick('÷')} variant="operator" />

                        <Button value="7" onClick={() => onNumberClick('7')} />
                        <Button value="8" onClick={() => onNumberClick('8')} />
                        <Button value="9" onClick={() => onNumberClick('9')} />
                        <Button value="×" onClick={() => onOperationClick('×')} variant="operator" />

                        <Button value="4" onClick={() => onNumberClick('4')} />
                        <Button value="5" onClick={() => onNumberClick('5')} />
                        <Button value="6" onClick={() => onNumberClick('6')} />
                        <Button value="-" onClick={() => onOperationClick('-')} variant="operator" />

                        <Button value="1" onClick={() => onNumberClick('1')} />
                        <Button value="2" onClick={() => onNumberClick('2')} />
                        <Button value="3" onClick={() => onNumberClick('3')} />
                        <Button value="+" onClick={() => onOperationClick('+')} variant="operator" />

                        <Button value="±" onClick={onToggleSignClick} variant="function" />
                        <Button value="0" onClick={() => onNumberClick('0')} />
                        <Button value="." onClick={() => onNumberClick('.')} />
                        <Button value="=" onClick={onEqualsClick} variant="equals" />
                    </div>
                </div>
            </div>
        </div>
    );
}
