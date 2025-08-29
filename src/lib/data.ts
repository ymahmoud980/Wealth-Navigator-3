import type { Asset, Liability, UpcomingPayment, UpcomingRent, CashFlowItem } from './types';

// Exchange Rates to USD for internal calculations
const EGP_TO_USD = 1 / 47.5;
const KWD_TO_USD = 1 / 0.31;
const TRY_TO_USD = 1 / 32.8; // Approx.

export const assets: Asset[] = [
  // Egypt Assets (Values in EGP)
  { id: 'EGY-A1', name: 'Gardenia Bldg - G-Floor', location: 'Egypt', type: 'Apartment', rentalIncome: 8500, marketValue: 5000000, currency: 'EGP' },
  { id: 'EGY-A2', name: 'Gardenia Bldg - 1st Floor', location: 'Egypt', type: 'Apartment', rentalIncome: 0, marketValue: 5000000, currency: 'EGP' },
  { id: 'EGY-A3', name: 'Gardenia Bldg - 2nd Floor', location: 'Egypt', type: 'Apartment', rentalIncome: 11000, marketValue: 5000000, currency: 'EGP' },
  { id: 'EGY-A4', name: 'Gardenia Bldg - 3rd Floor', location: 'Egypt', type: 'Apartment', rentalIncome: 10000, marketValue: 5000000, currency: 'EGP' },
  { id: 'EGY-A5', name: 'Gardenia Bldg - 4th Floor Apt 1', location: 'Egypt', type: 'Apartment', rentalIncome: 8500, marketValue: 3000000, currency: 'EGP' },
  { id: 'EGY-A6', name: 'Gardenia Bldg - 4th Floor Apt 2', location: 'Egypt', type: 'Apartment', rentalIncome: 8500, marketValue: 3000000, currency: 'EGP' },
  { id: 'EGY-A7', name: 'Gardenia Bldg - Basement', location: 'Egypt', type: 'Basement', rentalIncome: 0, marketValue: 4000000, currency: 'EGP' },
  { id: 'EGY-A8', name: 'Lotus Area Apartment', location: 'Egypt', type: 'Apartment', rentalIncome: 11000, marketValue: 6000000, currency: 'EGP' },
  { id: 'EGY-A9', name: 'Enppi Compound Apartment', location: 'Egypt', type: 'Apartment', rentalIncome: 9000, marketValue: 3500000, currency: 'EGP' },
  { id: 'EGY-A10', name: 'Land in Belqas', location: 'Egypt', type: 'Land', rentalIncome: 0, marketValue: 3000000, currency: 'EGP' },
  { id: 'EGY-A11', name: 'Miami Apartment', location: 'Egypt', type: 'Apartment', rentalIncome: 8000, marketValue: 3000000, currency: 'EGP' },
  { id: 'EGY-A12', name: 'City Light Apt 1', location: 'Egypt', type: 'Apartment', rentalIncome: 6000, marketValue: 2270000, currency: 'EGP' },
  { id: 'EGY-A13', name: 'City Light Apt 2', location: 'Egypt', type: 'Apartment', rentalIncome: 6000, marketValue: 1650000, currency: 'EGP' },

  // Turkey Assets
  { id: 'TUR-A1', name: 'Neurol Park Apt', location: 'Turkey', type: 'Apartment', rentalIncome: 23000, marketValue: 175000 * (1/TRY_TO_USD), currency: 'TRY' },
  { id: 'TUR-A2', name: 'Adres Atakent Apt', location: 'Turkey', type: 'Apartment', rentalIncome: 29000, marketValue: 175000 * (1/TRY_TO_USD), currency: 'TRY' },
  { id: 'TUR-A3', name: 'Innovia Apt 1', location: 'Turkey', type: 'Apartment', rentalIncome: 13000, marketValue: 95000 * (1/TRY_TO_USD), currency: 'TRY' },
  { id: 'TUR-A4', name: 'Innovia Apt 2', location: 'Turkey', type: 'Apartment', rentalIncome: 20000, marketValue: 60000 * (1/TRY_TO_USD), currency: 'TRY' },

  // Cash and Other Assets
  { id: 'CASH-EGP', name: 'Cash in EGP', location: 'Egypt', type: 'Cash', rentalIncome: 0, marketValue: 2323596, currency: 'EGP' },
  { id: 'CASH-KWD', name: 'Cash in KWD', location: 'Egypt', type: 'Cash', rentalIncome: 0, marketValue: 11622, currency: 'KWD' },
  { id: 'CASH-TRY', name: 'Cash in TRY', location: 'Turkey', type: 'Cash', rentalIncome: 0, marketValue: 115924, currency: 'TRY' },
  // Assuming gold price around $75/gram
  { id: 'GOLD', name: 'Gold Bars (300g)', location: 'Egypt', type: 'Gold', rentalIncome: 0, marketValue: 300 * 75 * (1/EGP_TO_USD), currency: 'EGP' },
  { id: 'REC-Mahmoud', name: 'Receivable from Mahmoud', location: 'Egypt', type: 'Receivable', rentalIncome: 0, marketValue: 677, currency: 'KWD' },
  { id: 'RET-KOC', name: 'End of Service (KOC)', location: 'Egypt', type: 'Cash', rentalIncome: 0, marketValue: 82000, currency: 'KWD' },
];

export const liabilities: Liability[] = [
  // Egypt Liabilities
  { id: 'L-Nile1', name: 'Nile Dev - Admin Unit', type: 'Real Estate', totalAmount: 0, amountPaid: 0, monthlyInstallment: 241500 / 12, currency: 'EGP', dueDate: '2030-07-01' },
  { id: 'L-Nile2', name: 'Nile Dev - Commercial Unit', type: 'Real Estate', totalAmount: 0, amountPaid: 0, monthlyInstallment: 844700 / 12, currency: 'EGP', dueDate: '2030-07-01' },
  { id: 'L-Nile3', name: 'Nile Dev - Tycoon Hotel (x2)', type: 'Real Estate', totalAmount: 0, amountPaid: 0, monthlyInstallment: (1596300 * 2) / 12, currency: 'EGP', dueDate: '2030-03-01' },
  { id: 'L-Mercon', name: 'MERCON - Nurai Studio', type: 'Real Estate', totalAmount: 0, amountPaid: 0, monthlyInstallment: 542372 / 12, currency: 'EGP', dueDate: '2030-12-25' },
  { id: 'L-TajMisr', name: 'Taj Misr - Dejoya', type: 'Real Estate', totalAmount: 0, amountPaid: 1181250, monthlyInstallment: (1181250 * 4) / 12, currency: 'EGP', dueDate: '2035-05-17' },
  
  // Kuwait Liabilities
  { id: 'L-Gulf1', name: 'Gulf Bank Loan 1', type: 'Loan', totalAmount: 20000, amountPaid: 2596, monthlyInstallment: 395.860, currency: 'KWD', dueDate: '2029-10-01' },
  { id: 'L-Gulf2', name: 'Gulf Bank Loan 2', type: 'Loan', totalAmount: 6238, amountPaid: 1268, monthlyInstallment: 124.258, currency: 'KWD', dueDate: '2028-05-01' },
  { id: 'L-Gulf3', name: 'Gulf Bank Loan 3', type: 'Loan', totalAmount: 23000, amountPaid: 602, monthlyInstallment: 456.543, currency: 'KWD', dueDate: '2029-09-01' },
  { id: 'L-KOC', name: 'KOC Loan', type: 'Loan', totalAmount: 12396, amountPaid: 11696, monthlyInstallment: 344, currency: 'KWD', dueDate: '2025-08-01' },
];


export const upcomingPaymentsData: UpcomingPayment[] = [
    { id: 'p1', name: 'Gulf Bank Loan 1', amount: 395.860, currency: 'KWD', dueDate: '2025-08-01' },
    { id: 'p2', name: 'Gulf Bank Loan 2', amount: 124.258, currency: 'KWD', dueDate: '2025-08-01' },
    { id: 'p3', name: 'Gulf Bank Loan 3', amount: 456.543, currency: 'KWD', dueDate: '2025-08-01' },
    { id: 'p4', name: 'KOC Loan', amount: 344, currency: 'KWD', dueDate: '2025-08-01' },
    { id: 'p5', name: 'Taj Misr Installment', amount: 1181250, currency: 'EGP', dueDate: '2025-08-17' },
    { id: 'p6', name: 'Nile Dev - Tycoon', amount: 1596300, currency: 'EGP', dueDate: '2025-09-01' },
    { id: 'p7', name: 'MERCON - Nurai', amount: 135593, currency: 'EGP', dueDate: '2025-09-25' },
];

export const upcomingRentsData: UpcomingRent[] = [
    { id: 'r1', property: 'Lotus Area Apartment', amount: 11000, currency: 'EGP', dueDate: '2025-08-01' },
    { id: 'r2', property: 'Gardenia Bldg - G-Floor', amount: 8500, currency: 'EGP', dueDate: '2025-09-01' },
    { id: 'r3', property: 'Gardenia Bldg - 3rd Floor', amount: 10000, currency: 'EGP', dueDate: '2025-10-01' },
    { id: 'r4', property: 'Gardenia Bldg - 2nd Floor', amount: 11000, currency: 'EGP', dueDate: '2025-11-01' },
    { id: 'r5', property: 'Enppi Compound Apartment', amount: 9000, currency: 'EGP', dueDate: '2025-11-01' },
];

export const cashFlowItems: CashFlowItem[] = [
    { name: 'Salary', amount: 4000, currency: 'KWD', type: 'Income', category: 'Salary'},
    // Rental income will be calculated dynamically
    { name: 'Household Expenses (Egypt)', amount: 80000, currency: 'EGP', type: 'Expense', category: 'Household'},
    { name: 'Household Expenses (Kuwait)', amount: 350, currency: 'KWD', type: 'Expense', category: 'Household'},
    // Installments will be calculated dynamically
];
