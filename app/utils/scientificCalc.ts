// Scientific Calculator Logic

export type ScientificOperation =
    | 'sin' | 'cos' | 'tan'
    | 'asin' | 'acos' | 'atan'
    | 'log' | 'ln' | 'exp'
    | 'x²' | 'x³' | 'xʸ'
    | '1/x' | 'x!'
    | 'π' | 'e';

export type AngleMode = 'deg' | 'rad';

export interface ScientificState {
    angleMode: AngleMode;
}

export const initialScientificState: ScientificState = {
    angleMode: 'deg',
};

// Constants
export const PI = Math.PI;
export const E = Math.E;

// Angle conversion
const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
};

const toDegrees = (radians: number): number => {
    return radians * (180 / Math.PI);
};

// Trigonometric functions
export const sin = (value: number, angleMode: AngleMode): number => {
    const angle = angleMode === 'deg' ? toRadians(value) : value;
    return Math.sin(angle);
};

export const cos = (value: number, angleMode: AngleMode): number => {
    const angle = angleMode === 'deg' ? toRadians(value) : value;
    return Math.cos(angle);
};

export const tan = (value: number, angleMode: AngleMode): number => {
    const angle = angleMode === 'deg' ? toRadians(value) : value;
    return Math.tan(angle);
};

export const asin = (value: number, angleMode: AngleMode): number => {
    if (value < -1 || value > 1) return NaN;
    const result = Math.asin(value);
    return angleMode === 'deg' ? toDegrees(result) : result;
};

export const acos = (value: number, angleMode: AngleMode): number => {
    if (value < -1 || value > 1) return NaN;
    const result = Math.acos(value);
    return angleMode === 'deg' ? toDegrees(result) : result;
};

export const atan = (value: number, angleMode: AngleMode): number => {
    const result = Math.atan(value);
    return angleMode === 'deg' ? toDegrees(result) : result;
};

// Logarithmic functions
export const log = (value: number): number => {
    if (value <= 0) return NaN;
    return Math.log10(value);
};

export const ln = (value: number): number => {
    if (value <= 0) return NaN;
    return Math.log(value);
};

export const exp = (value: number): number => {
    return Math.exp(value);
};

// Power functions
export const square = (value: number): number => {
    return value * value;
};

export const cube = (value: number): number => {
    return value * value * value;
};

export const power = (base: number, exponent: number): number => {
    return Math.pow(base, exponent);
};

export const reciprocal = (value: number): number => {
    if (value === 0) return NaN;
    return 1 / value;
};

// Factorial function
export const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity; // Overflow protection

    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
};

// Apply scientific function
export const applyScientificFunction = (
    operation: ScientificOperation,
    value: number,
    angleMode: AngleMode,
    secondValue?: number
): number => {
    switch (operation) {
        case 'sin':
            return sin(value, angleMode);
        case 'cos':
            return cos(value, angleMode);
        case 'tan':
            return tan(value, angleMode);
        case 'asin':
            return asin(value, angleMode);
        case 'acos':
            return acos(value, angleMode);
        case 'atan':
            return atan(value, angleMode);
        case 'log':
            return log(value);
        case 'ln':
            return ln(value);
        case 'exp':
            return exp(value);
        case 'x²':
            return square(value);
        case 'x³':
            return cube(value);
        case 'xʸ':
            return secondValue !== undefined ? power(value, secondValue) : value;
        case '1/x':
            return reciprocal(value);
        case 'x!':
            return factorial(value);
        case 'π':
            return PI;
        case 'e':
            return E;
        default:
            return value;
    }
};
