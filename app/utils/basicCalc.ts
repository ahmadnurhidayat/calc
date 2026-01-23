// Basic Calculator Logic

export type Operation = '+' | '-' | '×' | '÷' | '%' | '√' | '±' | null;

export interface CalculatorState {
  currentValue: string;
  previousValue: string;
  operation: Operation;
  shouldResetDisplay: boolean;
  memory: string;
}

export const initialState: CalculatorState = {
  currentValue: '0',
  previousValue: '',
  operation: null,
  shouldResetDisplay: false,
  memory: '0',
};

export const handleNumber = (state: CalculatorState, number: string): CalculatorState => {
  if (state.shouldResetDisplay) {
    return {
      ...state,
      currentValue: number,
      shouldResetDisplay: false,
    };
  }

  if (state.currentValue === '0' && number !== '.') {
    return {
      ...state,
      currentValue: number,
    };
  }

  if (number === '.' && state.currentValue.includes('.')) {
    return state;
  }

  return {
    ...state,
    currentValue: state.currentValue + number,
  };
};

export const handleOperation = (state: CalculatorState, operation: Operation): CalculatorState => {
  if (state.previousValue && state.operation && !state.shouldResetDisplay) {
    const result = calculate(
      parseFloat(state.previousValue),
      parseFloat(state.currentValue),
      state.operation
    );

    return {
      ...state,
      currentValue: result.toString(),
      previousValue: result.toString(),
      operation,
      shouldResetDisplay: true,
    };
  }

  return {
    ...state,
    previousValue: state.currentValue,
    operation,
    shouldResetDisplay: true,
  };
};

export const handleEquals = (state: CalculatorState): CalculatorState => {
  if (!state.previousValue || !state.operation) {
    return state;
  }

  const result = calculate(
    parseFloat(state.previousValue),
    parseFloat(state.currentValue),
    state.operation
  );

  return {
    ...state,
    currentValue: result.toString(),
    previousValue: '',
    operation: null,
    shouldResetDisplay: true,
  };
};

export const handleClear = (): CalculatorState => {
  return initialState;
};

export const handleClearEntry = (state: CalculatorState): CalculatorState => {
  return {
    ...state,
    currentValue: '0',
  };
};

export const handlePercentage = (state: CalculatorState): CalculatorState => {
  const value = parseFloat(state.currentValue);
  return {
    ...state,
    currentValue: (value / 100).toString(),
  };
};

export const handleSquareRoot = (state: CalculatorState): CalculatorState => {
  const value = parseFloat(state.currentValue);
  if (value < 0) {
    return {
      ...state,
      currentValue: 'Error',
      shouldResetDisplay: true,
    };
  }
  return {
    ...state,
    currentValue: Math.sqrt(value).toString(),
    shouldResetDisplay: true,
  };
};

export const handleToggleSign = (state: CalculatorState): CalculatorState => {
  const value = parseFloat(state.currentValue);
  return {
    ...state,
    currentValue: (-value).toString(),
  };
};

export const handleBackspace = (state: CalculatorState): CalculatorState => {
  if (state.shouldResetDisplay) {
    return state;
  }

  const newValue = state.currentValue.slice(0, -1);
  return {
    ...state,
    currentValue: newValue || '0',
  };
};

// Memory functions
export const handleMemoryAdd = (state: CalculatorState): CalculatorState => {
  const memValue = parseFloat(state.memory);
  const currentValue = parseFloat(state.currentValue);
  return {
    ...state,
    memory: (memValue + currentValue).toString(),
    shouldResetDisplay: true,
  };
};

export const handleMemorySubtract = (state: CalculatorState): CalculatorState => {
  const memValue = parseFloat(state.memory);
  const currentValue = parseFloat(state.currentValue);
  return {
    ...state,
    memory: (memValue - currentValue).toString(),
    shouldResetDisplay: true,
  };
};

export const handleMemoryRecall = (state: CalculatorState): CalculatorState => {
  return {
    ...state,
    currentValue: state.memory,
    shouldResetDisplay: true,
  };
};

export const handleMemoryClear = (state: CalculatorState): CalculatorState => {
  return {
    ...state,
    memory: '0',
  };
};

// Core calculation function
export const calculate = (a: number, b: number, operation: Operation): number => {
  switch (operation) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      return b !== 0 ? a / b : NaN;
    case '%':
      return a % b;
    default:
      return b;
  }
};

// Format display value
export const formatDisplayValue = (value: string): string => {
  if (value === 'Error' || value === 'Infinity' || value === 'NaN') {
    return 'Error';
  }

  const num = parseFloat(value);
  if (isNaN(num)) {
    return '0';
  }

  // Limit to 12 significant digits
  if (Math.abs(num) > 999999999999 || (Math.abs(num) < 0.000001 && num !== 0)) {
    return num.toExponential(6);
  }

  return value;
};
