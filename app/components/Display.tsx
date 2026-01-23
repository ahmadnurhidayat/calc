// Display Component
import { formatDisplayValue } from '~/utils/basicCalc';

interface DisplayProps {
    value: string;
    history?: string;
}

export default function Display({ value, history }: DisplayProps) {
    const displayValue = formatDisplayValue(value);
    const isError = displayValue === 'Error';

    return (
        <div className="calculator-display">
            {history && (
                <div className="display-history">{history}</div>
            )}
            <div className={`display-value ${isError ? 'error' : ''}`}>
                {displayValue}
            </div>
        </div>
    );
}
