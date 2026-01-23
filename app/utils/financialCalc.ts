// Financial Calculator Logic

export type FinancialModel = '50/30/20' | '70/20/10' | '80/20' | 'Custom';
export type Currency = 'USD' | 'SGD' | 'IDR' | 'EUR' | 'GBP' | 'JPY';

export interface BudgetAllocation {
    category: string;
    percentage: number;
    amount: number;
    description: string;
    color: string;
}

export interface FinancialResult {
    allocations: BudgetAllocation[];
    totalSalary: number;
    period: 'Monthly' | 'Annual';
}

export const models: Record<FinancialModel, { name: string; description: string }> = {
    '50/30/20': {
        name: '50/30/20 Rule',
        description: 'Needs (50%), Wants (30%), Savings (20%)',
    },
    '70/20/10': {
        name: '70/20/10 Rule',
        description: 'Living Expenses (70%), Savings (20%), Debt/Donation (10%)',
    },
    '80/20': {
        name: '80/20 Rule',
        description: 'Living Expenses (80%), Savings (20%)',
    },
    'Custom': {
        name: 'Custom Allocation',
        description: 'Define your own percentages',
    },
};

export const currencies: Record<Currency, { symbol: string; locale: string; name: string }> = {
    'USD': { symbol: '$', locale: 'en-US', name: 'US Dollar' },
    'SGD': { symbol: 'S$', locale: 'en-SG', name: 'Singapore Dollar' },
    'IDR': { symbol: 'Rp', locale: 'id-ID', name: 'Indonesian Rupiah' },
    'EUR': { symbol: '€', locale: 'de-DE', name: 'Euro' },
    'GBP': { symbol: '£', locale: 'en-GB', name: 'British Pound' },
    'JPY': { symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen' },
};

export const calculateBudget = (
    salary: number,
    model: FinancialModel,
    period: 'Monthly' | 'Annual' = 'Monthly'
): FinancialResult => {
    let allocations: BudgetAllocation[] = [];

    switch (model) {
        case '50/30/20':
            allocations = [
                {
                    category: 'Needs',
                    percentage: 50,
                    amount: salary * 0.5,
                    description: 'Essential expenses like rent, groceries, utilities.',
                    color: 'var(--color-primary)',
                },
                {
                    category: 'Wants',
                    percentage: 30,
                    amount: salary * 0.3,
                    description: 'Non-essential spending like dining out, entertainment.',
                    color: 'var(--color-primary-light)',
                },
                {
                    category: 'Savings',
                    percentage: 20,
                    amount: salary * 0.2,
                    description: 'Investments, emergency fund, debt repayment.',
                    color: 'var(--color-success)',
                },
            ];
            break;
        case '70/20/10':
            allocations = [
                {
                    category: 'Living Expenses',
                    percentage: 70,
                    amount: salary * 0.7,
                    description: 'All daily living costs including rent and food.',
                    color: 'var(--color-primary)',
                },
                {
                    category: 'Savings & Investments',
                    percentage: 20,
                    amount: salary * 0.2,
                    description: 'Long-term savings and retirement.',
                    color: 'var(--color-success)',
                },
                {
                    category: 'Debt / Donation',
                    percentage: 10,
                    amount: salary * 0.1,
                    description: 'Credit card debt or charitable giving.',
                    color: 'var(--color-warning)',
                },
            ];
            break;
        case '80/20':
            allocations = [
                {
                    category: 'Living Expenses',
                    percentage: 80,
                    amount: salary * 0.8,
                    description: 'Everything you spend money on.',
                    color: 'var(--color-primary)',
                },
                {
                    category: 'Savings',
                    percentage: 20,
                    amount: salary * 0.2,
                    description: 'Pay yourself first.',
                    color: 'var(--color-success)',
                },
            ];
            break;
        default:
            allocations = [];
    }

    return {
        allocations,
        totalSalary: salary,
        period,
    };
};

export const formatCurrency = (amount: number, currency: Currency = 'USD'): string => {
    return new Intl.NumberFormat(currencies[currency].locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};
