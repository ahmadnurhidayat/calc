// Button Component
import type { ReactNode } from 'react';

export type ButtonVariant = 'number' | 'operator' | 'function' | 'clear' | 'equals';

interface ButtonProps {
    value: string | ReactNode;
    onClick: () => void;
    variant?: ButtonVariant;
    span?: number;
    disabled?: boolean;
}

export default function Button({
    value,
    onClick,
    variant = 'number',
    span,
    disabled = false
}: ButtonProps) {
    const spanClass = span ? `span-${span}` : '';

    return (
        <button
            className={`calc-button ${variant} ${spanClass}`}
            onClick={onClick}
            disabled={disabled}
            type="button"
        >
            {value}
        </button>
    );
}
