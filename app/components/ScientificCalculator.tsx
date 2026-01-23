// Scientific Calculator Component
import { useState, useEffect } from 'react';
import Display from '~/components/Display';
import Button from '~/components/Button';
import {
    initialState,
    handleNumber,
    handleOperation,
    handleEquals,
    handleClear,
    type CalculatorState,
    type Operation,
} from '~/utils/basicCalc';
import {
    applyScientificFunction,
    type AngleMode,
    PI,
    E,
} from '~/utils/scientificCalc';
import '~/styles/calculator.css';

export default function ScientificCalculator() {
    const [state, setState] = useState<CalculatorState>(initialState);
    const [angleMode, setAngleMode] = useState<AngleMode>('deg');
    const [secondFunction, setSecondFunction] = useState(false);

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

    const onScientificFunction = (func: string) => {
        const value = parseFloat(state.currentValue);
        const result = applyScientificFunction(func as any, value, angleMode);
        setState((prev) => ({
            ...prev,
            currentValue: result.toString(),
            shouldResetDisplay: true,
        }));
    };

    const onConstant = (constant: 'π' | 'e') => {
        const value = constant === 'π' ? PI : E;
        setState((prev) => ({
            ...prev,
            currentValue: value.toString(),
            shouldResetDisplay: true,
        }));
    };

    const toggleAngleMode = () => {
        setAngleMode((prev) => (prev === 'deg' ? 'rad' : 'deg'));
    };

    const getHistory = () => {
        if (state.previousValue && state.operation) {
            return `${state.previousValue} ${state.operation}`;
        }
        return '';
    };

    return (
        <div className="calculator-wrapper">
            <div className="calculator-container glass-card-intense" style={{ maxWidth: '520px' }}>
                <div className="calculator">
                    <Display value={state.currentValue} history={getHistory()} />

                    <div className="button-grid scientific">
                        <Button
                            value={angleMode.toUpperCase()}
                            onClick={toggleAngleMode}
                            variant="function"
                        />
                        <Button value="sin" onClick={() => onScientificFunction('sin')} variant="function" />
                        <Button value="cos" onClick={() => onScientificFunction('cos')} variant="function" />
                        <Button value="tan" onClick={() => onScientificFunction('tan')} variant="function" />
                        <Button value="C" onClick={onClearClick} variant="clear" />

                        <Button value="π" onClick={() => onConstant('π')} variant="function" />
                        <Button value="log" onClick={() => onScientificFunction('log')} variant="function" />
                        <Button value="ln" onClick={() => onScientificFunction('ln')} variant="function" />
                        <Button value="x²" onClick={() => onScientificFunction('x²')} variant="function" />
                        <Button value="÷" onClick={() => onOperationClick('÷')} variant="operator" />

                        <Button value="e" onClick={() => onConstant('e')} variant="function" />
                        <Button value="7" onClick={() => onNumberClick('7')} />
                        <Button value="8" onClick={() => onNumberClick('8')} />
                        <Button value="9" onClick={() => onNumberClick('9')} />
                        <Button value="×" onClick={() => onOperationClick('×')} variant="operator" />

                        <Button value="x!" onClick={() => onScientificFunction('x!')} variant="function" />
                        <Button value="4" onClick={() => onNumberClick('4')} />
                        <Button value="5" onClick={() => onNumberClick('5')} />
                        <Button value="6" onClick={() => onNumberClick('6')} />
                        <Button value="-" onClick={() => onOperationClick('-')} variant="operator" />

                        <Button value="√" onClick={() => onScientificFunction('√')} variant="function" />
                        <Button value="1" onClick={() => onNumberClick('1')} />
                        <Button value="2" onClick={() => onNumberClick('2')} />
                        <Button value="3" onClick={() => onNumberClick('3')} />
                        <Button value="+" onClick={() => onOperationClick('+')} variant="operator" />

                        <Button value="1/x" onClick={() => onScientificFunction('1/x')} variant="function" />
                        <Button value="0" onClick={() => onNumberClick('0')} span={2} />
                        <Button value="." onClick={() => onNumberClick('.')} />
                        <Button value="=" onClick={onEqualsClick} variant="equals" />
                    </div>
                </div>
            </div>
        </div>
    );
}
